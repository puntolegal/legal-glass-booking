import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bhhtigrrenqkagtlwrju.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoaHRpZ3JyZW5xa2FndGx3cmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDc5NTYsImV4cCI6MjA2NzA4Mzk1Nn0.ATd8YI-fUF5T6u4-J1WjsNJIQltI6cC41KXXh2Rlt6k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 