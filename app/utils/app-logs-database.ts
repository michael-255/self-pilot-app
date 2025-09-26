import Dexie, { liveQuery, type Observable, type Table } from 'dexie'
import z from 'zod'
import { appTitle } from './constants'

export const logLevels = z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR'])

export type LogLevel = z.infer<typeof logLevels>

/**
 * App Log entry stored in the IndexedDB database.
 */
export class AppLog {
  autoId?: number // Auto-incremented by Dexie
  created_at: string
  log_level: LogLevel
  label: string
  details?: Record<string, any>

  constructor(logLevel: LogLevel, label: string, details?: Record<string, any> | Error) {
    this.created_at = new Date().toISOString()
    this.log_level = logLevel
    this.label = label

    if (details instanceof Error) {
      this.details = {
        name: details.name,
        message: details.message,
        stack: details.stack,
      }
    } else {
      this.details = details
    }
  }
}

/**
 * Local Dexie.js database for storing application logs in IndexedDB.
 */
export class AppLogsDatabase extends Dexie {
  // Required for easier TypeScript usage
  logs!: Table<AppLog>

  constructor(name: string) {
    super(name)
    this.version(1).stores({ logs: '++autoId, created_at' })
    this.logs.mapToClass(AppLog)
  }

  /**
   * Deletes all logs older than the retention duration.
   * @returns The number of logs deleted
   */
  async deleteExpiredLogs() {
    // Hardcoded retention duration: 6 months (15,552,000,000 ms)
    const retentionDuration = 15_552_000_000
    const allLogs = await this.logs.toArray()
    const now = Date.now()

    // Find Logs that are older than the retention time and map them to their keys
    const removableLogs = allLogs
      .filter((log: AppLog) => {
        // Skip logs with invalid dates instead of marking them for deletion
        if (!log.created_at) {
          return false
        }
        const logTimestamp = new Date(log.created_at).getTime()
        const logAge = now - logTimestamp
        return logAge > retentionDuration
      })
      .map((log: AppLog) => log.autoId) // Map remaining Log ids for removal

    await this.logs.bulkDelete(removableLogs as number[])
    return removableLogs.length // Number of logs deleted
  }

  /**
   * Returns an observable of the logs in the database. The logs are ordered by created_at in
   * descending order. This is a live query, so it will update automatically when the database
   * changes.
   */
  liveLogs(): Observable<AppLog[]> {
    return liveQuery(() => this.logs.orderBy('created_at').reverse().toArray())
  }
}

/**
 * Pre-instantiated app logs database for use throughout the application.
 */
export const appLogsDatabase = new AppLogsDatabase(appTitle)
