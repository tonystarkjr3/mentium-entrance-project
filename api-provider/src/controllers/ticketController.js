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
// all messages within the thread have to be separately fetched (hence the Promise array)
router.get('/:id/emails', async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    // First get the thread to get message IDs
    const threadResponse = await axios.get(
      `https://api.us.nylas.com/v3/grants/${process.env.NYLAS_GRANTID}/threads/${ticket.emailThreadId}`,
      { headers: baseHeaders }
    );
    
    // Then fetch all messages in parallel
    const messagePromises = threadResponse.data.data.message_ids.map(msgId => 
      axios.get(
        `https://api.us.nylas.com/v3/grants/${process.env.NYLAS_GRANTID}/messages/${msgId}`,
        { headers: baseHeaders }
      )
    );
    
    const messageResponses = await Promise.all(messagePromises);
    const messages = messageResponses.map(r => r.data.data);
    
    // Return both thread and message data
    res.status(200).json({
      thread: threadResponse.data,
      messages: messages
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching emails', error });
  }
});

router.post('/:id/reply', async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    
    // Step 1: Create draft with threading parameters
    const draftResponse = await axios.post(
      `https://api.us.nylas.com/v3/grants/${process.env.NYLAS_GRANTID}/drafts`,
      {
        subject: req.body.subject,
        to: [{ email: req.body.to }],
        body: req.body.body,
        thread_id: ticket.emailThreadId,
        reply_to_message_id: req.body.replyToMessageId, // Add this from UI
        tracking_options: {
          opens: true,
          links: true,
          thread_replies: true
        }
      },
      { headers: baseHeaders }
    );

    // Step 2: Send draft
    const sendResponse = await axios.post(
      `https://api.us.nylas.com/v3/grants/${process.env.NYLAS_GRANTID}/drafts/${draftResponse.data.data.id}`,
      {},
      { headers: baseHeaders }
    );

    res.status(200).json(sendResponse.data);
  } catch (error) {
    console.log('Nylas API Error:', error.response?.data);
    res.status(500).json({ message: 'Error sending reply', error });
  }
});


module.exports = router;
