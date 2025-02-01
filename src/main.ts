import {
  createApp,
  setGlobalExceptionFilter,
  setGlobalInterceptor,
  setGlobalPipe,
  setLogger,
  setSwagger,
} from 'src/bootstrap';

async function bootstrap() {
  const app = await createApp();

  setGlobalPipe(app);
  setLogger(app);
  setGlobalInterceptor(app);
  setGlobalExceptionFilter(app);
  setSwagger(app);

  app.enableShutdownHooks();

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`);
  });
}
bootstrap();
