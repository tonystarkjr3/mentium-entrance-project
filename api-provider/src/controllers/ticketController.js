const express = require('express');
const ticketService = require('../services/ticketService');
// const nylasService = require('../services/nylasService')

const axios = require('axios');
const router = express.Router();

const baseHeaders = {
  'Accept': 'application/json',
  'Authorization': `Bearer ${process.env.NYLAS_SECRET}`,
  'Content-Type': 'application/json'
}

// ticket retrieval and modification
router.post('/', async (req, res) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, emailThreadId } = req.query;
    const tickets = await ticketService.getAllTickets(status, emailThreadId);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    res.status(200).json(ticket);
  } catch (error) {
    res.status(404).json({ message: 'Ticket not found', error });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await ticketService.deleteTicket(req.params.id);
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ticket', error });
  }
});

router.get('/emails/speedclerk-support', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.us.nylas.com/v3/grants/${process.env.NYLAS_GRANTID}/messages`, {
        params: {
          limit: process.env.QUERY_LIMIT,
          subject: '[SpeedClerk SUPPORT]'
        },
        headers: baseHeaders,
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching emails', 
      details: error.response?.data || error.message 
    });
  }
});

// query the ticketService for a ticket by ID, extract its thread ID, and then
// send a request via axios to nylas api for the thread at that ID
router.get('/:id/emails', async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    const response = await axios.get(
      `https://api.us.nylas.com/v3/grants/${process.env.NYLAS_GRANTID}/threads/${ticket.emailThreadId}`, {
        headers: baseHeaders,
      });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching emails', error });
  }
});

// reply on the thread
router.post('/:id/reply', async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    const response = await axios.post(
      `https://api.us.nylas.com/v3/grants/${process.env.NYLAS_GRANTID}/messages`, {
        subject: req.body.subject,
        body: req.body.body,
        thread_id: ticket.emailThreadId,
        to: req.body.to
      }, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.NYLAS_SECRET}`,
          'Content-Type': 'application/json'
        }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error sending reply', error });
  }
});


module.exports = router;
