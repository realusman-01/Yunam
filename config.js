// config.js
const SUPABASE_URL = 'https://xrbhvjezfciqxcrllmha.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ICo6xHNT3T5MlPRNuEMqCw_98OvqwUM';

// window.supabase likhna zaroori hai warna variable conflict hota hai
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);