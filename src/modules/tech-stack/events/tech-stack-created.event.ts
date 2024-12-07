import { DomainEvent } from '@common/base/base.domain-event';

interface TechStackCreatedEventPayload {
  name: string;
}

export class TechStackCreatedEvent extends DomainEvent<TechStackCreatedEventPayload> {
  readonly aggregate = 'TechStack';
}
