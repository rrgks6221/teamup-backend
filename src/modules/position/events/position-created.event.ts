import { DomainEvent } from '@common/base/base.domain-event';

interface PositionCreatedEventPayload {
  name: string;
}

export class PositionCreatedEvent extends DomainEvent<PositionCreatedEventPayload> {
  readonly aggregate = 'Position';
}
