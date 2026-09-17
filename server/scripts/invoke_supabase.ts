import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://oDbkFlxO5iP2EmdQiZklJw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

console.log('====================================================');
console.log('⚡ INVOKING SUPABASE CLIENT');
console.log('====================================================');
console.log(`📡 Supabase Project URL : ${SUPABASE_URL}`);
console.log(`🔑 Key Type             : ${SUPABASE_KEY.startsWith('sb_secret') ? 'Service Role (SuperAdmin)' : 'Anon / Publishable'}`);
console.log(`🔒 Key Masked           : ${SUPABASE_KEY ? SUPABASE_KEY.substring(0, 16) + '...' : 'Missing'}`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function invokeSupabase() {
  const startTime = Date.now();

  try {
    console.log('\n⏳ 1. Checking Supabase Auth Service Health...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log('⚠️ Supabase Auth Note:', authError.message);
    } else {
      console.log('✅ Supabase Auth Endpoint: ONLINE & ACTIVE');
    }

    console.log('\n⏳ 2. Querying Supabase PostgreSQL REST Engine...');
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .limit(3);

    if (itemsError) {
      console.log('ℹ️ REST Response:', itemsError.message);
    } else {
      console.log(`✅ Retrieved ${items?.length || 0} items directly from Supabase!`);
    }

    const elapsed = Date.now() - startTime;
    console.log(`\n🎉 SUPABASE INVOCATION COMPLETE (${elapsed}ms latency)`);
    console.log('====================================================');
  } catch (err: any) {
    console.error('❌ Supabase Invocation Failed:', err.message || err);
  }
}

invokeSupabase();
