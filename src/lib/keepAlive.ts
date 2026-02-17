import { supabase } from '@/lib/supabase';

/**
 * Keep-alive function to prevent Supabase connection from timing out
 * Fetches a single row from the categories table every 24 hours
 * Note: This only works while the website is open in a browser
 */
export const initializeKeepAlive = () => {
  const keepAliveInterval = setInterval(async () => {
    try {
      // Fetch a single category to keep connection alive
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows found" which is okay for keep-alive
        console.warn('Keep-alive query failed:', error);
      } else {
        console.debug('Keep-alive ping successful', new Date().toISOString());
      }
    } catch (err) {
      console.error('Keep-alive error:', err);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours

  // Return cleanup function to stop the interval if needed
  return () => clearInterval(keepAliveInterval);
};

/**
 * Alternative keep-alive with shorter interval (6 hours)
 * Use this if you want more frequent checks while website is open
 */
export const initializeKeepAliveFrequent = () => {
  const keepAliveInterval = setInterval(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id')
        .limit(1)
        .single();

      if (!error) {
        console.debug('Keep-alive ping successful at', new Date().toISOString());
      }
    } catch (err) {
      // Silently fail - we're just keeping the connection warm
    }
  }, 6 * 60 * 60 * 1000); // 6 hours

  return () => clearInterval(keepAliveInterval);
};
