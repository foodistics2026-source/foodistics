## 🚀 QUICK FIX FOR 404 ADDRESS ERROR

**The error you're seeing:**
```
GET https://exhpaoqjtkhmiyfufpeg.supabase.co/rest/v1/addresses... 404 (Not Found)
```

**Why it's happening:**
The `addresses` table doesn't exist in your Supabase database yet.

**How to fix it (2 minutes):**

### ✅ Step 1: Go to Supabase Dashboard
- Login to https://supabase.com
- Select your project
- Click **SQL Editor** in the left menu

### ✅ Step 2: Execute First Migration
1. Click **New Query**
2. Open file: `database/migrations/001_create_shipping_methods.sql`
3. Copy ALL the code
4. Paste into SQL editor in Supabase
5. Click **Run** (Ctrl+Enter or Cmd+Enter)
6. Wait for "Success" message ✅

### ✅ Step 3: Execute Second Migration
1. Click **New Query** again
2. Open file: `database/migrations/002_create_addresses_table.sql`
3. Copy ALL the code
4. Paste into SQL editor
5. Click **Run**
6. Wait for "Success" message ✅

### ✅ Step 4: Verify
Go to **Database** → **Tables** and you should see:
- ✅ `shipping_methods` table
- ✅ `addresses` table

### ✅ Done!
The 404 error will disappear and your app will work perfectly! 🎉

---

**Files to run:**
1. `database/migrations/001_create_shipping_methods.sql`
2. `database/migrations/002_create_addresses_table.sql`

**Location in your project:**
```
foodistics-brewed-with-precision-main/
└── database/
    └── migrations/
        ├── 001_create_shipping_methods.sql ← Run this first
        └── 002_create_addresses_table.sql ← Run this second
```

**That's it!** Your checkout with addresses and shipping will work. 💪
