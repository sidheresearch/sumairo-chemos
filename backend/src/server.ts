import 'dotenv/config';
import { createApp } from './config/app';
import { sequelize } from './config/database';

// Register Sequelize models
import './db/SalesPunchModel';
import './db/SaleModel';

const PORT = Number(process.env.PORT) || 4000;
const SCHEMA = process.env.DB_SCHEMA ?? 'sumairochemos';

async function bootstrap() {
  // Ensure schema exists, then sync tables (create if not present)
  await sequelize.query(`CREATE SCHEMA IF NOT EXISTS "${SCHEMA}"`);
  await sequelize.sync();
  console.log(`[db] schema "${SCHEMA}" ready, tables synced`);

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[server] running on http://localhost:${PORT}`);
    console.log(`[server] environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
}

bootstrap().catch((err) => {
  console.error('[startup] fatal error:', err);
  process.exit(1);
});
