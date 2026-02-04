import { supabase } from '@/lib/supabase';

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  is_admin: boolean;
}

// Authentication functions
export const authService = {
  // Sign up with email and password
  async signup(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error('Auth signup error:', error);
      throw new Error(error.message);
    }

    // Create user profile
    if (data.user) {
      try {
        await this.createUserProfile(data.user.id, email, fullName);
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail signup if profile creation fails
      }
      
      // Create cart for new user
      try {
        await supabase
          .from('carts')
          .insert([{ user_id: data.user.id }]);
      } catch (cartError) {
        console.error('Cart creation error:', cartError);
        // Don't fail signup if cart creation fails
      }
    }

    return data;
  },

  // Sign in with email and password
  async signin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Create user profile in users table
  async createUserProfile(userId: string, email: string, fullName: string) {
    const { error } = await supabase.from('users').insert([
      {
        id: userId,
        email,
        full_name: fullName,
        is_admin: false,
      },
    ]);

    if (error) throw error;
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('Profile not found, creating default:', userId, error);
      // Create default profile if it doesn't exist
      try {
        const user = await this.getCurrentUser();
        if (user) {
          await this.createUserProfile(
            userId,
            user.email || '',
            user.user_metadata?.full_name || 'User'
          );
          return {
            id: userId,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || 'User',
            is_admin: false,
          };
        }
      } catch (createError) {
        console.error('Failed to create default profile:', createError);
      }
      throw error;
    }
    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        callback(session.user as AuthUser);
      } else {
        callback(null);
      }
    });

    return data?.subscription;
  },
};
