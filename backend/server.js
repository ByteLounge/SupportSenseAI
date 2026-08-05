/**
 * HTTP Server Entrypoint: server.js
 * Lead Engineer: Member 2 (Backend Lead)
 * Description: Boots up Express HTTP server on configured port.
 */

const app = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');

const initializeDatabase = require('./src/config/dbInit');

initializeDatabase().then(() => {
  const server = app.listen(env.PORT, () => {
    logger.info(`========================================================`);
    logger.info(`🚀 SupportSense AI Express Backend running on PORT ${env.PORT}`);
    logger.info(`📄 Swagger Documentation available at http://localhost:${env.PORT}/api-docs`);
    logger.info(`========================================================`);
  });

  // Handle graceful shutdown signals
  process.on('SIGTERM', () => {
    logger.warn('SIGTERM signal received. Closing HTTP server...');
    server.close(() => {
      logger.info('HTTP server closed. Exiting process.');
      process.exit(0);
    });
  });
});
