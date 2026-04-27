import { useStore } from '../store';

/**
 * ViewModel for workflow execution, tracing, and logging.
 */
export const useExecutionViewModel = () => {
  const isRunning = useStore(s => s.isRunning);
  const runningNodeIds = useStore(s => s.runningNodeIds);
  const liveTrace = useStore(s => s.liveTrace);
  const executionTime = useStore(s => s.executionTime);
  const runWorkflow = useStore(s => s.runWorkflow);
  const stopWorkflow = useStore(s => s.stopWorkflow);
  const clearLogs = useStore(s => s.clearLogs);

  return {
    isRunning,
    runningNodeIds,
    liveTrace,
    executionTime,
    runWorkflow,
    stopWorkflow,
    clearLogs
  };
};
