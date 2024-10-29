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
  
  const mockThreadDetails = {
    1: {
      messages: [
        {
          subject: '[SpeedClerk SUPPORT] Test Subject',
          from: [{ email: 'test@example.com' }]
        }
      ]
    }, 
    2: {
      messages: [
        {
          subject: '[SpeedClerk SUPPORT] Test Subject 2',
          from: [{ email: 'test2@example.com' }]
        }
      ]
    }
  };

describe('TicketList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders ticket list with data', async () => {

    axios.get.mockImplementation((url) => {
      if (url.includes('/emails')) {
        return Promise.resolve({ data: mockThreadDetails[1] });
      } else {
        return Promise.resolve({ data: mockTickets });
      }
    });

    render(
      <BrowserRouter>
        <TicketList />
      </BrowserRouter>
    );
    
    expect(screen.getByText('SpeedClerk Support Tickets')).toBeInTheDocument();
    expect(await screen.findByText('thread-1')).toBeInTheDocument();
  });

  it('filters out deleted tickets', async () => {
    const ticketsWithDeleted = [...mockTickets, { id: 2, deletedAt: new Date() }];

    axios.get.mockImplementation((url) => {
      if (url.includes('/emails')) {
        return Promise.resolve({ data: mockThreadDetails[2] });
      } else {
        return Promise.resolve({ data: ticketsWithDeleted });
      }
    });

    render(
      <BrowserRouter>
        <TicketList />
      </BrowserRouter>
    );

    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBe(1); 
  });
});