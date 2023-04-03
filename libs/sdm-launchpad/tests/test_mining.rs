mod common;

use anyhow::Error;
use common::TestStateInner;
use tari_launchpad_protocol::container::TaskStatus;
use tari_sdm::ids::{ManagedTask, TaskId};
use tari_sdm_launchpad::resources::images;

#[tokio::test]
async fn test_sdm_mining() -> Result<(), Error> {
    let mut state = TestState::initialize()?;
    let mut done = false;
    while !done {
        done = state.step().await?;
    }
    Ok(())
}

enum Status {
    Init,
    /// Waiting when all containers will be active
    ContainersActivated,
    MiningActivated,
    WaitMining,
    ContainersDeactivated,
}

struct TestState {
    initial_funds: u64,
    status: Status,
    wallet_containers: Vec<TaskId>,
    mining_containers: Vec<TaskId>,
    inner: TestStateInner,
}

impl TestState {
    fn initialize() -> Result<Self, Error> {
        let inner = TestStateInner::setup(1200)?;
        let wallet_containers = vec![images::Tor::id(), images::TariBaseNode::id(), images::TariWallet::id()];
        let mining_containers = vec![images::TariSha3Miner::id()];
        Ok(Self {
            initial_funds: 0,
            status: Status::Init,
            wallet_containers,
            mining_containers,
            inner,
        })
    }

    async fn step(&mut self) -> Result<bool, Error> {
        self.inner.step().await?;
        if self.inner.state.is_some() {
            self.check()
        } else {
            Ok(false)
        }
    }

    fn check(&mut self) -> Result<bool, Error> {
        match self.status {
            Status::Init => {
                self.inner.change_session(|session| {
                    session.tor_active = true;
                    session.base_node_active = true;
                    session.wallet_active = true;
                })?;
                self.status = Status::ContainersActivated;
            },
            Status::ContainersActivated => {
                if self
                    .inner
                    .check_containers(&self.wallet_containers, TaskStatus::is_active)
                {
                    // Try to store initial amount of funds
                    if self.set_init_funds() {
                        self.inner.change_session(|session| {
                            session.miner_active = true;
                        })?;
                        self.status = Status::MiningActivated;
                    }
                }
            },
            Status::MiningActivated => {
                if self
                    .inner
                    .check_containers(&self.mining_containers, TaskStatus::is_active)
                {
                    self.status = Status::WaitMining;
                }
            },
            Status::WaitMining => {
                if self.is_mined() {
                    self.inner.change_session(|session| {
                        session.tor_active = false;
                        session.base_node_active = false;
                        session.wallet_active = false;
                        session.miner_active = false;
                    })?;
                    self.status = Status::ContainersDeactivated;
                }
            },
            Status::ContainersDeactivated => {
                if self
                    .inner
                    .check_containers(&self.wallet_containers, TaskStatus::is_inactive) &&
                    self.inner
                        .check_containers(&self.mining_containers, TaskStatus::is_inactive)
                {
                    return Ok(true);
                }
            },
        }
        Ok(false)
    }

    fn set_init_funds(&mut self) -> bool {
        let balance = self
            .inner
            .state
            .as_ref()
            .and_then(|state| state.wallet.balance.as_ref());
        if let Some(balance) = balance {
            self.initial_funds = balance.available;
            true
        } else {
            false
        }
    }

    fn is_mined(&self) -> bool {
        self.inner
            .state
            .as_ref()
            .and_then(|state| state.wallet.balance.as_ref())
            .map(|balance| balance.available > self.initial_funds)
            .unwrap_or_default()
    }
}
