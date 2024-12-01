import { RequestContext } from 'nestjs-request-context';
import { TSID } from 'tsid-ts';

type Aggregate = 'Account' | 'Position';

export abstract class DomainEvent<Payload = Record<string, any>> {
  id: string;
  actorId: string;
  aggregateId: string;
  abstract readonly aggregate: Aggregate;
  eventName: string;
  eventPayload: Payload;
  storedAt: Date;
  version: number;

  constructor(aggregateId: string, eventPayload: Payload) {
    this.id = TSID.create().number.toString();
    this.actorId = RequestContext.currentContext.req.user?.id || undefined;
    this.aggregateId = aggregateId;
    this.eventName = this.constructor.name;
    this.eventPayload = eventPayload;
    this.storedAt = new Date();
  }
}
