import { useEffect } from 'react';

// import { invoke } from "@tauri-apps/api/tauri";
// import './App.css';
import { emit, listen } from '@tauri-apps/api/event';
import MainLayout from './theme/MainLayout';
import useAppStateStore from './store/appStateStore';
import useConfigStore from './store/configStore';
import MainTabs from './containers/Dashboard/DashboardContainer/MainTabs';
import SettingsDialog from './containers/SettingsContainer/SettingsDialog';
import DockerWarning from './containers/DockerWarning/DockerWarning';
import MiningScheduleDialog from './containers/MiningContainer/MiningSchedule/MiningScheduleDialog';
import { useShallow } from 'zustand/react/shallow';

function App() {
  const {
    appState,
    setAppState,
    containers,
    setContainers,
    setIsMining,
    setIsChangingMining,
    openDockerWarning,
    setOpenDockerWarning,
    setTariAddress,
    setNetwork,
    openSettings,
    shaTime,
    setShaTime,
    shaTimerOn,
    mergeTime,
    setMergeTime,
    mergeTimerOn,
    openSchedule,
    startBaseNode,
    startMining,
  } = useAppStateStore(
    useShallow((state) => ({
      appState: state.appState,
      setAppState: state.setAppState,
      containers: state.containers,
      setContainers: state.setContainers,
      setIsMining: state.setIsMining,
      setIsChangingMining: state.setIsChangingMining,
      openDockerWarning: state.openDockerWarning,
      setOpenDockerWarning: state.setOpenDockerWarning,
      setTariAddress: state.setTariAddress,
      setNetwork: state.setNetwork,
      openSettings: state.openSettings,
      shaTime: state.shaTime,
      setShaTime: state.setShaTime,
      shaTimerOn: state.shaTimerOn,
      mergeTime: state.mergeTime,
      setMergeTime: state.setMergeTime,
      mergeTimerOn: state.mergeTimerOn,
      openSchedule: state.openSchedule,
      startBaseNode: state.startBaseNode,
      startMining: state.startMining,
    }))
  );
  const { startupConfig } = useConfigStore();

  //   async function connect() {
  //     // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //     //setGreetMsg(await invoke("greet", { name }));
  //     emit('tari://actions', { Action: { type: 'Connect' } });
  //   }

  // This only happens once
  useEffect(() => {
    // wait for listener to have been set up
    setTimeout(() => {
      console.log('Connecting');
      emit('tari://actions', { Action: { type: 'Connect' } });
    }, 1000);

    // setInterval(function () {
    //   emit("tari://actions", { "Action": { type: "Connect" } });
    // }, 1000);
  }, []);

  // this needs to happen every state refresh
  useEffect(() => {
    let unlisten = (async () =>
      await listen('tari://reactions', (event) => {
        let payload: any = event.payload;
        // console.log(event);
        if (payload?.State !== undefined) {
          setAppState(payload?.State);
          //  console.log(payload?.State);
          let newContainers: any = { ...containers };
          if (payload?.State?.containers !== undefined) {
            // Check if docker is running
            // if (payload?.State?.containers["Tor"].status.hasOwnProperty("Failed")) {
            // console.log("Docker is not running");
            // setOpenDockerWarning(true);
            // return;
            // }

            // We have to do this because some supersmart developer
            // used strings as keys with spaces in them
            newContainers.tor = normalizeContainer(
              payload?.State?.containers['Tor']
            );
            newContainers.baseNode = normalizeContainer(
              payload?.State?.containers['Base Node']
            );
            newContainers.sha3Miner = normalizeContainer(
              payload?.State?.containers['Sha3Miner']
            );
            newContainers.sharedVolume = normalizeContainer(
              payload?.State?.containers['SharedVolume']
            );
            newContainers.mmProxy = normalizeContainer(
              payload?.State?.containers['MM proxy']
            );
            newContainers.loki = normalizeContainer(
              payload?.State?.containers['Loki']
            );
            newContainers.grafana = normalizeContainer(
              payload?.State?.containers['Grafana']
            );
            newContainers.xmrig = normalizeContainer(
              payload?.State?.containers['Xmrig']
            );
            setContainers(newContainers);

            setIsMining(
              payload?.State?.config?.session?.merge_layer_active ||
                payload?.State?.config?.session?.sha3x_layer_active
            );

            setIsChangingMining(false);
            setTariAddress(
              appState?.config?.settings?.saved_settings?.mm_proxy
                .wallet_payment_address ||
                appState?.config?.settings?.saved_settings?.sha3_miner
                  ?.wallet_payment_address ||
                ''
            );
          }
        }
        if (payload?.Delta !== undefined) {
          if (payload?.Delta.UpdateSession) {
            let newState: any = appState;
            newState.config.session = payload?.Delta.UpdateSession;
            console.log(newState);
            setIsChangingMining(false);
            setAppState(newState);
            setIsMining(
              newState.config?.session?.merge_layer_active ||
                newState.config?.session?.sha3x_layer_active
            );
          }
          if (payload?.Delta.TaskDelta) {
            let delta: any = payload?.Delta.TaskDelta?.delta;
            // console.log(delta);
            let id = payload?.Delta.TaskDelta?.id;
            if (delta.UpdateStatus) {
              let newState: any = { ...appState };
              // console.log(delta.UpdateStatus);

              newState.containers[payload?.Delta.TaskDelta?.id].status =
                delta.UpdateStatus;
              // if (delta.UpdateStatus?.Progress) {
              // newState.containers[payload?.Delta.TaskDelta?.id].status = delta.UpdateStatus?.Progress?.stage;
              // setAppState(newState);
              // }
              setAppState(newState);
              let newContainers: any = {
                ...containers,
              };
              if (id === 'Tor') {
                newContainers.tor.status = printStatus(delta.UpdateStatus);
              }
              if (id === 'Base Node') {
                newContainers.baseNode.status = printStatus(delta.UpdateStatus);
              }
              if (id === 'Sha3Miner') {
                newContainers.sha3Miner.status = printStatus(
                  delta.UpdateStatus
                );
              }
              if (id === 'SharedVolume') {
                newContainers.sharedVolume.status = printStatus(
                  delta.UpdateStatus
                );
              }
              if (id === 'MM proxy') {
                newContainers.mmProxy.status = printStatus(delta.UpdateStatus);
              }
              if (id === 'Loki') {
                newContainers.loki.status = printStatus(delta.UpdateStatus);
              }
              if (id === 'Grafana') {
                newContainers.grafana.status = printStatus(delta.UpdateStatus);
              }
              if (id === 'Xmrig') {
                newContainers.xmrig.status = printStatus(delta.UpdateStatus);
              }
              setContainers(newContainers);
            }
            // stats records
            if (delta.StatsRecord) {
              let newContainers: any = {
                ...containers,
              };
              if (id === 'Tor') {
                // console.log(delta.StatsRecord);
                if (
                  delta.StatsRecord.timestamp !==
                  newContainers.tor.stats?.timestamp
                ) {
                  let last_cpu = newContainers.tor.stats?.cpu_usage;
                  let last_system_cpu =
                    newContainers.tor.stats?.system_cpu_usage;
                  newContainers.tor.stats = delta.StatsRecord;
                  newContainers.tor.stats.cpu =
                    ((delta.StatsRecord.cpu_usage - last_cpu) /
                      (delta.StatsRecord.system_cpu_usage - last_system_cpu)) *
                    100;
                }
              }
              if (id === 'Base Node') {
                if (
                  delta.StatsRecord.timestamp !==
                  newContainers.baseNode.stats?.timestamp
                ) {
                  let last_cpu = newContainers.baseNode.stats?.cpu_usage;
                  let last_system_cpu =
                    newContainers.baseNode.stats?.system_cpu_usage;
                  newContainers.baseNode.stats = delta.StatsRecord;
                  newContainers.baseNode.stats.cpu =
                    ((delta.StatsRecord.cpu_usage - last_cpu) /
                      (delta.StatsRecord.system_cpu_usage - last_system_cpu)) *
                    100;
                }
              }
              if (id === 'Sha3Miner') {
                if (
                  delta.StatsRecord.timestamp !==
                  newContainers.sha3Miner.stats?.timestamp
                ) {
                  let last_cpu = newContainers.sha3Miner.stats?.cpu_usage;
                  let last_system_cpu =
                    newContainers.sha3Miner.stats?.system_cpu_usage;
                  newContainers.sha3Miner.stats = delta.StatsRecord;
                  newContainers.sha3Miner.stats.cpu =
                    ((delta.StatsRecord.cpu_usage - last_cpu) /
                      (delta.StatsRecord.system_cpu_usage - last_system_cpu)) *
                    100;
                }
              }
              if (id === 'SharedVolume') {
                if (
                  delta.StatsRecord.timestamp !==
                  newContainers.sharedVolume.stats?.timestamp
                ) {
                  let last_cpu = newContainers.sharedVolume.stats?.cpu_usage;
                  let last_system_cpu =
                    newContainers.sharedVolume.stats?.system_cpu_usage;
                  newContainers.sharedVolume.stats = delta.StatsRecord;
                  newContainers.sharedVolume.stats.cpu =
                    ((delta.StatsRecord.cpu_usage - last_cpu) /
                      (delta.StatsRecord.system_cpu_usage - last_system_cpu)) *
                    100;
                }
              }
              if (id === 'MM proxy') {
                if (
                  delta.StatsRecord.timestamp !==
                  newContainers.mmProxy.stats?.timestamp
                ) {
                  let last_cpu = newContainers.mmProxy.stats?.cpu_usage;
                  let last_system_cpu =
                    newContainers.mmProxy.stats?.system_cpu_usage;
                  newContainers.mmProxy.stats = delta.StatsRecord;
                  newContainers.mmProxy.stats.cpu =
                    ((delta.StatsRecord.cpu_usage - last_cpu) /
                      (delta.StatsRecord.system_cpu_usage - last_system_cpu)) *
                    100;
                }
              }
              if (id === 'Loki') {
                if (
                  delta.StatsRecord.timestamp !==
                  newContainers.loki.stats?.timestamp
                ) {
                  let last_cpu = newContainers.loki.stats?.cpu_usage;
                  let last_system_cpu =
                    newContainers.loki.stats?.system_cpu_usage;
                  newContainers.loki.stats = delta.StatsRecord;
                  newContainers.loki.stats.cpu =
                    ((delta.StatsRecord.cpu_usage - last_cpu) /
                      (delta.StatsRecord.system_cpu_usage - last_system_cpu)) *
                    100;
                }
              }
              if (id === 'Grafana') {
                if (
                  delta.StatsRecord.timestamp !==
                  newContainers.grafana.stats?.timestamp
                ) {
                  let last_cpu = newContainers.grafana.stats?.cpu_usage;
                  let last_system_cpu =
                    newContainers.grafana.stats?.system_cpu_usage;
                  newContainers.grafana.stats = delta.StatsRecord;
                  newContainers.grafana.stats.cpu =
                    ((delta.StatsRecord.cpu_usage - last_cpu) /
                      (delta.StatsRecord.system_cpu_usage - last_system_cpu)) *
                    100;
                }
              }
              if (id === 'Xmrig') {
                if (
                  delta.StatsRecord.timestamp !==
                  newContainers.xmrig.stats?.timestamp
                ) {
                  let last_cpu = newContainers.xmrig.stats?.cpu_usage;
                  let last_system_cpu =
                    newContainers.xmrig.stats?.system_cpu_usage;
                  newContainers.xmrig.stats = delta.StatsRecord;
                  newContainers.xmrig.stats.cpu =
                    ((delta.StatsRecord.cpu_usage - last_cpu) /
                      (delta.StatsRecord.system_cpu_usage - last_system_cpu)) *
                    100;
                }
              }
              setContainers(newContainers);
            }
            if (!delta.UpdateStatus && !delta.StatsRecord && !delta.LogRecord) {
              // No need for log records at this point
              console.log('Unknown delta: ' + JSON.stringify(delta));
            }
          }
        }
      }))();

    return () => {
      (async () => (await unlisten)())();
    };
  });

  function printStatus(status: any) {
    if (status === undefined) {
      return '...';
    }
    // Some clever developer thought it was a good idea sometimes to return a string and sometimes an object
    if (status.hasOwnProperty('Progress')) {
      return status.Progress.stage;
    }

    if (status.hasOwnProperty('Failed')) {
      setOpenDockerWarning(true);
      return 'Failed:' + status.Failed;
    }
    return status;
  }

  // async function shaMine() {
  //   let state: any = appState;
  //   let stateSession = { ...state?.config?.session };
  //   stateSession.sha3x_layer_active = stateSession.sha3x_layer_active ? false : true;
  //   emit("tari://actions", { "Action": { type: "ChangeSession", payload: stateSession } });
  // }

  function normalizeContainer(container: any) {
    return {
      ...container,
      status: printStatus(container.status),
    };
  }

  // let state: any = appState;
  //  let containers: any = state.containers;
  // console.log(containers);

  useEffect(() => {
    setNetwork(appState?.config?.settings?.saved_settings?.tari_network || '');
  }, [appState?.config?.settings?.saved_settings?.tari_network]);

  // settings that should run on first startup
  useEffect(() => {
    if (startupConfig.shaMine) {
      setTimeout(() => {
        startMining('Sha');
      }, 2000);
    }
    if (startupConfig.mergeMine) {
      setTimeout(() => {
        startMining('Merge');
      }, 2000);
    }
    if (startupConfig.baseNode) {
      setTimeout(() => {
        startBaseNode();
      }, 2000);
    }
  }, []);

  console.log(appState);

  useEffect(() => {
    let intervalId: any;
    let prevTime = shaTime;

    if (shaTimerOn) {
      intervalId = setInterval(() => {
        prevTime = prevTime + 1;
        setShaTime(prevTime);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [shaTimerOn]);

  useEffect(() => {
    let intervalId: any;
    let prevTime = mergeTime;

    if (mergeTimerOn) {
      intervalId = setInterval(() => {
        prevTime = prevTime + 1;
        setMergeTime(prevTime);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [mergeTimerOn]);

  return (
    <MainLayout>
      <MainTabs />
      {openDockerWarning && <DockerWarning />}
      {openSettings && <SettingsDialog />}
      {openSchedule && <MiningScheduleDialog />}
    </MainLayout>
  );
}

export default App;
