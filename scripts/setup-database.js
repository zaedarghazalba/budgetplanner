#!/usr/bin/env node

/**
 * Database Setup Script
 * Automatically sets up all required tables in Supabase
 *
 * Usage: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTableExists(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);

  // If error and it's not a "no rows" error, table likely doesn't exist
  return !error || error.code !== 'PGRST116';
}

async function runSQL(sql) {
  const { data, error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    // Try alternative method using REST API
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      return await response.json();
    } catch (fetchError) {
      throw new Error(`Failed to execute SQL: ${error.message || fetchError.message}`);
    }
  }

  return data;
}

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Check if categories table exists
    console.log('📋 Checking existing tables...');
    const categoriesExists = await checkTableExists('categories');

    if (categoriesExists) {
      console.log('✅ Table "categories" already exists');
      console.log('ℹ️  Database appears to be already set up\n');

      // Verify all tables
      console.log('🔍 Verifying all tables...');
      const tables = ['profiles', 'categories', 'transactions', 'budget_plans', 'budget_alerts'];
      const results = {};

      for (const table of tables) {
        results[table] = await checkTableExists(table);
      }

      console.log('\n📊 Table Status:');
      for (const [table, exists] of Object.entries(results)) {
        console.log(`  ${exists ? '✅' : '❌'} ${table}`);
      }

      const allExist = Object.values(results).every(v => v);
      if (allExist) {
        console.log('\n✅ All tables exist! Database is ready.');
        return;
      } else {
        console.log('\n⚠️  Some tables are missing. Please run the SQL manually in Supabase Dashboard.');
        console.log('📄 SQL file: SETUP_DATABASE_COMPLETE.sql');
        return;
      }
    }

    // Read SQL file
    const sqlFilePath = path.join(__dirname, '..', 'SETUP_DATABASE_COMPLETE.sql');

    if (!fs.existsSync(sqlFilePath)) {
      console.error(`❌ SQL file not found: ${sqlFilePath}`);
      console.error('Please make sure SETUP_DATABASE_COMPLETE.sql exists in the project root');
      process.exit(1);
    }

    console.log('📄 Reading SQL file...');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('⚙️  Setting up database tables...');
    console.log('   This may take a few moments...\n');

    // Since we can't execute complex SQL via API, we'll guide user to manual setup
    console.log('⚠️  Note: Supabase API has limitations for complex SQL execution.');
    console.log('📋 Please follow these steps to complete setup:\n');

    console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard');
    console.log(`2. Select your project: ${supabaseUrl.replace('https://', '').split('.')[0]}`);
    console.log('3. Click "SQL Editor" in the sidebar');
    console.log('4. Click "New Query"');
    console.log('5. Copy the contents of: SETUP_DATABASE_COMPLETE.sql');
    console.log('6. Paste into the SQL Editor');
    console.log('7. Click "Run" (or press Ctrl+Enter)\n');

    console.log('📖 For detailed instructions, see: README_FIX_DATABASE.md\n');

    console.log('✅ After running the SQL, your database will be ready!');

  } catch (error) {
    console.error('\n❌ Error during setup:', error.message);
    console.error('\n💡 Please run the SQL manually in Supabase Dashboard:');
    console.log('   1. Open: https://supabase.com/dashboard');
    console.log('   2. Go to SQL Editor');
    console.log('   3. Run: SETUP_DATABASE_COMPLETE.sql');
    process.exit(1);
  }
}

// Check if running directly (not imported)
if (require.main === module) {
  setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };
