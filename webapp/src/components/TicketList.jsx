import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box
} from '@mui/material'

const getStatusColor = (status) => {
  const colors = {
    open: 'primary',
    closed: 'default',
    pending: 'warning',
    resolved: 'success'
  }
  return colors[status] || 'default'
}

function TicketList() {
  const [tickets, setTickets] = useState([])
  const [threadDetails, setThreadDetails] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:3000/tickets')
      .then(response => {
        setTickets(response.data)
        // Fetch thread details for each ticket
        response.data.forEach(ticket => {
          axios.get(`http://localhost:3000/tickets/${ticket.id}/emails`)
            .then(threadResponse => {
              setThreadDetails(prev => ({
                ...prev,
                [ticket.id]: threadResponse.data
              }))
            })
        })
      })
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Support Tickets</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Thread ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                hover
                onClick={() => navigate(`/ticket/${ticket.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{ticket.id}</TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.status}
                    color={getStatusColor(ticket.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                {threadDetails[ticket.id]?.data?.latest_draft_or_message?.subject.replace('[SpeedClerk SUPPORT]', '').trim()}
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{ticket.emailThreadId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TicketList
