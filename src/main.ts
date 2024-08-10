import {
  createApp,
  setGlobalExceptionFilter,
  setGlobalInterceptor,
  setGlobalPipe,
  setLogger,
} from 'src/bootstrap';
import { SwaggerConfig } from 'src/swagger';

async function bootstrap() {
  const app = await createApp();

  setGlobalPipe(app);
  setLogger(app);
  setGlobalInterceptor(app);
  setGlobalExceptionFilter(app);
  SwaggerConfig.setup(app);
  app.enableShutdownHooks();

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`);
  });
}
bootstrap();
