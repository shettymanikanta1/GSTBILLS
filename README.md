# GST Billing System - JavaScript Version

A complete GST billing system built with vanilla JavaScript for GitHub Pages deployment. No server required!

## ✨ Features

✅ **Complete Invoice Management**
- Create invoices with customer details (name, address, phone, GST number, room)
- Add multiple items with quantity, price, and GST percentage
- Auto-generated invoice numbers (timestamp-based: INV202511022229051)
- Real-time GST calculations
- Check-in and check-out date tracking

✅ **Hotel Settings**
- Password-protected hotel details editing (Password: `Manshi@04`)
- Store hotel name, address, GST number, phone, email, and website
- Auto-loaded on all invoices

✅ **Invoice Storage & Viewing**
- All invoices stored in browser localStorage
- Persistent data across sessions
- View all invoices with search functionality
- View invoice history on dashboard

✅ **PDF Download**
- Download invoices as PDF using html2pdf.js
- Professional invoice layout matching GSTBill format
- Includes all customer and hotel details

✅ **Dashboard Statistics**
- Today's invoice count and earnings
- Overall statistics
- Recent invoices list with quick access
- View all invoices page with search

## 📁 Project Structure

```
├── index.html              # Dashboard (entry point)
├── invoice.html            # Create new invoice
├── invoice-details.html     # View invoice and download PDF
├── invoices-list.html      # View all invoices with search
├── hotel.html              # Hotel settings
├── app.js                  # Main JavaScript logic
├── style.css               # Styling
└── README.md              # This file
```

## 🚀 GitHub Pages Deployment Guide

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in top right → **"New repository"**
3. Repository name: `gst-billing` (or any name you prefer)
4. Set visibility: **Public** or **Private** (both work for GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we already have files)
6. Click **"Create repository"**

### Step 2: Upload Files to GitHub

**Option A: Using GitHub Web Interface (Easiest)**

1. In your new repository, click **"uploading an existing file"**
2. Drag and drop all files from this folder:
   - `index.html`
   - `invoice.html`
   - `invoice-details.html`
   - `invoices-list.html`
   - `hotel.html`
   - `app.js`
   - `style.css`
   - `README.md`
3. Scroll down and click **"Commit changes"**

**Option B: Using Git Command Line**

1. Open terminal/command prompt in this folder
2. Run these commands:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: GST Billing System"

# Add your GitHub repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top menu)
3. Scroll down to **"Pages"** in left sidebar
4. Under **"Source"**, select:
   - Branch: **`main`** (or `master`)
   - Folder: **`/ (root)`**
5. Click **"Save"**
6. Wait 1-2 minutes for GitHub to build your site

### Step 4: Access Your Live Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

For example:
- Repository: `gst-billing` → `https://username.github.io/gst-billing/`
- Repository: `hotel-invoice` → `https://username.github.io/hotel-invoice/`

**Note:** GitHub Pages may take a few minutes to become active. You'll see a green checkmark when it's ready.

### ✅ Verification Checklist

After deployment, verify:
- [ ] All pages load correctly
- [ ] Hotel settings can be saved
- [ ] Invoices can be created and saved
- [ ] Invoice details page displays correctly
- [ ] PDF download works
- [ ] All invoices page shows all invoices

## 📖 Usage Guide

### 1. Configure Hotel Details

1. Navigate to **Hotel Settings**
2. Enter password: `Manshi@04`
3. Fill in your hotel details:
   - Hotel Name
   - Hotel Address
   - GST Number
   - Phone Number
   - Email ID
   - Website URL
4. Click **Save Details**

### 2. Create an Invoice

1. Go to **Create Invoice**
2. Enter customer details:
   - Customer Name (required)
   - Customer Phone
   - Room Number
   - Customer Address
   - Customer GST Number (optional)
   - Check-In Date
   - Check-Out Date (auto-calculates number of days)
   - Invoice Date
3. Add items:
   - Description
   - No. of Days (auto-filled from check-in/out)
   - Rate per day
   - GST % (defaults to 18%)
4. Click **Add Item** for each item
5. Click **Save Invoice** when done
6. You'll be redirected to the invoice details page

### 3. View and Download Invoice

1. After saving, you're automatically taken to the invoice details page
2. Or click on any invoice from the dashboard or "All Invoices" page
3. Click **Download PDF** to save as PDF

### 4. View All Invoices

1. Go to **📋 All Invoices** from sidebar
2. Use search box to filter by invoice number, customer name, or date
3. Click **View Invoice** on any invoice to see details

## 🔧 Technical Details

### Data Storage

**localStorage Keys:**
- `hotel` - Hotel details (JSON)
- `allInvoices` - Array of all saved invoices (JSON)

**sessionStorage:**
- `currentInvoice` - Currently being created invoice (cleared after save)

### Invoice Number Format

- Format: `INV202511022229051`
- Pattern: `INV` + Year + Month + Day + Hour + Minute + Second
- Example: `INV202511022229051` = Invoice created on Nov 2, 2025 at 22:29:51

### Dependencies

- **html2pdf.js** - PDF generation (loaded via CDN from cdnjs.cloudflare.com)
- No other external dependencies required!
- No build process needed - works directly in browser

## 📝 Important Notes

- ✅ **All data is stored locally in the browser** (localStorage)
- ✅ **Each user's data is separate** - data is stored per browser/device
- ✅ **Clearing browser data will delete all invoices and settings**
- ✅ **For production use, consider backing up data regularly**
- ✅ **Works offline** after first load (except PDF generation needs internet for CDN)
- ✅ **No database or server required** - 100% client-side

## 🔐 Security

- Hotel settings protected by password: `Manshi@04`
- To change password, edit `checkPassword()` function in `app.js` (line 8)

## 🐛 Troubleshooting

**Site not loading on GitHub Pages:**
- Check if GitHub Pages is enabled in repository Settings
- Wait a few minutes after enabling (GitHub needs time to build)
- Check repository Settings → Pages for any error messages
- Verify `index.html` exists in root directory

**PDF not downloading:**
- Wait a moment for html2pdf.js to load from CDN
- Check internet connection (CDN requires internet)
- Check browser console for errors (F12)
- Try refreshing the page

**Invoices not saving:**
- Check browser console for errors (F12)
- Ensure localStorage is enabled in browser
- Check if hotel details are configured
- Try in a different browser

**Data not persisting:**
- localStorage is per browser/device
- Clearing browser cache will delete data
- Data is stored locally, not on GitHub

## 🔄 Updating Your Site

After making changes:

1. **Using Web Interface:**
   - Edit files directly on GitHub
   - Or upload new versions of files
   - Changes go live within 1-2 minutes

2. **Using Git:**
   ```bash
   git add .
   git commit -m "Updated invoice system"
   git push
   ```

## 👤 Built By

Manshi

---

**Version:** 1.0.4 - Code With JavaScript  
**Deployment:** GitHub Pages Compatible  
**License:** Free to use and modify