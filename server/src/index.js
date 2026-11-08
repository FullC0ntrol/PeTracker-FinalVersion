import { createApp } from './app.js';
import { config } from './config.js'
import { pool } from './db.js'
import { seedDemoDataIfEmpty } from './seed.js'

await pool.query('SELECT 1')
if (config.seedDemoData) await seedDemoDataIfEmpty()

const server = createApp().listen(config.port, () => {
  console.log(`API PetTracer działa na localhost: ${config.port}`);
})
