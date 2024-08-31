import { Module } from '@nestjs/common';

import { CreateTechStackModule } from '@module/tech-stack/use-cases/create-tech-stack/create-tech-stack.module';
import { ListTechStacksModule } from '@module/tech-stack/use-cases/list-tech-stacks/list-tech-stacks.module';

@Module({
  imports: [ListTechStacksModule, CreateTechStackModule],
})
export class TechStackModule {}
