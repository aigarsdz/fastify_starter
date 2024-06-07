const { EventEmitter } = require('events')
const Database = require('better-sqlite3')

const DEFAULT_TTL = 60 * 60 * 24 * 30
const DEFAULT_TABLENAME = 'sessions'
const noop = () => {}

class SessionStore extends EventEmitter {
  #client
  ttl
  tableName

  constructor(fileName, ttl = DEFAULT_TTL, tableName = DEFAULT_TABLENAME) {
    super()

    this.client = new Database(fileName)
    this.ttl = ttl
    this.tableName = tableName

    this.client.exec(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        sid TEXT NOT NULL PRIMARY KEY,
        expiry NUMBER DEFAULT '${this.ttl}',
        data JSON NOT NULL
    )`)
  }

  get(sessionId, callback = noop) {
    this.client.prepare(`DELETE FROM ${this.tableName} where datetime('now') > datetime(expiry)`).run()

    const entry = this.client.prepare(`SELECT * FROM ${this.tableName} WHERE sid = @sid`).get({ sid: sessionId })

    if (entry && entry.data) {
      callback(null, JSON.parse(entry.data))
    } else {
      callback(null, null)
    }
  }

  set(sessionId, data, callback = noop) {
    let ttl

    if (data.cookie && data.cookie.maxAge) {
      ttl = data.cookie.maxAge
    } else {
      ttl = DEFAULT_TTL
    }

    const expiry = new Date(Date.now() + ttl).toISOString()
    const entry = { sid: sessionId, data: JSON.stringify(data), expiry }
    const result = this.client.prepare(`REPLACE INTO ${this.tableName} VALUES (@sid, @expiry, @data);`).run(entry)

    callback(null, result)
  }

  touch(sessionId, data, callback = noop) {
    const entry = { sid: sessionId }

    if (data && data.cookie && data.cookie.expires) {
      entry.expiry = new Date(data.cookie.expires).toISOString()
    } else {
      entry.expiry = new Date(Date.now() + DEFAULT_TTL).toISOString()
    }

    this.client.prepare(`UPDATE ${this.tableName} SET expiry = @expiry WHERE sid = @sid`).run(entry)

    callback(null)
  }

  destroy(sessionId, callback = noop) {
    this.client.prepare(`DELETE FROM ${this.tableName} where sid = @sid`).run({ sid: sessionId })

    callback(null)
  }
}

module.exports = SessionStore
