import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DomainEvent } from '@common/base/base.domain-event';
import { AggregateRoot, generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

import { IEventStore } from '@core/event-sourcing/event-store.interface';

@Injectable()
export class EventStore implements IEventStore {
  constructor(
    @Inject(PRISMA_SERVICE) private readonly prismaService: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async storeAggregateEvents(
    aggregateRoot: AggregateRoot<unknown>,
  ): Promise<DomainEvent[]> {
    const events = aggregateRoot.getUncommittedEvents();
    if (events.length === 0) {
      return [];
    }

    const aggregate = events[0].aggregate;

    const repository = this.getRepository(aggregate);

    if (repository === undefined) {
      return events;
    }

    const result = await repository.findFirst({
      select: {
        version: true,
      },
      where: {
        aggregateId: BigInt(aggregateRoot.id),
      },
      orderBy: {
        id: 'desc',
      },
    });

    const version = result?.version || 0;

    await repository.createMany({
      data: events.map((event, idx) => {
        return {
          id: BigInt(generateEntityId()),
          actorId: BigInt(event.actorId),
          aggregateId: BigInt(event.aggregateId),
          eventName: event.eventName,
          eventPayload: event.eventPayload,
          version: version + idx + 1,
          storedAt: event.storedAt,
        };
      }),
    });

    events.forEach((event) => this.eventEmitter.emit(event.eventName, event));

    return events;
  }

  private getRepository(aggregate: DomainEvent['aggregate']) {
    if (aggregate === 'Account') {
      return this.prismaService.accountDomainEvent;
    }
  }
}
