import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zqavcmswuewyjrptzloi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxYXZjbXN3dWV3eWpycHR6bG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4Mjk3MzMsImV4cCI6MjA5NTQwNTczM30.H0jwtCLBrHK3HAjbikZuypj1Y4tbATetli-YGeKgRtE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
