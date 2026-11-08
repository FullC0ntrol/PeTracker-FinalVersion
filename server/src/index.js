// Punkt startowy: sprawdź bazę, ewentualnie wczytaj dane demo, uruchom HTTP.
import { createApp } from './app.js'
import { config } from './config.js'
import { query } from './db.js'
import { seedDemoDataIfEmpty } from './seed.js'

// Bez bazy serwer i tak nic nie zrobi, więc od razu kończymy z czytelnym błędem.
await query('SELECT 1')
if (config.seedDemoData) await seedDemoDataIfEmpty()

createApp().listen(config.port, () => {
  console.log(`API działa na http://localhost:${config.port}`)
})
