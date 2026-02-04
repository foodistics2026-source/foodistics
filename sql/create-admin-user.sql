-- ============================================
-- Admin User Creation SQL Script
-- ============================================
-- 
-- Simple SQL to insert admin user with auto-generated UUID
-- Run this in your Supabase SQL Editor
--
-- IMPORTANT: You must create the auth user FIRST!
--
-- STEPS:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "+ Add user"
-- 3. Enter email: admin@foodistics.com
-- 4. Enter password: Admin@123456 (or your preferred password)
-- 5. Click "Create user"
-- 6. COPY THE USER ID
-- 7. Go to SQL Editor
-- 8. Replace 'YOUR_USER_ID_HERE' below with the copied ID
-- 9. Click "Run"
--
-- ============================================

-- Insert admin user profile (use the ID from Supabase Auth)
INSERT INTO public.users (
  id,
  email,
  full_name,
  phone,
  is_admin,
  created_at,
  updated_at
) VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual user ID from Supabase Auth
  'admin@foodistics.com',
  'Admin User',
  '+1234567890',
  true,
  NOW(),
  NOW()
)
RETURNING id, email, full_name, is_admin;

-- Verify the admin user was created
SELECT id, email, full_name, is_admin FROM public.users 
WHERE email = 'admin@foodistics.com';
