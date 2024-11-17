import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from '@shared/prisma/prisma.module';

import { EventStore } from '@core/event-sourcing/event-store';
import { EVENT_STORE } from '@core/event-sourcing/event-store.interface';

@Global()
@Module({
  imports: [
    PrismaModule,
    EventEmitterModule.forRoot({
      global: false,
    }),
  ],
  providers: [
    {
      provide: EVENT_STORE,
      useClass: EventStore,
    },
  ],
  exports: [EVENT_STORE],
})
export class EventStoreModule {}
