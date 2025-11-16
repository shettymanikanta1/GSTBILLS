# 🚀 Deploy GST Billing System on GitHub Pages

## ✅ Your Project is Ready!

Your multi-hotel GST billing system is **100% ready** for GitHub Pages deployment. Everything is client-side (JavaScript + localStorage), so no server needed!

---

## 📋 Quick Deployment Steps

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Repository name: `gst-billing` (or any name)
4. Description: "Multi-Hotel GST Billing System"
5. Visibility: **Public** or **Private** (both work)
6. **DO NOT** check "Add README" (we already have files)
7. Click **"Create repository"**

### Step 2: Upload Your Files

**Option A: Web Interface (Easiest)**

1. In your new repository, click **"uploading an existing file"**
2. Drag and drop these files from your folder:
   ```
   ✅ index.html          (Dashboard - entry point)
   ✅ login.html          (Login page)
   ✅ admin.html          (Admin panel)
   ✅ invoice.html        (Create invoice)
   ✅ invoice-details.html (View invoice & PDF)
   ✅ invoices-list.html  (All invoices list)
   ✅ hotel.html          (Hotel settings)
   ✅ app.js              (Main JavaScript)
   ✅ style.css           (Styling)
   ✅ README.md           (Documentation)
   ✅ .gitignore          (Git ignore file)
   ✅ DEPLOYMENT.md       (Deployment guide)
   ```
3. Scroll down and click **"Commit changes"**

**Option B: Git Command Line**

```bash
# Navigate to your project folder
cd "D:\GST Bill\1.0.4 - Code With Java Script"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Multi-Hotel GST Billing System"

# Add your GitHub repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top menu)
3. Scroll down to **"Pages"** (left sidebar)
4. Under **"Source"**:
   - Branch: Select **`main`** (or `master`)
   - Folder: Select **`/ (root)`**
5. Click **"Save"**
6. Wait 1-2 minutes for GitHub to build your site

### Step 4: Access Your Live Site

Your site will be live at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

**Examples:**
- Repository: `gst-billing` → `https://username.github.io/gst-billing/`
- Repository: `hotel-invoice` → `https://username.github.io/hotel-invoice/`

**Note:** You'll see a green checkmark when it's ready!

---

## 🔐 Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `Manshi@04`

**First Steps After Deployment:**
1. Login as admin
2. Go to Admin Panel
3. Create hotel user accounts
4. Give credentials to hotels

---

## ✅ Verification Checklist

After deployment, test these:

**Login System:**
- [x] Login page loads
- [x] Can login as admin
- [x] Admin panel works
- [x] Can create hotel users
- [x] Hotel users can login

**Invoice System:**
- [x] Dashboard loads
- [x] Can create invoices
- [x] PDF download works
- [x] All invoices page works
- [x] Search works

**Data Isolation:**
- [x] Each hotel's data is separate
- [x] Hotel settings save correctly
- [x] Invoices save per hotel

---

## 🌐 How Users Will Access

1. **Admin Access:**
   - URL: `https://yourusername.github.io/repo-name/login.html`
   - Login with: `admin` / `Manshi@04`
   - Access Admin Panel to create hotel accounts

2. **Hotel Users:**
   - Same URL: `https://yourusername.github.io/repo-name/login.html`
   - Login with credentials provided by admin
   - Each hotel has isolated data

---

## 📝 Important Notes

✅ **Works Offline:** After first load, most features work offline  
✅ **Data Storage:** All data stored in browser localStorage (per browser/device)  
✅ **No Database:** No server or database needed  
✅ **Free Hosting:** GitHub Pages is completely free  
✅ **Custom Domain:** Can add custom domain later if needed  

---

## 🔧 Troubleshooting

**Site not loading?**
- Wait 2-3 minutes after enabling Pages
- Check repository Settings → Pages for errors
- Verify `index.html` is in root directory

**Login not working?**
- Clear browser cache and try again
- Check browser console for errors (F12)
- Verify admin password is `Manshi@04`

**PDF not downloading?**
- Requires internet connection (CDN for html2pdf.js)
- Check browser console for errors
- Try different browser

---

## 🎉 Success!

Once deployed:
- ✅ Share the URL with hotel users
- ✅ Each hotel gets their own login
- ✅ All data is isolated per hotel
- ✅ No maintenance required
- ✅ Completely free hosting

**Need help?** Check `README.md` or `DEPLOYMENT.md` for more details.

---

**Ready to deploy? Follow the steps above and you're done!** 🚀
