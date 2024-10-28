const { Nylas } = require('nylas');

module.exports = {
  connectNylas: (accessToken, grantId) => {
    return Nylas.with(accessToken, { grantId });
  },
  
  getEmailsByThreadId: async (nylas, threadId) => {
    try {
      const thread = await nylas.threads.find(threadId);
      const messages = await thread.messages.list();
      return messages;
    } catch (error) {
      throw new Error(`Failed to fetch emails for thread ID ${threadId}: ${error.message}`);
    }
  },

  getEmailsBySubject: async (nylas, subject) => {
    try {
      const messages = await nylas.messages.list({ 
        q: subject,
        limit: 5,
        unread: true
      });
      return messages;
    } catch (error) {
      throw new Error(`Failed to fetch emails with subject containing "${subject}": ${error.message}`);
    }
  }
};
