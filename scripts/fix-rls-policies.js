/**
 * Script to fix RLS policies for profiles table
 * Run this with: node scripts/fix-rls-policies.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials!');
  console.error('Make sure you have these in .env.local:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('ℹ️  Note: Using anon key - some operations may require service role key');
console.log('   Get service role key from: https://supabase.com/dashboard/project/uqgfdxfttmdkqblxcqmi/settings/api\n');

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const fixRLSPolicies = async () => {
  console.log('🚀 Starting RLS policies fix...\n');

  const sqlScript = `
    -- Drop old policies
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

    -- Recreate with BOTH USING and WITH CHECK for UPDATE
    CREATE POLICY "Users can view own profile"
      ON profiles FOR SELECT
      USING (auth.uid() = id);

    CREATE POLICY "Users can insert own profile"
      ON profiles FOR INSERT
      WITH CHECK (auth.uid() = id);

    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);

    -- Enable RLS
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    -- Verify
    SELECT '✅ Policies Fixed!' as status,
           COUNT(*) || ' policies created' as result
    FROM pg_policies
    WHERE tablename = 'profiles';
  `;

  try {
    console.log('📝 Executing SQL script...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript });

    if (error) {
      // Try direct query if rpc doesn't work
      console.log('⚠️  exec_sql not available, trying direct query...');

      const { error: error1 } = await supabase.rpc('query', {
        query_text: 'DROP POLICY IF EXISTS "Users can view own profile" ON profiles'
      });

      const { error: error2 } = await supabase.rpc('query', {
        query_text: 'DROP POLICY IF EXISTS "Users can insert own profile" ON profiles'
      });

      const { error: error3 } = await supabase.rpc('query', {
        query_text: 'DROP POLICY IF EXISTS "Users can update own profile" ON profiles'
      });

      const { error: error4 } = await supabase.rpc('query', {
        query_text: `CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id)`
      });

      const { error: error5 } = await supabase.rpc('query', {
        query_text: `CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id)`
      });

      const { error: error6 } = await supabase.rpc('query', {
        query_text: `CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)`
      });

      const { error: error7 } = await supabase.rpc('query', {
        query_text: 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY'
      });

      if (error1 || error2 || error3 || error4 || error5 || error6 || error7) {
        throw new Error('Failed to execute queries. Please run the SQL script manually in Supabase Dashboard.');
      }
    }

    console.log('\n✅ SUCCESS! RLS policies have been fixed!');
    console.log('\n📊 Verifying...');

    // Verify policies
    const { data: policies, error: verifyError } = await supabase
      .from('pg_policies')
      .select('policyname, cmd, qual, with_check')
      .eq('tablename', 'profiles');

    if (!verifyError && policies) {
      console.log('\n📋 Current policies:');
      policies.forEach(policy => {
        console.log(`  - ${policy.policyname} (${policy.cmd})`);
        if (policy.cmd === 'UPDATE') {
          console.log(`    ✓ USING: ${policy.qual ? '✅' : '❌'}`);
          console.log(`    ✓ WITH CHECK: ${policy.with_check ? '✅' : '❌'}`);
        }
      });
    }

    console.log('\n🎉 All done! You can now update profiles without permission errors.');

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error('\n⚠️  Could not execute via script. Please run manually:');
    console.error('\n1. Go to: https://supabase.com/dashboard');
    console.error('2. Open SQL Editor');
    console.error('3. Run the script in: supabase/QUICK_FIX_PROFILES_RLS.sql');
    process.exit(1);
  }
};

// Run the fix
fixRLSPolicies()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
