import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xxpnptcriyubnzeifmlb.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cG5wdGNyaXl1Ym56ZWlmbWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzM0MTIsImV4cCI6MjA2MzI0OTQxMn0.XytNNQfr8WaMOSQqtKbzAtYBvlltdQPWsZF7uxAUH2E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
