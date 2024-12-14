import { Module } from '@nestjs/common';

import { CreateProjectModule } from '@module/project/use-cases/create-project/create-project.module';

@Module({
  imports: [CreateProjectModule],
})
export class ProjectModule {}
