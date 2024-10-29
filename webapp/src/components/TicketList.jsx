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
  Box,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

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

  const handleDelete = async (ticketId, e) => {
    e.stopPropagation();
    await axios.patch(`http://localhost:3000/tickets/${ticketId}`, { delete: true });
    setTickets(tickets.filter(t => t.id !== ticketId));
  };

  useEffect(() => {
    axios.get('http://localhost:3000/tickets')
      .then(response => {
        setTickets(response.data.filter(ticket => !ticket.deletedAt));
        response.data.forEach(ticket => {
          axios.get(`http://localhost:3000/tickets/${ticket.id}/emails`)
            .then(threadResponse => {
              setThreadDetails(prev => ({
                ...prev,
                [ticket.id]: threadResponse.data
              }));
            });
        });
      });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>SpeedClerk Support Tickets</Typography>
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
            {tickets.sort((a, b) => a.id - b.id).map((ticket) => (
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
                {threadDetails[ticket.id]?.messages[0]?.subject.replace('[SpeedClerk SUPPORT]', '').trim()}
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{ticket.emailThreadId}</TableCell>
                <TableCell>
                  {ticket.status === 'resolved' && (
                    <IconButton onClick={(e) => handleDelete(ticket.id, e)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TicketList
