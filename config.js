// 1. Clerk Publishable Key
const CLERK_PUBLISHABLE_KEY = 'pk_test_cmlnaHQtc2Vhc25haWwtMzE2MC5jbGVyay5hY2NvdW50cy5kZXYk';

// 2. Supabase Details
const SUPABASE_URL = 'https://xrbhvjezfciqxcrllmha.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ICo6xHNT3T5MlPRNuEMqCw_98OvqwUM';

// 3. ImgBB Key (Pictures upload karne ke liye)
const IMGBB_API_KEY = '47b8462419a56ea901f9b2f0e6534d3d';

// Supabase Client (Clerk Token ke sath)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    accessToken: async () => {
        if (window.Clerk && window.Clerk.session) {
            return await window.Clerk.session.getToken();
        }
        return null;
    }
});