# 🚀 Deploy to GitHub Pages - Quick Guide

## ✅ All Files Ready!

Your project is **100% ready** for deployment. All files are in place!

---

## 📝 Step-by-Step Deployment

### **Step 1: Create GitHub Repository**

1. Go to **[github.com](https://github.com)** and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `gst-billing` (or any name you like)
   - **Description:** "Multi-Hotel GST Billing System"
   - **Visibility:** Public or Private (both work)
   - **DO NOT** check "Add README" (we already have files)
4. Click **"Create repository"**

---

### **Step 2: Upload Files**

**Easy Method (Recommended):**

1. In your new repository, click **"uploading an existing file"**
2. Drag and drop **ALL these files** from your folder:
   ```
   ✅ index.html
   ✅ login.html
   ✅ admin.html
   ✅ invoice.html
   ✅ invoice-details.html
   ✅ invoices-list.html
   ✅ hotel.html
   ✅ app.js
   ✅ style.css
   ✅ README.md
   ✅ .gitignore
   ✅ DEPLOYMENT.md (optional)
   ✅ GITHUB_PAGES_DEPLOY.md (optional)
   ```
3. Scroll down and click **"Commit changes"**

**OR Use Git Command Line:**

Open terminal/command prompt in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: Multi-Hotel GST Billing System"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

### **Step 3: Enable GitHub Pages**

1. Go to your repository on GitHub
2. Click **"Settings"** (top menu bar)
3. Click **"Pages"** in the left sidebar
4. Under **"Source"**:
   - **Branch:** Select `main` (or `master`)
   - **Folder:** Select `/ (root)`
5. Click **"Save"**
6. Wait **1-2 minutes** for GitHub to build your site

---

### **Step 4: Your Site is Live! 🎉**

Your site will be available at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

**Example:**
- If your username is `john` and repo is `gst-billing`
- Your site: `https://john.github.io/gst-billing/`

**Note:** You'll see a green checkmark ✅ when it's ready!

---

## 🔐 Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `Manshi@04`

**First Steps:**
1. Visit your GitHub Pages URL
2. Login as admin
3. Create hotel user accounts
4. Share credentials with hotels

---

## ✅ Quick Test Checklist

After deployment, test:
- [ ] Login page loads
- [ ] Can login as admin (`admin` / `Manshi@04`)
- [ ] Admin panel works
- [ ] Can create hotel users
- [ ] Can manage hotel settings
- [ ] Hotel users can login
- [ ] Can create invoices
- [ ] PDF download works

---

## 🎯 That's It!

Your multi-hotel GST billing system is now live on GitHub Pages!

**Need help?** Check `GITHUB_PAGES_DEPLOY.md` for detailed instructions.

---

**Ready? Follow the 4 steps above!** 🚀
