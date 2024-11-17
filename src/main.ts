import {
  createApp,
  setGlobalInterceptor,
  setGlobalPipe,
  setSwagger,
} from '@src/bootstrap';

async function bootstrap() {
  const app = await createApp();

  setGlobalPipe(app);
  setGlobalInterceptor(app);
  setSwagger(app);

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`);
  });
}
bootstrap();
