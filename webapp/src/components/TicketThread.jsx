// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import {
//   Box,
//   Paper,
//   Typography,
//   Chip,
//   Divider,
//   IconButton,
//   Card,
//   CardContent,
//   Stack
// } from '@mui/material'
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// function TicketThread() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [ticket, setTicket] = useState(null)
//   const [thread, setThread] = useState([])

//   useEffect(() => {
//     axios.get(`http://localhost:3000/tickets/${id}`)
//       .then(response => setTicket(response.data))

//     axios.get(`http://localhost:3000/tickets/${id}/thread`)
//       .then(response => setThread(response.data))
//   }, [id])

//   return (
//     <Box sx={{ p: 3 }}>
//       <IconButton 
//         onClick={() => navigate('/')} 
//         sx={{ mb: 2 }}
//       >
//         <ArrowBackIcon />
//       </IconButton>

//       {ticket && (
//         <Paper sx={{ p: 3, mb: 3 }}>
//           <Stack direction="row" alignItems="center" spacing={2}>
//             <Typography variant="h5">Ticket #{ticket.id}</Typography>
//             <Chip 
//               label={ticket.status}
//               color={ticket.status === 'open' ? 'primary' : 'default'}
//             />
//           </Stack>
//           <Typography color="text.secondary" sx={{ mt: 1 }}>
//             Created: {new Date(ticket.createdAt).toLocaleString()}
//           </Typography>
//         </Paper>
//       )}

//       <Stack spacing={2}>
//         {thread.map(message => (
//           <Card key={message.id}>
//             <CardContent>
//               <Typography variant="subtitle2" color="text.secondary">
//                 From: {message.from}
//               </Typography>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>
//                 {message.subject}
//               </Typography>
//               <Divider sx={{ my: 2 }} />
//               <Typography variant="body1">
//                 {message.body}
//               </Typography>
//               <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
//                 {new Date(message.timestamp).toLocaleString()}
//               </Typography>
//             </CardContent>
//           </Card>
//         ))}
//       </Stack>
//     </Box>
//   )
// }

// export default TicketThread

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
  Stack
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function TicketThread() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [thread, setThread] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:3000/tickets/${id}`)
      .then(response => setTicket(response.data))

    axios.get(`http://localhost:3000/tickets/${id}/emails`)
      .then(response => setThread(response.data))
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

  return (
    <Box sx={{ p: 3 }}>
      <IconButton 
        onClick={() => navigate('/')} 
        sx={{ mb: 2 }}
      >
        <ArrowBackIcon />
      </IconButton>

      {ticket && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between" // This pushes the button to the right
          >
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

      {thread && thread.data && (
        <Card>
          <CardContent>
            <Typography variant="h6">
              {thread.data.latest_draft_or_message.subject}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
              {thread.data.latest_draft_or_message.snippet}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default TicketThread

