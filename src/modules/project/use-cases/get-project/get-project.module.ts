import { Module } from '@nestjs/common';

import { ProjectRepositoryModule } from '@module/project/repositories/project.repository.module';
import { GetProjectController } from '@module/project/use-cases/get-project/get-project.controller';
import { GetProjectHandler } from '@module/project/use-cases/get-project/get-project.handler';

@Module({
  imports: [ProjectRepositoryModule],
  controllers: [GetProjectController],
  providers: [GetProjectHandler],
})
export class GetProjectModule {}
