import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';

import Navbar from './components/layout/Navbar';
import DashboardPage from './pages/DashboardPage';
import UserManagement from './components/users/UserManagement';
import TicketDetailView from './components/tickets/TicketDetailView';
import AuthPage from './components/auth/AuthPage';

import CreateTicketModal from './components/modals/CreateTicketModal';
import EditTicketModal from './components/modals/EditTicketModal';
import AssignTicketModal from './components/modals/AssignTicketModal';
import CompleteTicketModal from './components/modals/CompleteTicketModal';
import ResolveTicketModal from './components/modals/ResolveTicketModal';
import ReopenTicketModal from './components/modals/ReopenTicketModal';
import ConfirmDeleteModal from './components/modals/ConfirmDeleteModal';
import ChangePriorityModal from './components/modals/ChangePriorityModal';
import RequestReassignModal from './components/modals/RequestReassignModal';
import AccessRulesModal from './components/modals/AccessRulesModal';

function MainApp() {
  const { user, isAdmin, token, loading: authLoading } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [assignTicket, setAssignTicket] = useState(null);
  const [requestReassignTicket, setRequestReassignTicket] = useState(null);
  const [completeTicket, setCompleteTicket] = useState(null);
  const [resolveTicket, setResolveTicket] = useState(null);
  const [reopenTicket, setReopenTicket] = useState(null);
  const [deleteTicket, setDeleteTicket] = useState(null);
  const [priorityTicket, setPriorityTicket] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getTickets();
      setTickets(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!token || !user) {
      setTickets([]);
      setUsers([]);
      setLoading(false);
      return;
    }
    fetchTickets();
    fetchUsers();
  }, [user, token, authLoading, fetchTickets, fetchUsers]);

  const handleTicketUpsert = (updatedTicket) => {
    if (!updatedTicket || !updatedTicket.id) return;
    setTickets(prev => {
      const exists = prev.some(t => t.id === updatedTicket.id);
      if (exists) {
        return prev.map(t => (t.id === updatedTicket.id ? { ...t, ...updatedTicket } : t));
      }
      return [{ ...updatedTicket }, ...prev];
    });
  };

  const handleTicketDeleted = (deletedId) => {
    setTickets(prev => prev.filter(t => t.id !== deletedId));
    if (selectedTicketId === deletedId) {
      setSelectedTicketId(null);
    }
  };

  const handleStartTicket = async (ticket) => {
    try {
      const updated = await api.startTicket(ticket.id);
      toast.success('Work started on ticket');
      handleTicketUpsert(updated);
    } catch (err) {
      toast.error(err.message || 'Failed to start ticket');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateOpen(true)}
        onOpenRulesModal={() => setIsRulesOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'tickets' ? (
          <DashboardPage
            tickets={tickets}
            users={users}
            currentUserId={user?.id}
            isAdmin={isAdmin}
            loading={loading}
            onOpenCreate={() => setIsCreateOpen(true)}
            onSelectTicket={(t) => setSelectedTicketId(t.id)}
            onOpenAssign={(t) => setAssignTicket(t)}
            onOpenEdit={(t) => setEditTicket(t)}
            onOpenComplete={(t) => setCompleteTicket(t)}
            onOpenResolve={(t) => setResolveTicket(t)}
            onOpenReopen={(t) => setReopenTicket(t)}
            onOpenDelete={(t) => setDeleteTicket(t)}
            onOpenChangePriority={(t) => setPriorityTicket(t)}
            onStartTicket={handleStartTicket}
          />
        ) : (
          <UserManagement
            tickets={tickets}
            onSelectTicket={(t) => {
              setActiveTab('tickets');
              setSelectedTicketId(t.id);
            }}
          />
        )}
      </main>

      {selectedTicketId && (
        <TicketDetailView
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          currentUserId={user?.id}
          isAdmin={isAdmin}
          users={users}
          onTicketUpdated={handleTicketUpsert}
          onOpenAssign={(t) => setAssignTicket(t)}
          onOpenEdit={(t) => setEditTicket(t)}
          onOpenComplete={(t) => setCompleteTicket(t)}
          onOpenResolve={(t) => setResolveTicket(t)}
          onOpenReopen={(t) => setReopenTicket(t)}
          onOpenDelete={(t) => setDeleteTicket(t)}
          onOpenChangePriority={(t) => setPriorityTicket(t)}
          onOpenRequestReassign={(t) => setRequestReassignTicket(t)}
        />
      )}

      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(newTicket) => handleTicketUpsert(newTicket)}
      />

      <EditTicketModal
        isOpen={Boolean(editTicket)}
        ticket={editTicket}
        onClose={() => setEditTicket(null)}
        onUpdated={(updated) => handleTicketUpsert(updated)}
      />

      <AssignTicketModal
        isOpen={Boolean(assignTicket)}
        ticket={assignTicket}
        currentUserId={user?.id}
        onClose={() => setAssignTicket(null)}
        onAssigned={(updated) => handleTicketUpsert(updated)}
      />

      <RequestReassignModal
        isOpen={Boolean(requestReassignTicket)}
        ticket={requestReassignTicket}
        onClose={() => setRequestReassignTicket(null)}
        onRequested={(updated) => handleTicketUpsert(updated)}
      />

      <CompleteTicketModal
        isOpen={Boolean(completeTicket)}
        ticket={completeTicket}
        onClose={() => setCompleteTicket(null)}
        onCompleted={(updated) => handleTicketUpsert(updated)}
      />

      <ResolveTicketModal
        isOpen={Boolean(resolveTicket)}
        ticket={resolveTicket}
        onClose={() => setResolveTicket(null)}
        onResolved={(updated) => handleTicketUpsert(updated)}
      />

      <ReopenTicketModal
        isOpen={Boolean(reopenTicket)}
        ticket={reopenTicket}
        onClose={() => setReopenTicket(null)}
        onReopened={(updated) => handleTicketUpsert(updated)}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTicket)}
        ticket={deleteTicket}
        onClose={() => setDeleteTicket(null)}
        onDeleted={handleTicketDeleted}
      />

      <ChangePriorityModal
        isOpen={Boolean(priorityTicket)}
        ticket={priorityTicket}
        onClose={() => setPriorityTicket(null)}
        onPriorityChanged={(updated) => handleTicketUpsert(updated)}
      />

      <AccessRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
