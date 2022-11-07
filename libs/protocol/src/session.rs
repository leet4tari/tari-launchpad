use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
pub struct LaunchpadSession {
    pub active: bool,
}
