import { supabase } from '@/lib/supabase';

/**
 * Admin Setup Script
 * 
 * This script creates an admin user account in Supabase.
 * Run this once after setting up your Supabase project.
 * 
 * Usage:
 * 1. Update the credentials below
 * 2. Run: npx ts-node src/scripts/createAdmin.ts
 * 3. Check Supabase for the new admin user
 */

const ADMIN_CREDENTIALS = {
  email: 'admin@foodistics.com',
  password: 'Admin@123456', // Change this to a secure password
  fullName: 'Admin User',
};

async function createAdminUser() {
  try {
    console.log('🔐 Starting admin user creation...');

    // Step 1: Sign up the admin user
    console.log('📝 Creating admin account...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password,
      options: {
        data: {
          full_name: ADMIN_CREDENTIALS.fullName,
        },
      },
    });

    if (signUpError) {
      throw new Error(`Sign up error: ${signUpError.message}`);
    }

    if (!signUpData.user) {
      throw new Error('No user returned from sign up');
    }

    console.log('✅ User account created:', signUpData.user.id);

    // Step 2: Create user profile with admin privileges
    console.log('🔑 Setting admin privileges...');
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: signUpData.user.id,
          email: ADMIN_CREDENTIALS.email,
          full_name: ADMIN_CREDENTIALS.fullName,
          is_admin: true,
        },
      ]);

    if (profileError) {
      throw new Error(`Profile creation error: ${profileError.message}`);
    }

    console.log('✅ Admin profile created successfully');

    // Step 3: Verify the admin user
    console.log('🔍 Verifying admin user...');
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signUpData.user.id)
      .single();

    if (fetchError) {
      throw new Error(`Verification error: ${fetchError.message}`);
    }

    console.log('✅ Admin user verified:', userData);
    console.log('\n🎉 Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`   Email: ${ADMIN_CREDENTIALS.email}`);
    console.log(`   Password: ${ADMIN_CREDENTIALS.password}`);
    console.log('\n🔗 Admin Login URL: /auth/admin-signin');
    console.log('\n⚠️  IMPORTANT: Change the password immediately after first login!');

    return userData;
  } catch (error) {
    console.error('❌ Error creating admin user:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the script
createAdminUser().then(() => {
  console.log('\n✨ Setup complete!');
  process.exit(0);
});
