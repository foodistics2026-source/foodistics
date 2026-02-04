# Foodistics Setup Checklist

## Pre-Deployment Setup

### 1. Database Setup ✓
- [ ] Create Supabase project
- [ ] Run migration SQL from `migrations/001_initial_schema.sql`
- [ ] Verify all tables are created
- [ ] Check Row-Level Security (RLS) policies are active

### 2. Storage Setup (Image Uploads)
- [ ] Create `product-images` storage bucket in Supabase
- [ ] Set bucket to **Public**
- [ ] Add RLS policies for read/write access
- [ ] Test bucket access with sample image

### 3. Authentication Setup ✓
- [ ] Enable Email auth provider in Supabase
- [ ] Configure email templates (optional but recommended)
- [ ] Test signup/signin flows

### 4. Environment Configuration
- [ ] Create `.env.local` file from `.env.example`
- [ ] Add `VITE_SUPABASE_URL` (from Supabase project settings)
- [ ] Add `VITE_SUPABASE_ANON_KEY` (from Supabase project settings)
- [ ] Verify environment variables are loaded

### 5. Initial Data Setup
- [ ] Log in to admin panel
- [ ] Create at least 2-3 categories
- [ ] Add 5-10 sample products with images
- [ ] Test product display on shop page

### 6. Testing
- [ ] Test user signup
- [ ] Test user login/logout
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout flow
- [ ] Test admin product creation
- [ ] Test image upload and display

### 7. Production Deployment
- [ ] Review authentication flows
- [ ] Test all routes are accessible
- [ ] Verify images load correctly
- [ ] Check responsive design on mobile
- [ ] Test payment integration (if implementing)
- [ ] Set up domain/hosting

## Quick Start Guide

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd foodistics-brewed-with-precision-main
npm install
```

### Step 2: Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Copy project URL and API key

### Step 3: Setup Database
1. Open Supabase SQL Editor
2. Copy contents of `migrations/001_initial_schema.sql`
3. Paste and run the SQL
4. Wait for completion (should see all tables created)

### Step 4: Setup Storage
1. Go to Storage in Supabase dashboard
2. Create new bucket named `product-images`
3. Toggle **Public** ON
4. Add RLS policies (see IMAGE_UPLOAD_SETUP.md)

### Step 5: Configure Environment
1. Copy `.env.example` to `.env.local`
2. Update Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://yourproject.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 6: Run Development Server
```bash
npm run dev
```

### Step 7: Access Application
- **Home Page**: http://localhost:5173
- **Shop**: http://localhost:5173/shop
- **Admin**: http://localhost:5173/admin
- **Sign Up**: http://localhost:5173/auth/signup
- **Sign In**: http://localhost:5173/auth/signin

## File Structure Reference

```
src/
├── pages/
│   ├── Index.tsx                 # Home page
│   ├── Shop.tsx                  # Product listing
│   ├── Product.tsx               # Product detail
│   ├── Cart.tsx                  # Shopping cart
│   ├── Checkout.tsx              # Checkout flow
│   ├── Account.tsx               # User account
│   ├── OrderDetail.tsx           # Order details
│   ├── Admin.tsx                 # Admin dashboard
│   └── auth/
│       ├── SignUp.tsx            # Registration
│       └── SignIn.tsx            # Login
├── components/
│   ├── layout/
│   │   └── Navbar.tsx            # Navigation with auth
│   ├── sections/
│   │   ├── ProductsSection.tsx   # Featured products
│   │   ├── HeroSection.tsx       # Hero banner
│   │   └── ...other sections
│   ├── admin/
│   │   ├── ProductForm.tsx       # Product creation
│   │   ├── ProductsTable.tsx     # Product listing table
│   │   ├── CategoryForm.tsx      # Category creation
│   │   └── CategoriesTable.tsx   # Category listing
│   ├── ImageUpload.tsx           # Image upload component
│   └── ProductCarousel.tsx       # Product carousel
├── hooks/
│   ├── useAuth.ts                # Auth state hooks
│   ├── useEcommerce.ts           # Ecommerce hooks
│   └── useProducts.ts            # Product hooks
├── lib/
│   ├── auth.ts                   # Auth service
│   ├── imageUpload.ts            # Image upload service
│   ├── supabase.ts               # Supabase client
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
├── App.tsx                       # Main app with routes
└── main.tsx                      # Entry point

docs/
├── AUTHENTICATION.md             # Auth guide
├── DATABASE_SCHEMA.md            # Database documentation
├── IMAGE_UPLOAD_SETUP.md         # Image upload guide
├── MIGRATION_GUIDE.md            # Migration instructions
└── README.md                     # Project overview

migrations/
└── 001_initial_schema.sql        # Database schema
```

## Important Notes

### Database
- **RLS is enabled** - Users can only see/edit their own data
- **Admin role** - Set `is_admin = true` in users table to grant admin access
- **Auto timestamps** - `created_at` and `updated_at` are automatic

### Authentication
- Uses Supabase Auth (built-in security)
- Sessions persist in browser storage
- Logout clears all user data
- Protected routes redirect to login if needed

### Images
- Stored in Supabase Storage bucket
- Maximum size: 5MB per image
- Supported formats: JPEG, PNG, WebP, GIF
- Public URLs generated automatically

### Admin Features
- Only accessible to users with `is_admin = true`
- Can create, edit, delete products and categories
- Can upload product images
- Should set up at least one admin user

## Troubleshooting

### App Won't Start
```bash
# Clear node modules and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Can't Login
- Check Supabase email provider is enabled
- Verify `.env.local` has correct credentials
- Check browser console for error messages

### Images Won't Upload
- Verify `product-images` bucket exists and is public
- Check RLS policies are set correctly
- Verify Supabase project has storage enabled

### Products Not Showing
- Check database migration ran successfully
- Verify products are created in admin panel
- Check browser console for errors

### Admin Page Not Accessible
- Verify user has `is_admin = true` in database
- Log out and back in for role to take effect

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

## Next Steps

1. **Setup Payment Gateway** (Optional)
   - Razorpay: https://razorpay.com
   - Stripe: https://stripe.com
   - PayPal: https://paypal.com

2. **Configure Email** (Optional)
   - Setup email notifications
   - Order confirmation emails
   - Password reset emails

3. **Setup Domain**
   - Point domain to hosting
   - Configure SSL certificate
   - Setup CDN (optional)

4. **Analytics** (Optional)
   - Setup Google Analytics
   - Product tracking
   - User behavior analysis

5. **Performance** (Optional)
   - Setup image optimization
   - Configure caching
   - Monitor page speed
