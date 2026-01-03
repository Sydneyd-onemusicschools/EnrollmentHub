// Supabase Configuration
// This file initializes your Supabase connection

const SUPABASE_URL = 'https://kvyvjwepfrqqkvyyutdw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2eXZqd2VwZnJxcWt2eXl1dGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyMjgyOTgsImV4cCI6MjA4MjgwNDI5OH0.ZayLxzQCEFENvQ9FwpLm4x2le2Y9kJvSslX8DVRzAh8';

// Initialize Supabase client (reuse global variable, don't redeclare)
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);