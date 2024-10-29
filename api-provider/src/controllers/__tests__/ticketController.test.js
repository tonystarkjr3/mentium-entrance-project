const request = require('supertest');
const express = require('express');
const ticketService = require('../../services/ticketService');

const app = express();
app.use(express.json());
app.use('/tickets', require('../ticketController'));

jest.mock('../../services/ticketService');

describe('Ticket Controller', () => {
  it('GET /tickets returns all tickets', async () => {
    const mockTickets = [{ id: 1, status: 'open' }];
    ticketService.getAllTickets.mockResolvedValue(mockTickets);

    const response = await request(app).get('/tickets');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTickets);
  });

  it('PATCH /tickets/:id updates ticket status', async () => {
    const mockTicket = { id: 1, status: 'resolved' };
    ticketService.updateTicket.mockResolvedValue(mockTicket);

    const response = await request(app)
      .patch('/tickets/1')
      .send({ status: 'resolved' });
      
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTicket);
  });
});
