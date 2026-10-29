// config.js
const SUPABASE_URL = 'https://xrbhvjezfciqxcrllmha.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ICo6xHNT3T5MlPRNuEMqCw_98OvqwUM';
const IMGBB_API_KEY = '47b8462419a56ea901f9b2f0e6534d3d';
// window.supabase likhna zaroori hai warna variable conflict hota hai
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);