const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async createTicket(data) {
    const { accessToken, emailThreadId } = data;
    if (accessToken && emailThreadId) {
      const nylas = nylasService.connectNylas(accessToken);
      const emailThread = await nylasService.getEmailThread(nylas, emailThreadId);
      data.emailThreadId = emailThread.id;
    }
    return prisma.ticket.create({ data });
  },

  async createTicket(data) {
    return prisma.ticket.create({ data });
  },

  // maybe make a method for active tickets

  async getAllTickets(status, emailThreadId) {
    const where = { };
    if (status) where.status = status;
    if (emailThreadId) where.emailThreadId = emailThreadId;
    return prisma.ticket.findMany({ where });
  },

  async getTicketById(id) {
    return prisma.ticket.findUnique({ where: { id: parseInt(id) } });
  },

  async updateTicket(id, data) {
    return prisma.ticket.update({ 
      where: { id: parseInt(id) }, 
      data: {
        deletedAt: data.delete ? new Date() : null,
        status: data.status || undefined
      }
    });
  },  

  async deleteTicket(id) {
    return prisma.ticket.delete({ where: { id: parseInt(id) } });
  }
};
