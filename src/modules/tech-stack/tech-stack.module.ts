import { Module } from '@nestjs/common';

import { ListTechStacksModule } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.module';

@Module({
  imports: [ListTechStacksModule],
})
export class TechStackModule {}
