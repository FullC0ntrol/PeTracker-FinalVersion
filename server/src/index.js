import { createApp } from './app.js'
import { config } from './config.js'
import { query } from './db.js'
import { seedDemoDataIfEmpty } from './seed.js'

// Bez działającej bazy nie ma sensu uruchamiać serwera.
await query('SELECT 1')
if (config.seedDemoData) await seedDemoDataIfEmpty()

createApp().listen(config.port, () => {
  console.log(`API działa na http://localhost:${config.port}`)
})
