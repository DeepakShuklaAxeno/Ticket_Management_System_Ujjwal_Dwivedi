import { supabase } from './supabase';

export const getProfile = async (userId) => {
  if (!supabase) return null;
  let query = supabase.from('profiles').select('*');
  if (userId) {
    query = query.eq('id', userId);
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    query = query.eq('id', user.id);
  }
  const { data, error } = await query.single();
  if (error && error.code !== 'PGRST116') {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          role: user.user_metadata?.role || 'user'
        })
        .select()
        .single();
      return newProfile;
    }
  }
  return data;
};

export const createTicket = async ({ subject, description, priority = 'medium' }) => {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.rpc('create_ticket', {
    p_subject: subject.trim(),
    p_description: description.trim(),
    p_priority: priority
  });

  if (!error && data) {
    return typeof data === 'object' ? data : await getTicketById(data);
  }

  if (error) {
    if (error.code === '42883' || error.message?.includes('does not exist')) {
      const alt = await supabase.rpc('create_ticket', {
        subject: subject.trim(),
        description: description.trim(),
        priority
      });
      if (!alt.error && alt.data) return typeof alt.data === 'object' ? alt.data : await getTicketById(alt.data);
    }
    throw new Error(error.message || 'Failed to create ticket');
  }

  return data;
};

export const getAssignableUsers = async (ticketId) => {
  if (!supabase) return [];

  try {
    if (ticketId) {
      const { data, error } = await supabase.rpc('get_assignable_users', { p_ticket_id: ticketId });
      if (!error && Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('get_assignable_users fallback:', err);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, category, role')
    .eq('role', 'user')
    .order('full_name');

  if (error) throw error;
  return data || [];
};

export const assignTicket = async (ticketId, payload) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const assigneeId = typeof payload === 'object' ? payload.assigneeId : payload;

  const { data, error } = await supabase.rpc('assign_ticket', {
    p_ticket_id: ticketId,
    p_assignee_id: assigneeId
  });

  if (!error) {
    return typeof data === 'object' && data ? data : await getTicketById(ticketId);
  }

  if (error.code === '42883' || error.message?.includes('does not exist')) {
    const alt = await supabase.rpc('assign_ticket', {
      ticket_id: ticketId,
      assignee_id: assigneeId
    });
    if (!alt.error) return typeof alt.data === 'object' && alt.data ? alt.data : await getTicketById(ticketId);
  }

  throw new Error(error.message || 'Failed to assign ticket');
};

export const startTicket = async (ticketId) => {
  if (!supabase) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase.rpc('start_ticket', {
    p_ticket_id: ticketId
  });

  if (!error) {
    return typeof data === 'object' && data ? data : await getTicketById(ticketId);
  }

  if (error.code === '42883' || error.message?.includes('does not exist')) {
    const alt = await supabase.rpc('start_ticket', {
      ticket_id: ticketId
    });
    if (!alt.error) return typeof alt.data === 'object' && alt.data ? alt.data : await getTicketById(ticketId);
  }

  throw new Error(error.message || 'Failed to start ticket');
};

export const completeTicket = async (ticketId, payload = {}) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const msg = typeof payload === 'object' ? payload.message : payload;
  const message = (msg && typeof msg === 'string') ? msg.trim() : '';

  try {
    const { data: currentTicket } = await supabase.from('tickets').select('status').eq('id', ticketId).single();
    if (currentTicket && currentTicket.status === 'assigned') {
      await supabase.rpc('start_ticket', { p_ticket_id: ticketId });
    }
  } catch (e) {
    console.warn('Auto-start check error:', e);
  }

  const { data, error } = await supabase.rpc('complete_ticket', {
    p_ticket_id: ticketId,
    p_message: message || ''
  });

  if (!error) {
    return typeof data === 'object' && data ? data : await getTicketById(ticketId);
  }

  if (error.code === '42883' || error.message?.includes('does not exist')) {
    const alt = await supabase.rpc('complete_ticket', {
      ticket_id: ticketId,
      message: message || ''
    });
    if (!alt.error) return typeof alt.data === 'object' && alt.data ? alt.data : await getTicketById(ticketId);
  }

  throw new Error(error.message || 'Failed to complete ticket');
};

export const resolveTicket = async (ticketId, payload = {}) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const msg = typeof payload === 'object' ? payload.message : payload;
  const message = (msg && typeof msg === 'string') ? msg.trim() : '';

  const { data, error } = await supabase.rpc('resolve_ticket', {
    p_ticket_id: ticketId,
    p_message: message || ''
  });

  if (!error) {
    return typeof data === 'object' && data ? data : await getTicketById(ticketId);
  }

  if (error.code === '42883' || error.message?.includes('does not exist')) {
    const alt = await supabase.rpc('resolve_ticket', {
      ticket_id: ticketId,
      message: message || ''
    });
    if (!alt.error) return typeof alt.data === 'object' && alt.data ? alt.data : await getTicketById(ticketId);
  }

  throw new Error(error.message || 'Failed to resolve ticket');
};

export const reopenTicket = async (ticketId, payload = {}) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const msg = typeof payload === 'object' ? payload.message : payload;
  const message = (msg && typeof msg === 'string') ? msg.trim() : '';

  if (!message) {
    throw new Error('A reason is required when reopening a ticket');
  }

  const { data, error } = await supabase.rpc('reopen_ticket', {
    p_ticket_id: ticketId,
    p_message: message
  });

  if (!error) {
    return typeof data === 'object' && data ? data : await getTicketById(ticketId);
  }

  if (error.code === '42883' || error.message?.includes('does not exist')) {
    const alt = await supabase.rpc('reopen_ticket', {
      ticket_id: ticketId,
      message
    });
    if (!alt.error) return typeof alt.data === 'object' && alt.data ? alt.data : await getTicketById(ticketId);
  }

  throw new Error(error.message || 'Failed to reopen ticket');
};

export const requestReassignment = async (ticketId, payload = {}) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const msg = typeof payload === 'object' ? payload.message : payload;
  const message = (msg && typeof msg === 'string') ? msg.trim() : 'Reassignment requested by user';
  const { data: { user } } = await supabase.auth.getUser();

  try {
    await supabase.from('ticket_logs').insert({
      ticket_id: ticketId,
      performed_by: user?.id,
      action: 'reassign_requested',
      message
    });
  } catch (e) {
    console.warn('Log insert notice:', e);
  }

  return await getTicketById(ticketId);
};

export const getTickets = async () => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getTicketById = async (ticketId) => {
  if (!supabase) return null;

  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', ticketId)
    .single();

  if (ticketError) throw ticketError;

  const { data: logs } = await supabase
    .from('ticket_logs')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  return {
    ...ticket,
    ticket_logs: logs || []
  };
};

export const getUsers = async (searchQuery = '', options = {}) => {
  if (!supabase) return [];

  let query = supabase.from('profiles').select('*').order('full_name');
  if (options.exclude_admin) query = query.neq('role', 'admin');
  if (options.role) query = query.eq('role', options.role);

  const { data, error } = await query;
  if (error) throw error;
  const list = data || [];

  const trimmed = searchQuery.trim().toLowerCase();
  if (!trimmed) return list;
  return list.filter(u =>
    (u.full_name || '').toLowerCase().includes(trimmed) ||
    (u.email || '').toLowerCase().includes(trimmed) ||
    (u.category || '').toLowerCase().includes(trimmed) ||
    (u.role || '').toLowerCase().includes(trimmed)
  );
};

export const updateTicket = async (ticketId, updates) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const cleanUpdates = {};
  if (updates.subject !== undefined) cleanUpdates.subject = updates.subject.trim();
  if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
  if (updates.priority !== undefined) cleanUpdates.priority = updates.priority;

  const { data, error } = await supabase
    .from('tickets')
    .update(cleanUpdates)
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTicket = async (ticketId) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase
    .from('tickets')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const changePriority = async (ticketId, payload) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const priority = typeof payload === 'object' ? payload.priority : payload;
  const { data, error } = await supabase
    .from('tickets')
    .update({ priority })
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
