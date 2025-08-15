import app from './app';
import { config } from './config/environment';
import { Logger } from './utils/logger';

app.listen(config.port, () => {
  Logger.info(`Server running on http://localhost:${config.port}`);
  Logger.info(`Environment: ${config.nodeEnv}`);
});
