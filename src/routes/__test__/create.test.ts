import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

//jest.setTimeout(10000);

it('return an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('return an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({ title: 'concert', price: 100 });
  await ticket.save();

  const order = Order.build({
    userId: 'dsafkjsklfe',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  let orders = await Order.find({});
  expect(orders.length).toEqual(0);

  const ticket = Ticket.build({ title: 'concert', price: 100 });
  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(response.body.ticket.id).toEqual(ticket.id);
});

it.todo('emit an order created event');
