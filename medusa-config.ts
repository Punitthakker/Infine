import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// On Railway the public domain is injected automatically, so the admin URL and CORS
// settings work without typing the URL in. Explicit variables still win.
const SELF = process.env.MEDUSA_BACKEND_URL
  || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : undefined)
const STORE = 'https://infine.world,https://www.infine.world,https://infine-1grh.netlify.app'

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    workerMode: (process.env.MEDUSA_WORKER_MODE as 'shared' | 'worker' | 'server') || 'shared',
    http: {
      storeCors: process.env.STORE_CORS || STORE,
      adminCors: process.env.ADMIN_CORS || SELF || '',
      authCors: process.env.AUTH_CORS || SELF || '',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  admin: {
    backendUrl: SELF || '/',
    disable: process.env.DISABLE_MEDUSA_ADMIN === 'true',
  },
})
