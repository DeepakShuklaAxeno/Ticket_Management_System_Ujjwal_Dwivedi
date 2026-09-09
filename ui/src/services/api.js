import * as ticketService from './ticketService';

export const api = {
  getProfile: ticketService.getProfile,
  createTicket: ticketService.createTicket,
  getAssignableUsers: ticketService.getAssignableUsers,
  assignTicket: ticketService.assignTicket,
  startTicket: ticketService.startTicket,
  completeTicket: ticketService.completeTicket,
  resolveTicket: ticketService.resolveTicket,
  reopenTicket: ticketService.reopenTicket,
  requestReassignment: ticketService.requestReassignment,
  getTickets: ticketService.getTickets,
  getTicketById: ticketService.getTicketById,
  getUsers: ticketService.getUsers,
  updateTicket: ticketService.updateTicket,
  deleteTicket: ticketService.deleteTicket,
  changePriority: ticketService.changePriority,
  setAuth: () => {}
};

export default api;
