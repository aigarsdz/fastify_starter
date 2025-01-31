const path = require('path')
const Database = require('better-sqlite3')

const DATABASE_PATH = path.join(path.dirname(__dirname), 'data/database.sqlite')

const database = new Database(DATABASE_PATH)

database.pragma('foreign_keys=ON')
database.pragma('journal_mode=WAL')
database.pragma('synchronous=NORMAL')
database.pragma('mmap_size=268435456')
database.pragma('journal_size_limit=27103364')
database.pragma('cache_size=10000')
database.pragma('busy_timeout=5000')
database.pragma('temp_store=MEMORY')

module.exports = database