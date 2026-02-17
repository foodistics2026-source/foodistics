// SUPABASE KEEP-ALIVE CRON JOB SETUP
// This document explains how to set up automatic keep-alive without needing an open browser

/*
IMPORTANT: The frontend keep-alive (in /src/lib/keepAlive.ts) ONLY works when someone has the website open.
To keep Supabase alive 24/7 even when no one is using the site, you need a backend cron job.

OPTION 1: Using Supabase Edge Functions with GitHub Actions (RECOMMENDED - FREE)
================================================================================

1. Create a GitHub Actions workflow file: .github/workflows/supabase-keepalive.yml
   
name: Supabase Keep-Alive
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Keep Supabase alive
        run: |
          curl -X GET "https://YOUR_SUPABASE_URL/rest/v1/categories?select=id&limit=1" \
            -H "apikey: YOUR_SUPABASE_ANON_KEY" \
            -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY"

Note: Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY with your actual values

2. Store secrets in GitHub:
   - Go to Settings → Secrets and variables → Actions
   - Add SUPABASE_URL and SUPABASE_ANON_KEY


OPTION 2: Using Supabase Cron Edge Function (PREMIUM)
=====================================================

Create a Supabase Edge Function that runs on schedule:

supabase/functions/keep-alive/index.ts:

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  )

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id")
      .limit(1)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, timestamp: new Date().toISOString() }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    )
  }
})


OPTION 3: Using External Cron Service (SIMPLE - FREE)
====================================================

Services like EasyCron or CronJobs.io can call your API:

1. Go to https://www.easycron.com
2. Create a new cron job:
   - URL: https://YOUR_SUPABASE_URL/rest/v1/categories?select=id&limit=1
   - Headers: 
     - apikey: YOUR_SUPABASE_ANON_KEY
     - Authorization: Bearer YOUR_SUPABASE_ANON_KEY
   - Frequency: Every 6 hours


OPTION 4: Using Vercel Cron (If your app is on Vercel)
========================================================

api/keep-alive.ts:

export default async function handler(req, res) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/categories?select=id&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    res.status(200).json({ success: true, timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

vercel.json:
{
  "crons": [{
    "path": "/api/keep-alive",
    "schedule": "0 */6 * * *"
  }]
}


RECOMMENDATION:
==============
Use OPTION 1 (GitHub Actions) - it's FREE and reliable:
- No additional service needed
- Keeps Supabase connection alive 24/7
- Runs automatically every 6 hours
- No cost involved

Steps:
1. Create .github/workflows/supabase-keepalive.yml file
2. Add your secrets to GitHub
3. Commit and push
4. GitHub Actions will run automatically

This ensures your Supabase connection never times out, regardless of user activity.
*/
