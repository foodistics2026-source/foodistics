# 🔐 GitHub Authentication Guide

## ❌ Error: Permission Denied

Your push failed because GitHub needs to authenticate your account. Here's how to fix it:

---

## ✅ Solution: Use Personal Access Token (PAT)

### Step 1: Generate a Personal Access Token

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in the form:
   - **Note:** `Foodistics Push Token`
   - **Expiration:** 90 days (or longer)
   - **Scopes:** Select these checkboxes:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `write:packages` (Upload packages)
     - ✅ `delete:packages` (Delete packages)

4. Click **"Generate token"**
5. **COPY THE TOKEN** - You'll only see it once!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Update Git Remote with Token

Replace `YOUR_TOKEN` with the token you just generated:

```powershell
cd "c:\Users\Mujahid Islam Khan\Downloads\foodistics-brewed-with-precision-main\foodistics-brewed-with-precision-main"

git remote set-url origin https://YOUR_TOKEN@github.com/foodistics2026-source/foodistics.git
```

**Example:**
```powershell
git remote set-url origin https://ghp_abc123def456@github.com/foodistics2026-source/foodistics.git
```

### Step 3: Push to GitHub

```powershell
git push -u origin main
```

It should work now! You'll see:
```
Counting objects: 216, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (150/150), done.
Writing objects: 100% (216/216), ...)

remote: Resolving deltas: 100% (45/45), done.
To https://github.com/foodistics2026-source/foodistics.git
 * [new branch]      main -> main
Branch 'main' set to track remote branch 'main' from 'origin'.
```

---

## 🔒 Security Notes

⚠️ **Never share your Personal Access Token!**
- Don't commit it to GitHub
- Don't share it in messages
- If exposed, regenerate it immediately

**Why use PAT?**
- ✅ More secure than password
- ✅ Can set expiration dates
- ✅ Can revoke anytime
- ✅ Better for automated scripts

---

## ✨ Alternative: SSH (For Future Pushes)

If you want to avoid tokens in the future:

1. Generate SSH key:
```powershell
ssh-keygen -t ed25519 -C "foodistics2026@gmail.com"
```

2. Add to GitHub: https://github.com/settings/keys

3. Update remote:
```powershell
git remote set-url origin git@github.com:foodistics2026-source/foodistics.git
```

4. Push:
```powershell
git push -u origin main
```

---

## 🐛 Troubleshooting

**Still getting "Permission denied"?**
- [ ] Verify token is correct and not expired
- [ ] Check remote URL: `git remote -v`
- [ ] Clear git credentials: `git credential-manager erase https://github.com`
- [ ] Try again: `git push -u origin main`

**Token expired?**
- Go to https://github.com/settings/tokens
- Find the expired token
- Delete it and generate a new one

---

## ✅ Once Push is Successful

You'll see your repository at:
👉 **https://github.com/foodistics2026-source/foodistics**

Then you can:
- [ ] Deploy to Vercel
- [ ] Set up GitHub Actions
- [ ] Submit sitemap to Google

---

**Ready to push?** Generate that token and run the commands above!
