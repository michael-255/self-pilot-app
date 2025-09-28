/**
 * Composable for logging messages to local storage on the client.
 */
export default function useLogger() {
  const toast = useToast()

  const loggerName = `%c${appTitle}`
  const baseStyle = 'border-radius: 3px; padding: 2px 4px; color: white; background-color:'
  const style = {
    debug: `${baseStyle} blueviolet;`,
    info: `${baseStyle} dodgerblue;`,
    warn: `${baseStyle} darkorange;`,
    error: `${baseStyle} firebrick;`,
  }

  const debug = async (label: string, details?: any) => {
    // Debug logs are only stored in dev mode
    if (import.meta.env.DEV) {
      await logsDatabase.logs.add(new AppLog(logLevels.enum.Debug, label, details))
      console.log(loggerName, style.debug, `[${logLevels.enum.Debug}]`, label, details)
    }
  }

  const info = async (label: string, details?: any) => {
    await logsDatabase.logs.add(new AppLog(logLevels.enum.Info, label, details))
    if (import.meta.env.DEV) {
      console.info(loggerName, style.info, `[${logLevels.enum.Info}]`, label, details)
    }
    toast.add({ color: 'info', title: label })
  }

  const warn = async (label: string, details?: any) => {
    await logsDatabase.logs.add(new AppLog(logLevels.enum.Warn, label, details))
    if (import.meta.env.DEV) {
      console.warn(loggerName, style.warn, `[${logLevels.enum.Warn}]`, label, details)
    }
    toast.add({ color: 'warning', title: label })
  }

  const error = async (label: string, details?: any) => {
    await logsDatabase.logs.add(new AppLog(logLevels.enum.Error, label, details))
    if (import.meta.env.DEV) {
      console.error(loggerName, style.error, `[${logLevels.enum.Error}]`, label, details)
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
