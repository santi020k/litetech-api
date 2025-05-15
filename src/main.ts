import { AppModule } from './app.module';

import { NestFactory } from '@nestjs/core';

const bootstrap = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
