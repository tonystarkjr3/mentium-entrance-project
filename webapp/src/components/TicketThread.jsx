import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  IconButton,
  Button,
  Card,
  CardContent,
  Stack,
  TextField
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'

function TicketThread() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [thread, setThread] = useState(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:3000/tickets/${id}`)
      .then(response => setTicket(response.data))

    axios.get(`http://localhost:3000/tickets/${id}/emails`)
      .then(response => {
        console.log('Thread data:', response.data)
        setThread(response.data)
      })
  }, [id])

  const handleStatusToggle = async () => {
    const newStatus = ticket.status === 'resolved' ? 'open' : 'resolved'
    try {
      await axios.patch(`http://localhost:3000/tickets/${id}`, {
        status: newStatus
      })
      const response = await axios.get(`http://localhost:3000/tickets/${id}`)
      setTicket(response.data)
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  const handleReply = async () => {
    try {
      // Get the first message's sender and latest message ID
      const originalSender = thread.messages[0].from[0].email;
      const latestMessageId = thread.messages[thread.messages.length - 1].id;
      
      await axios.post(`http://localhost:3000/tickets/${id}/reply`, {
        body: replyText,
        subject: thread.thread.data.subject,
        to: originalSender,
        replyToMessageId: latestMessageId
      });
      setReplyText('');
      // Refresh thread data
      const response = await axios.get(`http://localhost:3000/tickets/${id}/emails`);
      setThread(response.data);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };  

  return (
    <Box sx={{ p: 3 }}>
      <IconButton onClick={() => navigate('/')} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      {ticket && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h5">Ticket #{ticket.id}</Typography>
              <Chip 
                label={ticket.status}
                color={ticket.status === 'open' ? 'primary' : 'default'}
              />
            </Stack>
            <Button 
              variant="contained" 
              color={ticket.status === 'resolved' ? 'primary' : 'success'}
              onClick={handleStatusToggle}
            >
              {ticket.status === 'resolved' ? 'Reopen Ticket' : 'Mark as Resolved'}
            </Button>
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Created: {new Date(ticket.createdAt).toLocaleString()}
          </Typography>
        </Paper>
      )}

      {thread && thread.messages && (
        <Stack spacing={2}>
          {thread.messages.map((message) => (
            <Card key={message.id}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  From: {message.from[0].email}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {message.subject}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  {message.snippet}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  {new Date(message.date * 1000).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Paper sx={{ p: 3, mt: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your reply..."
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleReply}
          disabled={!replyText.trim()}
        >
          Send Reply
        </Button>
      </Paper>
    </Box>
  )
}

export default TicketThread
