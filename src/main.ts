import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { toListen } from './toListen';
import { folders } from './configs/google.folders';
import { genToken } from './genToken';
import { toDownload } from './toDownload';
import { toUpload } from './toUpload';
import { orchestrator } from './orchestrator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3000);

  await orchestrator()  
}

bootstrap();
