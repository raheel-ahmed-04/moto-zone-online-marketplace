import { createClient } from "@supabase/supabase-js"

// Make sure these values are correct and accessible
const supabaseUrl = "https://bcczpafbscrmjchntmtr.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjY3pwYWZic2NybWpjaG50bXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDUwNjIsImV4cCI6MjA2MjEyMTA2Mn0.5AysybyeXzzEWjUUkhIPp1WdtePBEZaGXvm2xUAS5Cc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


console.log("Supabase client initialized with URL:", supabaseUrl)
