import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database operations
export const chatHistoryService = {
  // Create or get user
  async getOrCreateUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // User doesn't exist, create one
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ id: userId, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (createError) throw createError;
      return newUser;
    }

    if (error) throw error;
    return data;
  },

  // Create new conversation
  async createConversation(userId, title = 'New Chat') {
    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        user_id: userId,
        title: title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user conversations
  async getUserConversations(userId) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Save message
  async saveMessage(conversationId, modelId, role, content, timestamp) {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        conversation_id: conversationId,
        model_id: modelId,
        role: role,
        content: content,
        timestamp: timestamp,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get conversation messages
  async getConversationMessages(conversationId) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Update conversation timestamp and title
  async updateConversation(conversationId, title = null) {
    const updateData = { updated_at: new Date().toISOString() };
    if (title) updateData.title = title;

    const { data, error } = await supabase
      .from('conversations')
      .update(updateData)
      .eq('id', conversationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete conversation
  async deleteConversation(conversationId) {
    // First delete all messages
    await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId);

    // Then delete conversation
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) throw error;
  }
};
