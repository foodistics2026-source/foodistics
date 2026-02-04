# Authentication Guide - Foodistics E-Commerce Platform

## Overview

The Foodistics platform includes a complete authentication system built with Supabase Auth, with support for both customer and admin users. The system includes signup, signin, logout, and session management.

## Features

### Customer Authentication
- User registration with email and password
- User login/logout
- Session persistence
- User profile management
- Password reset functionality
- Cart persistence per user

### Admin Features
- Admin role identification
- Admin-only pages and routes
- Product and category management

## Architecture

### Authentication Service (`src/lib/auth.ts`)

The authentication service handles all auth-related operations:

```typescript
authService.signup(email, password, fullName)    // Register new user
authService.signin(email, password)               // Login user
authService.signout()                             // Logout user
authService.getCurrentUser()                      // Get current user
authService.getUserProfile(userId)                // Get user profile
authService.updateUserProfile(userId, updates)    // Update profile
authService.resetPassword(email)                  // Send password reset email
authService.updatePassword(newPassword)           // Change password
authService.onAuthStateChange(callback)           // Listen to auth changes
```

### Custom Hooks

#### `useAuth()` Hook
Returns current user state and profile:
```typescript
const { user, userProfile, loading, error } = useAuth();
```

#### `useAuthRedirect()` Hook
Automatically redirects unauthenticated users:
```typescript
useAuthRedirect(); // Redirects to /auth/signin if not logged in
```

#### `useAdminCheck()` Hook
Checks if user is an admin:
```typescript
const { isAdmin, loading } = useAdminCheck();
```

### Protected Routes

Routes that require authentication:
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/account` - User account and orders
- `/order/:id` - Order details

Routes that require admin access:
- `/admin` - Admin dashboard

## Pages

### Authentication Pages

#### Sign Up (`/auth/signup`)
- User registration with form validation
- Email and password requirements
- Automatic user profile creation
- Cart initialization
- Success redirect to shop

#### Sign In (`/auth/signin`)
- Email and password login
- Session establishment
- Error handling
- Redirect to previous page or home

### User Pages

#### Account Page (`/account`)
- View user profile
- View order history with status
- Manage delivery addresses
- Add new addresses

#### Cart Page (`/cart`)
- View items in cart
- Update quantities
- Remove items
- Calculate totals (with tax and shipping)
- Proceed to checkout

#### Checkout Page (`/checkout`)
- Multi-step checkout process
  1. **Shipping**: Select delivery address
  2. **Payment**: Choose payment method (Card/UPI/Wallet)
  3. **Review**: Confirm order details
- Create order and process payment
- Order confirmation

#### Order Details Page (`/order/:id`)
- View complete order information
- Order status timeline
- Item details with images
- Shipping address
- Payment information
- Print invoice option

#### Product Detail Page (`/product/:id`)
- Full product information
- Product images
- Price with sale discount
- Stock status
- Customer reviews and ratings
- Related products
- Add to cart with quantity selector

### Admin Pages

#### Admin Dashboard (`/admin`)
- Product management (CRUD)
- Category management (CRUD)
- Order management
- User statistics

## Navigation

### Navbar Authentication Section

#### For Unauthenticated Users
- "Sign In" button → `/auth/signin`
- "Sign Up" button → `/auth/signup`

#### For Authenticated Users
- Shopping cart icon → `/cart`
- User menu with:
  - "My Account" → `/account`
  - "Logout" button → Logout and redirect

## User Data Flow

### Registration Flow
1. User enters email, password, and full name
2. System creates Supabase Auth user
3. User profile created in `users` table
4. Empty cart created in `carts` table
5. User redirected to shop

### Login Flow
1. User enters email and password
2. Supabase Auth validates credentials
3. Session token stored in browser
4. User redirected to requested page or home
5. `useAuth()` hook updates with user data

### Logout Flow
1. User clicks logout
2. Session cleared
3. User redirected to home
4. `useAuth()` hook clears user data

### Cart Flow
1. User adds product to cart
2. Item saved to `cart_items` table
3. Cart total updated
4. Item persists across sessions

### Order Flow
1. User proceeds to checkout
2. Selects shipping address
3. Chooses payment method
4. Confirms order details
5. Order and order items created in database
6. Payment recorded
7. Order confirmation page

## Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (Text, Unique)
- full_name (Text)
- phone (Text)
- avatar_url (Text)
- is_admin (Boolean, Default: false)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Addresses Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- street (Text)
- city (Text)
- state (Text)
- pincode (Text)
- phone (Text)
- type (Text: 'shipping' or 'billing')
- is_default (Boolean)
- created_at (Timestamp)
```

### Carts Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- created_at (Timestamp)
- updated_at (Timestamp)
```

### Orders Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- address_id (UUID, Foreign Key)
- status (Text: 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
- created_at (Timestamp)
- updated_at (Timestamp)
```

## Row-Level Security (RLS)

All tables have RLS policies to ensure users can only access their own data:

- Users can only view their own profile
- Users can only manage their own addresses
- Users can only view their own orders
- Users can only manage their own cart
- Admin users can view and manage all records

## Error Handling

All authentication operations include proper error handling:
- User feedback via toast notifications
- Graceful fallback to login page
- Form validation with clear error messages
- Logging of errors for debugging

## Security Best Practices

1. **Passwords**: Never stored in database, handled by Supabase Auth
2. **Session Tokens**: Automatically managed by Supabase
3. **HTTPS Only**: All API calls use HTTPS
4. **Environment Variables**: Never expose API keys in code
5. **RLS Policies**: Database-level access control
6. **CSRF Protection**: Built into Supabase Auth

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key
```

### Supabase Setup

1. Create a Supabase project
2. Run the migration SQL from `migrations/001_initial_schema.sql`
3. Create an auth provider (Email)
4. Get your API URL and anonymous key
5. Add to `.env.local`

## Common Tasks

### Adding a New Authenticated Page

1. Create page component in `src/pages/`
2. Import `useAuthRedirect` hook
3. Call `useAuthRedirect()` to protect the page
4. Add route in `src/App.tsx`

```typescript
import { useAuthRedirect } from "@/hooks/useAuth";

export default function MyPage() {
  useAuthRedirect(); // Redirects if not authenticated
  
  // Your page content
}
```

### Checking if User is Admin

```typescript
import { useAdminCheck } from "@/hooks/useAuth";

export default function AdminPanel() {
  const { isAdmin, loading } = useAdminCheck();
  
  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Access Denied</div>;
  
  // Admin content
}
```

### Getting Current User

```typescript
import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const { user, userProfile } = useAuth();
  
  // Use user data
}
```

## Troubleshooting

### User can't login
- Check Supabase credentials in `.env.local`
- Verify user email exists in Supabase Auth
- Check browser console for error messages

### Session not persisting
- Clear browser cache and cookies
- Check if Supabase project is active
- Verify RLS policies allow read access

### Cart not saving
- Check if user is authenticated
- Verify `carts` and `cart_items` tables exist
- Check RLS policies on `cart_items` table

### Admin features not working
- Verify user's `is_admin` flag is true in database
- Check admin RLS policies in Supabase

## Support

For issues or questions about authentication, check:
1. Supabase documentation: https://supabase.com/docs
2. Application logs in browser console
3. Supabase dashboard for database issues
