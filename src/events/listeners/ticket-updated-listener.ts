import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import {
  Subjects,
  TicketUpdatedEvent,
  Listener,
  NotFoundError,
} from '@agreejwc/common';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = 'orders-service';

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
