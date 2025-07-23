import path from 'node:path'
import Database from 'better-sqlite3'

const DATABASE_PATH = 'data/database.sqlite'

const database = new Database(DATABASE_PATH)

database.pragma('foreign_keys=ON')
database.pragma('journal_mode=WAL')
database.pragma('synchronous=NORMAL')
database.pragma('mmap_size=268435456')
database.pragma('journal_size_limit=27103364')
database.pragma('cache_size=10000')
database.pragma('busy_timeout=5000')
database.pragma('temp_store=MEMORY')

export default database