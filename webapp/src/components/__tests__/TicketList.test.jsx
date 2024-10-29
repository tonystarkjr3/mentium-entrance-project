import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import TicketList from '../TicketList'

vi.mock('axios')

const mockTickets = [
  {
    id: 1,
    status: 'open',
    createdAt: '2024-02-27T10:00:00Z',
    emailThreadId: 'thread-1'
  }
];

describe('TicketList', () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockTickets });
  });

  it('renders ticket list with data', async () => {
    render(
      <BrowserRouter>
        <TicketList />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Support Tickets')).toBeInTheDocument();
    expect(await screen.findByText('thread-1')).toBeInTheDocument();
  });

  it('filters out deleted tickets', async () => {
    const ticketsWithDeleted = [...mockTickets, { id: 2, deletedAt: new Date() }];
    axios.get.mockResolvedValueOnce({ data: ticketsWithDeleted });

    render(
      <BrowserRouter>
        <TicketList />
      </BrowserRouter>
    );

    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBe(2); // Header + 1 non-deleted ticket
  });
});