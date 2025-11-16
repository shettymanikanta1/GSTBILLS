// ============================================
// GST BILLING SYSTEM - COMPLETE JS IMPLEMENTATION
// Multi-Hotel Support with Login System
// ============================================

// ---------- USER MANAGEMENT & AUTHENTICATION ----------
function initializeAdminUser() {
    // Check if admin user exists, if not create one
    const users = getAllUsers();
    const adminExists = users.find(u => u.isAdmin);
    
    if (!adminExists) {
        const adminUser = {
            id: "admin_001",
            username: "admin",
            password: "Manshi@04",
            isAdmin: true,
            createdAt: new Date().toISOString()
        };
        users.push(adminUser);
        saveAllUsers(users);
    } else {
        // Update existing admin password if it's the old default
        const adminIndex = users.findIndex(u => u.isAdmin);
        if (adminIndex !== -1 && users[adminIndex].password === "admin123") {
            users[adminIndex].password = "Manshi@04";
            saveAllUsers(users);
        }
    }
}

function getAllUsers() {
    return JSON.parse(localStorage.getItem("allUsers") || "[]");
}

function saveAllUsers(users) {
    localStorage.setItem("allUsers", JSON.stringify(users));
    // Always sync users to cloud (for cross-device sync)
    syncUsersToCloud();
}

function getCurrentUserId() {
    return sessionStorage.getItem("currentUserId");
}

function isLoggedIn() {
    return !!getCurrentUserId();
}

function isAdmin() {
    return sessionStorage.getItem("isAdmin") === "true";
}

function logout() {
    sessionStorage.removeItem("currentUserId");
    sessionStorage.removeItem("currentUsername");
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("currentInvoice");
    window.location.href = "login.html";
}

function deleteUserData(userId) {
    // Delete user-specific data
    localStorage.removeItem(`hotel_${userId}`);
    localStorage.removeItem(`allInvoices_${userId}`);
}

function checkAuth() {
    // Check if user is logged in, redirect to login if not
    if (!isLoggedIn() && !window.location.pathname.includes("login.html") && !window.location.pathname.includes("admin.html")) {
        window.location.href = "login.html";
    }
}

// Initialize admin user on first load
initializeAdminUser();

// ---------- CLOUD SYNC SYSTEM (Cross-Device Sync) ----------
const SYNC_INTERVAL = 20000; // Sync every 20 seconds

// Sync global user accounts to cloud (separate from user data)
async function syncUsersToCloud() {
    try {
        const allUsers = getAllUsers();
        const usersData = {
            users: allUsers,
            lastSync: new Date().toISOString(),
            type: "users"
        };
        
        const syncId = "gst_billing_users_global";
        
        try {
            let response = await fetch(`https://jsonstorage.net/api/items/${syncId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: usersData
                })
            });
            
            if (!response.ok) {
                response = await fetch('https://jsonstorage.net/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: syncId,
                        data: usersData
                    })
                });
            }
            
            if (response.ok) {
                localStorage.setItem("cloud_sync_users_id", syncId);
                localStorage.setItem("last_sync_users", usersData.lastSync);
                return true;
            }
        } catch (e) {
            // Fallback
            localStorage.setItem("cloud_backup_users", JSON.stringify(usersData));
        }
        return true;
    } catch (error) {
        console.error("Users sync error:", error);
        return false;
    }
}

// Sync user-specific data to cloud
async function syncToCloud() {
    const userId = getCurrentUserId();
    if (!userId) return false;

    try {
        const allData = {
            hotel: JSON.parse(localStorage.getItem(`hotel_${userId}`) || "{}"),
            invoices: getAllInvoices(),
            lastSync: new Date().toISOString(),
            userId: userId,
            version: "1.0"
        };

        const cloudData = JSON.stringify(allData);
        const syncId = `gst_billing_${userId}`;
        
        try {
            // Try to update existing or create new
            let response = await fetch(`https://jsonstorage.net/api/items/${syncId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: allData
                })
            });
            
            // If update fails, try creating new
            if (!response.ok) {
                response = await fetch('https://jsonstorage.net/api/items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: syncId,
                        data: allData
                    })
                });
            }
            
            if (response.ok) {
                localStorage.setItem(`cloud_sync_id_${userId}`, syncId);
                localStorage.setItem(`last_sync_${userId}`, allData.lastSync);
                localStorage.setItem(`cloud_backup_${userId}`, cloudData);
                return true;
            }
        } catch (e) {
            // Fallback: Store backup locally
            localStorage.setItem(`cloud_backup_${userId}`, cloudData);
            localStorage.setItem(`last_sync_${userId}`, allData.lastSync);
        }
        
        return true;
    } catch (error) {
        console.error("Cloud sync error:", error);
        return false;
    }
}

// Sync global user accounts from cloud
async function syncUsersFromCloud() {
    try {
        const syncId = localStorage.getItem("cloud_sync_users_id") || "gst_billing_users_global";
        let usersData = null;
        
        try {
            const response = await fetch(`https://jsonstorage.net/api/items/${syncId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.data && result.data.users) {
                    usersData = result.data;
                }
            }
        } catch (e) {
            // Fallback
            const backup = localStorage.getItem("cloud_backup_users");
            if (backup) {
                try {
                    usersData = JSON.parse(backup);
                } catch (e) {
                    return false;
                }
            }
        }
        
        if (!usersData || !usersData.users) return false;
        
        // Merge users
        const localUsers = getAllUsers();
        const cloudUsers = usersData.users;
        const userMap = new Map();
        
        localUsers.forEach(u => userMap.set(u.id, u));
        cloudUsers.forEach(u => userMap.set(u.id, u));
        
        const mergedUsers = Array.from(userMap.values());
        saveAllUsers(mergedUsers);
        localStorage.setItem("last_sync_users", usersData.lastSync);
        
        return true;
    } catch (error) {
        console.error("Users sync from error:", error);
        return false;
    }
}

// Sync user-specific data from cloud
async function syncFromCloud() {
    const userId = getCurrentUserId();
    if (!userId) return false;

    try {
        let cloudData = null;
        const syncId = localStorage.getItem(`cloud_sync_id_${userId}`) || `gst_billing_${userId}`;
        
        // Try to fetch from cloud
        try {
            const response = await fetch(`https://jsonstorage.net/api/items/${syncId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.data) {
                    cloudData = result.data;
                }
            }
        } catch (e) {
            // Fallback to backup
        }
        
        // Fallback to localStorage backup
        if (!cloudData) {
            const backup = localStorage.getItem(`cloud_backup_${userId}`);
            if (backup) {
                try {
                    cloudData = JSON.parse(backup);
                } catch (e) {
                    return false;
                }
            }
        }

        if (!cloudData || cloudData.userId !== userId) return false;

        // Compare sync times
        const cloudLastSync = new Date(cloudData.lastSync || 0);
        const localLastSyncStr = localStorage.getItem(`last_sync_${userId}`);
        const localLastSync = localLastSyncStr ? new Date(localLastSyncStr) : new Date(0);

        if (cloudLastSync > localLastSync) {
            // Cloud is newer - update local
            if (cloudData.hotel && Object.keys(cloudData.hotel).length > 0) {
                localStorage.setItem(`hotel_${userId}`, JSON.stringify(cloudData.hotel));
            }
            if (cloudData.invoices && Array.isArray(cloudData.invoices)) {
                localStorage.setItem(`allInvoices_${userId}`, JSON.stringify(cloudData.invoices));
            }
            localStorage.setItem(`last_sync_${userId}`, cloudData.lastSync);
            
            // Refresh page data
            setTimeout(() => {
                if (document.getElementById("invoiceTable")) {
                    renderInvoiceItems();
                }
                if (document.getElementById("countInvoices")) {
                    updateDashboard();
                }
            }, 500);
            
            return true;
        } else if (localLastSync > cloudLastSync) {
            // Local is newer - sync to cloud
            syncToCloud();
            return false;
        }
        
        return false;
    } catch (error) {
        console.error("Cloud sync from error:", error);
        return false;
    }
}

// Auto-sync on data changes
function autoSync() {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    // Sync both user accounts and user data
    syncUsersToCloud();
    syncToCloud();
}

// Manual sync function
function manualSync() {
    const userId = getCurrentUserId();
    if (!userId) {
        alert("Please login first");
        return;
    }
    
    const statusEl = document.getElementById("syncStatus");
    if (statusEl) {
        statusEl.textContent = "Syncing...";
        statusEl.style.color = "#E100FF";
    }
    
    // Sync both ways - users and user data
    Promise.all([
        syncUsersFromCloud(),
        syncFromCloud()
    ]).then(([usersSynced, dataSynced]) => {
        // Now push to cloud
        return Promise.all([
            syncUsersToCloud(),
            syncToCloud()
        ]);
    }).then(() => {
        if (statusEl) {
            statusEl.textContent = "✓ Synced";
            statusEl.style.color = "#4caf50";
            setTimeout(() => {
                statusEl.textContent = "";
            }, 3000);
        }
        
        // Refresh dashboard
        if (document.getElementById("countInvoices")) {
            updateDashboard();
        }
        if (document.getElementById("invoiceTable")) {
            renderInvoiceItems();
        }
        
        alert("Data synced successfully! All changes from other devices have been loaded.");
    }).catch(() => {
        if (statusEl) {
            statusEl.textContent = "✗ Sync failed";
            statusEl.style.color = "#ff4b4b";
            setTimeout(() => {
                statusEl.textContent = "";
            }, 3000);
        }
        alert("Sync failed. Please check your internet connection.");
    });
}

// Initialize sync on page load
function initializeCloudSync() {
    // Always sync users (even if not logged in, for login page)
    setTimeout(() => {
        syncUsersFromCloud();
    }, 1000);
    
    if (!isLoggedIn()) {
        // Still sync users periodically even when not logged in
        setInterval(() => {
            syncUsersFromCloud();
        }, SYNC_INTERVAL);
        return;
    }
    
    // Initial sync from cloud after page loads
    setTimeout(() => {
        syncUsersFromCloud();
        syncFromCloud();
    }, 1500);
    
    // Set up auto-sync interval
    const syncInterval = setInterval(() => {
        syncUsersFromCloud();
        if (isLoggedIn()) {
            syncFromCloud();
        } else {
            clearInterval(syncInterval);
        }
    }, SYNC_INTERVAL);
}

// ---------- HOTEL STORAGE & SETTINGS (USER-SPECIFIC) ----------
function checkPassword() {
    // Simplified password check for hotel settings (since users are already logged in)
    // You can remove this or use it as an additional security layer
    document.getElementById("settingsModal").style.display = "flex";
    loadHotelDetails();
}

function closeModal() {
    document.getElementById("settingsModal").style.display = "none";
}

function saveHotel() {
    const userId = getCurrentUserId();
    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const data = {
        name: document.getElementById("hotelName").value,
        address: document.getElementById("hotelAddress").value,
        gst: document.getElementById("hotelGST").value,
        phone: document.getElementById("hotelPhone").value,
        email: document.getElementById("hotelEmail").value,
        website: document.getElementById("hotelWebsite").value
    };

    // Save hotel data with user ID prefix
    localStorage.setItem(`hotel_${userId}`, JSON.stringify(data));
    // Auto-sync to cloud
    autoSync();
    alert("Hotel details saved.");
    closeModal();
}

function loadHotelDetails() {
    const userId = getCurrentUserId();
    if (!userId) return;

    const hotel = JSON.parse(localStorage.getItem(`hotel_${userId}`) || "{}");
    if (hotel.name || Object.keys(hotel).length > 0) {
        document.getElementById("hotelName").value = hotel.name || "";
        document.getElementById("hotelAddress").value = hotel.address || "";
        document.getElementById("hotelGST").value = hotel.gst || "";
        document.getElementById("hotelPhone").value = hotel.phone || "";
        document.getElementById("hotelEmail").value = hotel.email || "";
        document.getElementById("hotelWebsite").value = hotel.website || "";
    }
}

// ---------- INVOICE STORAGE (USER-SPECIFIC) ----------
function getAllInvoices() {
    const userId = getCurrentUserId();
    if (!userId) return [];
    return JSON.parse(localStorage.getItem(`allInvoices_${userId}`) || "[]");
}

function saveAllInvoices(invoices) {
    const userId = getCurrentUserId();
    if (!userId) return;
    localStorage.setItem(`allInvoices_${userId}`, JSON.stringify(invoices));
    // Auto-sync to cloud
    autoSync();
}

function getNextInvoiceNumber() {
    // Generate timestamp-based invoice number: INV202511022229051
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    return `INV${year}${month}${day}${hour}${minute}${second}`;
}

// ---------- CURRENT INVOICE (Being Created) ----------
let currentInvoice = {
    items: [],
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    customerRoom: "",
    customerGST: "",
    checkInDate: "",
    checkOutDate: "",
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: ""
};

// Load current invoice from session or initialize
function initCurrentInvoice() {
    const saved = sessionStorage.getItem("currentInvoice");
    if (saved) {
        currentInvoice = JSON.parse(saved);
    }
}

function saveCurrentInvoice() {
    sessionStorage.setItem("currentInvoice", JSON.stringify(currentInvoice));
}

// ---------- RENDER INVOICE ITEMS ----------
function renderInvoiceItems() {
    const table = document.getElementById("invoiceTable");
    if (!table) return;

    if (currentInvoice.items.length === 0) {
        table.innerHTML = "<tr><td colspan='5' style='text-align:center;opacity:0.6;'>No items added yet</td></tr>";
        updateInvoiceTotals();
        return;
    }

    table.innerHTML = currentInvoice.items.map((item, idx) => {
        const subtotal = item.quantity * item.price;
        const gstAmount = subtotal * (item.gstRate / 100);
        const total = subtotal + gstAmount;
        return `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>${item.gstRate}%</td>
                <td>₹${total.toFixed(2)}</td>
                <td><button class="btn btn-danger" style="padding:5px 10px;font-size:12px;" onclick="removeItem(${idx})">Remove</button></td>
            </tr>
        `;
    }).join("");

    updateInvoiceTotals();
}

function updateInvoiceTotals() {
    let subtotal = 0;
    let totalGST = 0;

    currentInvoice.items.forEach(item => {
        const itemSubtotal = item.quantity * item.price;
        const itemGST = itemSubtotal * (item.gstRate / 100);
        subtotal += itemSubtotal;
        totalGST += itemGST;
    });

    const grandTotal = subtotal + totalGST;

    const totalsDiv = document.getElementById("invoiceTotals");
    if (totalsDiv) {
        totalsDiv.innerHTML = `
            <div style="margin-top:20px;padding-top:20px;border-top:2px solid rgba(255,255,255,0.3);">
                <div style="display:flex;justify-content:space-between;margin:10px 0;">
                    <strong>Subtotal:</strong> <strong>₹${subtotal.toFixed(2)}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;margin:10px 0;">
                    <strong>Total GST:</strong> <strong>₹${totalGST.toFixed(2)}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;margin:10px 0;font-size:20px;color:#E100FF;">
                    <strong>Grand Total:</strong> <strong>₹${grandTotal.toFixed(2)}</strong>
                </div>
            </div>
        `;
    }

    currentInvoice.subtotal = subtotal;
    currentInvoice.totalGST = totalGST;
    currentInvoice.grandTotal = grandTotal;
    saveCurrentInvoice();
}

// ---------- ADD ITEM TO INVOICE ----------
function addItem() {
    const name = document.getElementById("itemName")?.value?.trim() || "";
    const quantity = parseFloat(document.getElementById("itemQty")?.value || "1");
    const price = parseFloat(document.getElementById("itemPrice")?.value || "0");
    const gstRate = parseFloat(document.getElementById("itemGST")?.value || "18");

    if (name === "" || quantity <= 0 || price <= 0) {
        alert("Please fill all fields correctly");
        return;
    }

    currentInvoice.items.push({ name, quantity, price, gstRate });
    saveCurrentInvoice();
    renderInvoiceItems();

    // Clear inputs
    if (document.getElementById("itemName")) document.getElementById("itemName").value = "";
    if (document.getElementById("itemQty")) document.getElementById("itemQty").value = "1";
    if (document.getElementById("itemPrice")) document.getElementById("itemPrice").value = "";
    if (document.getElementById("itemGST")) document.getElementById("itemGST").value = "18";
}

function removeItem(index) {
    currentInvoice.items.splice(index, 1);
    saveCurrentInvoice();
    renderInvoiceItems();
}

function clearInvoice() {
    if (confirm("Clear all items from current invoice?")) {
        currentInvoice.items = [];
        saveCurrentInvoice();
        renderInvoiceItems();
    }
}

// ---------- CALCULATE DAYS FROM CHECK-IN/CHECK-OUT ----------
function calculateDays() {
    const checkInDate = document.getElementById("checkInDate")?.value;
    const checkOutDate = document.getElementById("checkOutDate")?.value;
    const qtyInput = document.getElementById("itemQty");

    if (checkInDate && checkOutDate && qtyInput) {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut < checkIn) {
            alert("Check-out date must be after check-in date");
            document.getElementById("checkOutDate").value = "";
            return;
        }

        // Calculate difference in days (inclusive of both dates)
        const timeDiff = checkOut - checkIn;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days

        if (daysDiff > 0) {
            qtyInput.value = daysDiff;
            // Also save to current invoice
            currentInvoice.checkInDate = checkInDate;
            currentInvoice.checkOutDate = checkOutDate;
            saveCurrentInvoice();
        }
    }
}

// ---------- SAVE INVOICE ----------
function saveInvoice() {
    // Get customer details
    const customerName = document.getElementById("customerName")?.value?.trim() || "";
    const customerAddress = document.getElementById("customerAddress")?.value?.trim() || "";
    const customerPhone = document.getElementById("customerPhone")?.value?.trim() || "";
    const customerRoom = document.getElementById("customerRoom")?.value?.trim() || "";
    const customerGST = document.getElementById("customerGST")?.value?.trim() || "";
    const checkInDate = document.getElementById("checkInDate")?.value || "";
    const checkOutDate = document.getElementById("checkOutDate")?.value || "";
    const invoiceDate = document.getElementById("invoiceDate")?.value || new Date().toISOString().split('T')[0];

    if (customerName === "") {
        alert("Please enter customer name");
        return;
    }

    if (currentInvoice.items.length === 0) {
        alert("Please add at least one item");
        return;
    }

    // Check if hotel details exist (user-specific)
    const userId = getCurrentUserId();
    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }
    const hotel = JSON.parse(localStorage.getItem(`hotel_${userId}`) || "{}");
    if (!hotel.name) {
        alert("Please configure hotel details first in Hotel Settings");
        return;
    }

    currentInvoice.customerName = customerName;
    currentInvoice.customerAddress = customerAddress;
    currentInvoice.customerPhone = customerPhone;
    currentInvoice.customerRoom = customerRoom;
    currentInvoice.customerGST = customerGST;
    currentInvoice.checkInDate = checkInDate;
    currentInvoice.checkOutDate = checkOutDate;
    currentInvoice.date = invoiceDate;
    currentInvoice.invoiceNumber = getNextInvoiceNumber();
    currentInvoice.id = Date.now().toString();
    currentInvoice.createdAt = new Date().toISOString();

    // Calculate totals
    updateInvoiceTotals();

    // Save to all invoices
    const allInvoices = getAllInvoices();
    const savedInvoice = { ...currentInvoice };
    allInvoices.push(savedInvoice);
    saveAllInvoices(allInvoices);

    alert(`Invoice ${currentInvoice.invoiceNumber} saved successfully!`);

    // Store the saved invoice ID for redirect
    const savedInvoiceId = savedInvoice.id;

    // Clear current invoice
    currentInvoice = {
        items: [],
        customerName: "",
        customerAddress: "",
        customerPhone: "",
        customerRoom: "",
        customerGST: "",
        checkInDate: "",
        checkOutDate: "",
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: ""
    };
    sessionStorage.removeItem("currentInvoice");
    
    // Clear form
    if (document.getElementById("customerName")) document.getElementById("customerName").value = "";
    if (document.getElementById("customerAddress")) document.getElementById("customerAddress").value = "";
    if (document.getElementById("customerPhone")) document.getElementById("customerPhone").value = "";
    if (document.getElementById("customerRoom")) document.getElementById("customerRoom").value = "";
    if (document.getElementById("customerGST")) document.getElementById("customerGST").value = "";
    if (document.getElementById("checkInDate")) document.getElementById("checkInDate").value = "";
    if (document.getElementById("checkOutDate")) document.getElementById("checkOutDate").value = "";
    if (document.getElementById("invoiceDate")) document.getElementById("invoiceDate").value = new Date().toISOString().split('T')[0];
    
    renderInvoiceItems();
    
    // Redirect to invoice details
    window.location.href = `invoice-details.html?id=${savedInvoiceId}`;
}

// ---------- DASHBOARD STATISTICS ----------
function updateDashboard() {
    const invoices = getAllInvoices();
    const today = new Date().toISOString().split('T')[0];
    
    // Today's invoices
    const todayInvoices = invoices.filter(inv => inv.date === today);
    
    // Calculate today's earnings
    let todayEarnings = 0;
    todayInvoices.forEach(inv => {
        todayEarnings += inv.grandTotal || 0;
    });

    // Total statistics
    let totalEarnings = 0;
    invoices.forEach(inv => {
        totalEarnings += inv.grandTotal || 0;
    });

    const countEl = document.getElementById("countInvoices");
    const earnEl = document.getElementById("earn");
    
    if (countEl) countEl.textContent = todayInvoices.length;
    if (earnEl) earnEl.textContent = todayEarnings.toFixed(2);

    // Recent invoices list
    const recentList = document.getElementById("recentInvoices");
    if (recentList) {
        if (invoices.length === 0) {
            recentList.innerHTML = "<p style='opacity:0.6;'>No invoices yet. Create your first invoice!</p>";
        } else {
            const recent = invoices.slice(-5).reverse();
            recentList.innerHTML = recent.map(inv => `
                <div style="padding:12px;background:rgba(255,255,255,0.05);border-radius:8px;margin:8px 0;">
                    <div style="display:flex;justify-content:space-between;">
                        <div>
                            <strong>${inv.invoiceNumber}</strong> - ${inv.customerName}
                        </div>
                        <div>
                            ₹${(inv.grandTotal || 0).toFixed(2)}
                            <a href="invoice-details.html?id=${inv.id}" style="margin-left:10px;color:#E100FF;">View</a>
                        </div>
                    </div>
                    <div style="font-size:12px;opacity:0.7;margin-top:5px;">${inv.date}</div>
                </div>
            `).join("");
        }
    }

    // Total stats
    const totalCountEl = document.getElementById("totalInvoices");
    const totalEarnEl = document.getElementById("totalEarnings");
    
    if (totalCountEl) totalCountEl.textContent = invoices.length;
    if (totalEarnEl) totalEarnEl.textContent = totalEarnings.toFixed(2);
}

// ---------- INITIALIZE ON PAGE LOAD ----------
window.addEventListener("DOMContentLoaded", function() {
    // Check authentication (except on login and admin pages)
    if (!window.location.pathname.includes("login.html") && !window.location.pathname.includes("admin.html")) {
        checkAuth();
    }

    // Initialize cloud sync
    initializeCloudSync();

    // Initialize current invoice
    initCurrentInvoice();

    // Load hotel details on hotel.html
    if (document.getElementById("settingsModal")) {
        loadHotelDetails();
    }

    // Render invoice items if on invoice page
    if (document.getElementById("invoiceTable")) {
        renderInvoiceItems();
        // Set today's date
        const dateInput = document.getElementById("invoiceDate");
        if (dateInput && !currentInvoice.date) {
            dateInput.value = new Date().toISOString().split('T')[0];
            // Update display for invoice date
            if (typeof updateDateDisplay === 'function') {
                setTimeout(() => updateDateDisplay('invoiceDate', 'invoiceDateDisplay'), 100);
            }
        }
        // Load check-in/check-out dates if they exist
        if (currentInvoice.checkInDate && document.getElementById("checkInDate")) {
            document.getElementById("checkInDate").value = currentInvoice.checkInDate;
            if (typeof updateDateDisplay === 'function') {
                setTimeout(() => updateDateDisplay('checkInDate', 'checkInDisplay'), 100);
            }
        }
        if (currentInvoice.checkOutDate && document.getElementById("checkOutDate")) {
            document.getElementById("checkOutDate").value = currentInvoice.checkOutDate;
            if (typeof updateDateDisplay === 'function') {
                setTimeout(() => updateDateDisplay('checkOutDate', 'checkOutDisplay'), 100);
            }
        }
    }

    // Update dashboard if on index page
    if (document.getElementById("countInvoices")) {
        updateDashboard();
    }

    // Load invoice details if on invoice-details page
    if (window.location.pathname.includes("invoice-details.html") || window.location.pathname.includes("invoice-details")) {
        loadInvoiceDetails();
    }
});

// ---------- LOAD INVOICE DETAILS ----------
function loadInvoiceDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get("id");
    
    if (!invoiceId) {
        document.body.innerHTML = "<div class='main'><h1>Invoice not found</h1></div>";
        return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
        window.location.href = "login.html";
        return;
    }

    const invoices = getAllInvoices();
    const invoice = invoices.find(inv => inv.id === invoiceId);
    const hotel = JSON.parse(localStorage.getItem(`hotel_${userId}`) || "{}");

    if (!invoice) {
        document.body.innerHTML = "<div class='main'><h1>Invoice not found</h1></div>";
        return;
    }

    // Format date with time
    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr + "T00:00:00");
        const now = new Date(invoice.createdAt || Date.now());
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${dateStr} ${hours}:${minutes}`;
    };

    // Render invoice details
    const container = document.getElementById("invoiceDetailsContainer");
    if (container) {
        container.innerHTML = `
            <div class="invoice-preview" id="invoicePreview">
                <!-- Header: GSTBill on left, Invoice # and Date on right -->
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;border-bottom:2px solid #ddd;padding-bottom:20px;">
                    <div>
                        <h1 style="font-size:48px;font-weight:bold;margin:0;color:#333;">GSTBill</h1>
                        <!-- Hotel Details -->
                        <div style="margin-top:20px;">
                            ${hotel.name ? `<p style="margin:5px 0;font-size:16px;"><strong style="font-weight:bold;">${hotel.name}</strong></p>` : ''}
                            ${hotel.address ? `<p style="margin:5px 0;font-size:13px;color:#555;">${hotel.address}</p>` : ''}
                            ${hotel.gst ? `<p style="margin:5px 0;font-size:13px;color:#555;">GST: ${hotel.gst}</p>` : ''}
                            ${hotel.phone ? `<p style="margin:5px 0;font-size:13px;color:#555;">Phone: ${hotel.phone}</p>` : ''}
                            ${hotel.email ? `<p style="margin:5px 0;font-size:13px;color:#555;">Email: ${hotel.email}</p>` : ''}
                            ${hotel.website ? `<p style="margin:5px 0;font-size:13px;color:#555;">Website: <a href="${hotel.website.startsWith('http') ? hotel.website : 'http://' + hotel.website}" target="_blank" style="color:#007bff;text-decoration:underline;">${hotel.website}</a></p>` : ''}
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <p style="margin:5px 0;font-size:14px;"><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                        <p style="margin:5px 0;font-size:14px;"><strong>Date:</strong> ${formatDateTime(invoice.date)}</p>
                    </div>
                </div>

                <!-- Customer Details: Customer, Phone, Room, Address, GST, Check-In/Check-Out -->
                <div style="margin-bottom:25px;">
                    <p style="margin:5px 0;font-size:15px;"><strong>Customer:</strong> <strong>${invoice.customerName}</strong></p>
                    ${invoice.customerAddress ? `<p style="margin:5px 0;font-size:15px;">${invoice.customerAddress}</p>` : ''}
                    ${invoice.customerPhone ? `<p style="margin:5px 0;font-size:15px;"><strong>Phone:</strong> ${invoice.customerPhone}</p>` : ''}
                    ${invoice.customerGST ? `<p style="margin:5px 0;font-size:15px;"><strong>GST:</strong> ${invoice.customerGST}</p>` : ''}
                    ${invoice.customerRoom ? `<p style="margin:5px 0;font-size:15px;"><strong>Room:</strong> ${invoice.customerRoom}</p>` : ''}
                    ${invoice.checkInDate ? `<p style="margin:5px 0;font-size:15px;"><strong>Check-In:</strong> ${invoice.checkInDate}</p>` : ''}
                    ${invoice.checkOutDate ? `<p style="margin:5px 0;font-size:15px;"><strong>Check-Out:</strong> ${invoice.checkOutDate}</p>` : ''}
                </div>

                <hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">

                <!-- Item Table: Description, No. of Days, Rate per day, Subtotal, GST, Total -->
                <div style="margin-top:20px;">
                    ${invoice.items.map(item => {
                        const subtotal = item.quantity * item.price;
                        const gstAmount = subtotal * (item.gstRate / 100);
                        const total = subtotal + gstAmount;
                        return `
                            <div style="display:flex;border-bottom:1px solid #ddd;padding:15px 0;">
                                <div style="flex:1;padding-right:20px;">
                                    <p style="margin:5px 0;font-weight:bold;">Description</p>
                                    <p style="margin:5px 0;">${item.name}</p>
                                    <p style="margin:5px 0;margin-top:10px;"><strong>No. of Days</strong></p>
                                    <p style="margin:5px 0;">${item.quantity}</p>
                                    <p style="margin:5px 0;margin-top:10px;"><strong>Rate per day</strong></p>
                                    <p style="margin:5px 0;">₹${item.price.toFixed(1)}</p>
                                </div>
                                <div style="flex:1;text-align:right;padding-left:20px;">
                                    <p style="margin:5px 0;font-weight:bold;">Subtotal</p>
                                    <p style="margin:5px 0;">₹${subtotal.toFixed(1)}</p>
                                    <p style="margin:5px 0;margin-top:10px;"><strong>GST (${item.gstRate.toFixed(1)}%)</strong></p>
                                    <p style="margin:5px 0;">₹${gstAmount.toFixed(2)}</p>
                                    <p style="margin:5px 0;margin-top:10px;"><strong>Total</strong></p>
                                    <p style="margin:5px 0;font-weight:bold;font-size:16px;">₹${total.toFixed(2)}</p>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>

                <!-- Footer -->
                <div style="margin-top:40px;padding-top:20px;border-top:2px solid #ddd;">
                    <p style="text-align:left;font-size:11px;color:#666;margin:0;">This is a computer generated invoice</p>
                </div>
            </div>
        `;
    }
}

// ---------- DOWNLOAD PDF ----------
function downloadInvoicePDF(event) {
    const invoicePreview = document.getElementById("invoicePreview");
    if (!invoicePreview) {
        alert("Invoice preview not found. Please wait for the page to load.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const invoiceId = urlParams.get("id");
    const invoices = getAllInvoices();
    const invoice = invoices.find(inv => inv.id === invoiceId);
    
    if (!invoice) {
        alert("Invoice not found");
        return;
    }

    // Check if html2pdf is loaded
    if (typeof html2pdf === 'undefined') {
        alert("PDF library not loaded. Please wait a moment and try again.");
        return;
    }

    // Show loading message
    let button = null;
    let originalText = "";
    if (event && event.target) {
        button = event.target;
        originalText = button.innerHTML;
        button.innerHTML = "⏳ Generating PDF...";
        button.disabled = true;
    }

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `${invoice.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(invoicePreview).save().then(() => {
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }).catch(err => {
        console.error("PDF generation error:", err);
        alert("Error generating PDF. Please try again.");
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
}