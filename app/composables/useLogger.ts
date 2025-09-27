/**
 * Logger for the Vue application frontend code.
 */
export default function useLogger() {
  const toast = useToast()
  const consoleLogs = useLocalStorage('console-logs', true)

  const loggerName = `%c${appTitle}`
  const baseStyle = 'border-radius: 3px; padding: 2px 4px; color: white; background-color:'
  const style = {
    debug: `${baseStyle} blueviolet;`,
    info: `${baseStyle} dodgerblue;`,
    warn: `${baseStyle} darkorange;`,
    error: `${baseStyle} firebrick;`,
  }

  async function debug(label: string, details?: any) {
    if (import.meta.env.DEV) {
      await appLogsDatabase.logs.add(new AppLog(logLevels.enum.DEBUG, label, details))
      console.log(loggerName, style.debug, `[${logLevels.enum.DEBUG}]`, label, details)
    }
  }

  async function info(label: string, details?: any) {
    await appLogsDatabase.logs.add(new AppLog(logLevels.enum.INFO, label, details))
    if (consoleLogs.value) {
      console.info(loggerName, style.info, `[${logLevels.enum.INFO}]`, label, details)
    }
    toast.add({ color: 'info', title: label })
  }

  async function warn(label: string, details?: any) {
    await appLogsDatabase.logs.add(new AppLog(logLevels.enum.WARN, label, details))
    if (consoleLogs.value) {
      console.warn(loggerName, style.warn, `[${logLevels.enum.WARN}]`, label, details)
    }
    toast.add({ color: 'warning', title: label })
  }

  async function error(label: string, details?: any) {
    await appLogsDatabase.logs.add(new AppLog(logLevels.enum.ERROR, label, details))
    if (consoleLogs.value) {
      console.error(loggerName, style.error, `[${logLevels.enum.ERROR}]`, label, details)
    }
    toast.add({ color: 'error', title: label })
  }

  return {
    debug,
    info,
    warn,
    error,
  }
}
