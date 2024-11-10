import { RequestContext } from 'nestjs-request-context';
import { TSID } from 'tsid-ts';

export abstract class DomainEvent<Payload = Record<string, unknown>> {
  id: string;
  actorId: string;
  aggregateId: string;
  abstract aggregate: string;
  eventName: string;
  eventPayload: Payload;
  storedAt: Date;
  version: number;

  constructor(aggregateId: string, eventPayload: Payload) {
    this.id = TSID.create().number.toString();
    this.actorId = RequestContext.currentContext.req.user.id;
    this.aggregateId = aggregateId;
    this.eventName = this.constructor.name;
    this.eventPayload = eventPayload;
    this.storedAt = new Date();
  }
}
