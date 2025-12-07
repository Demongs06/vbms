// Data Storage (In-Memory)
let customers = [
  { id: 1, name: 'Rajesh Kumar', phone: '+91 9876543210', email: 'rajesh.kumar@email.com' },
  { id: 2, name: 'Priya Sharma', phone: '+91 9876543211', email: 'priya.sharma@email.com' },
  { id: 3, name: 'Amit Patel', phone: '+91 9876543212', email: 'amit.patel@email.com' }
];

let requests = [
  {
    id: 1001,
    customerId: 1,
    customerName: 'Rajesh Kumar',
    phone: '+91 9876543210',
    vehicleType: 'Car',
    vehicleNumber: 'MH-02-AB-1234',
    problemType: 'Engine Failure',
    description: 'Car engine suddenly stopped while driving',
    latitude: 19.0760,
    longitude: 72.8777,
    status: 'Completed',
    assignedDriver: 'Vikram Singh',
    assignedMechanic: 'Suresh Patil',
    createdDate: '2025-10-28'
  },
  {
    id: 1002,
    customerId: 2,
    customerName: 'Priya Sharma',
    phone: '+91 9876543211',
    vehicleType: 'Bike',
    vehicleNumber: 'MH-12-XY-5678',
    problemType: 'Puncture',
    description: 'Flat tire on highway',
    latitude: 19.1136,
    longitude: 72.8697,
    status: 'In Progress',
    assignedDriver: 'Ravi Kumar',
    assignedMechanic: 'Mohan Das',
    createdDate: '2025-10-29'
  },
  {
    id: 1003,
    customerId: 3,
    customerName: 'Amit Patel',
    phone: '+91 9876543212',
    vehicleType: 'Car',
    vehicleNumber: 'MH-03-CD-9012',
    problemType: 'Oil Leakage',
    description: 'Oil leaking from engine',
    latitude: 19.0896,
    longitude: 72.8656,
    status: 'Pending',
    assignedDriver: null,
    assignedMechanic: null,
    createdDate: '2025-10-29'
  }
];

let staff = [
  { id: 101, name: 'Vikram Singh', phone: '+91 9988776655', email: 'vikram.singh@assistance.com', type: 'Driver', available: true },
  { id: 102, name: 'Ravi Kumar', phone: '+91 9988776656', email: 'ravi.kumar@assistance.com', type: 'Driver', available: false },
  { id: 201, name: 'Suresh Patil', phone: '+91 9988776657', email: 'suresh.patil@assistance.com', type: 'Mechanic', available: true },
  { id: 202, name: 'Mohan Das', phone: '+91 9988776658', email: 'mohan.das@assistance.com', type: 'Mechanic', available: false }
];

let bills = [
  {
    id: 5001,
    requestId: 1001,
    customerName: 'Rajesh Kumar',
    serviceType: 'Engine Failure',
    baseAmount: 3000,
    additionalCharges: 500,
    tax: 630,
    total: 4130,
    status: 'Paid',
    createdDate: '2025-10-28'
  },
  {
    id: 5002,
    requestId: 1002,
    customerName: 'Priya Sharma',
    serviceType: 'Puncture',
    baseAmount: 500,
    additionalCharges: 0,
    tax: 90,
    total: 590,
    status: 'Unpaid',
    createdDate: '2025-10-29'
  }
];

let reviews = [
  {
    id: 1,
    requestId: 1001,
    customerName: 'Rajesh Kumar',
    rating: 5,
    reviewText: 'Excellent service! The mechanic arrived quickly and fixed my car in no time.',
    serviceType: 'Engine Failure',
    createdDate: '2025-10-28'
  },
  {
    id: 2,
    requestId: 1004,
    customerName: 'Sneha Reddy',
    rating: 4,
    reviewText: 'Good service, but took a bit longer than expected. Overall satisfied.',
    serviceType: 'Jump Start',
    createdDate: '2025-10-27'
  }
];

// Admin State
let isAdminLoggedIn = false;
let currentBillRequestId = null;
let selectedRating = 0;

// Auto-increment IDs
let nextRequestId = 1004;
let nextCustomerId = 4;
let nextStaffId = 203;
let nextBillId = 5003;
let nextReviewId = 3;

// Navigation Functions
function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show requested page
  const page = document.getElementById(pageName + '-page');
  if (page) {
    page.classList.add('active');
  }

  // Update navigation active states
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelectorAll('.admin-nav-link').forEach(link => {
    link.classList.remove('active');
  });

  const activeLink = document.querySelector(`[data-page="${pageName}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Initialize page-specific content
  if (pageName === 'home') {
    renderReviews();
  } else if (pageName === 'admin-dashboard') {
    renderAdminDashboard();
  } else if (pageName === 'admin-requests') {
    renderRequestsTable();
  } else if (pageName === 'admin-staff') {
    renderStaffTables();
  } else if (pageName === 'admin-bills') {
    renderBillsTable();
  }
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.remove('hidden');

  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

function showModal(content) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = content;
  modal.classList.remove('hidden');
}

function hideModal() {
  document.getElementById('modal').classList.add('hidden');
}

// Customer Side Functions
function renderReviews() {
  const reviewsGrid = document.getElementById('reviewsGrid');
  const avgRatingEl = document.getElementById('avgRating');
  const avgStarsEl = document.getElementById('avgStars');
  const ratingCountEl = document.getElementById('ratingCount');

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  avgRatingEl.textContent = avgRating;
  avgStarsEl.textContent = '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating));
  ratingCountEl.textContent = `Based on ${reviews.length} reviews`;

  // Render reviews
  reviewsGrid.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="review-header">
        <div>
          <div class="review-author">${review.customerName}</div>
          <div class="review-date">${review.createdDate}</div>
        </div>
        <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
      </div>
      <div class="review-service">${review.serviceType}</div>
      <p class="review-text">${review.reviewText}</p>
    </div>
  `).join('');
}

// Global map instance
let requestMap = null;
let requestMarker = null;
let accuracyCircle = null;

function initRequestMap() {
  // Initialize Leaflet map
  const defaultLat = 19.0760;
  const defaultLon = 72.8777;
  
  requestMap = L.map('requestMap').setView([defaultLat, defaultLon], 13);
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(requestMap);
  
  // Add draggable marker
  requestMarker = L.marker([defaultLat, defaultLon], {
    draggable: true
  }).addTo(requestMap);
  
  // Update coordinates on drag
  requestMarker.on('dragend', function(e) {
    const position = requestMarker.getLatLng();
    document.getElementById('latitude').value = position.lat.toFixed(6);
    document.getElementById('longitude').value = position.lng.toFixed(6);
  });
  
  // Set initial coordinates
  document.getElementById('latitude').value = defaultLat.toFixed(6);
  document.getElementById('longitude').value = defaultLon.toFixed(6);
  
  // Use Current Location button
  document.getElementById('useCurrentLocation').addEventListener('click', () => {
    if (navigator.geolocation) {
      showNotification('Detecting your location...', 'info');
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          // Move map and marker to user's location
          requestMap.setView([lat, lng], 16);
          requestMarker.setLatLng([lat, lng]);
          
          // Remove old accuracy circle if exists
          if (accuracyCircle) {
            requestMap.removeLayer(accuracyCircle);
          }
          
          // Add accuracy circle
          accuracyCircle = L.circle([lat, lng], {
            radius: accuracy,
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1
          }).addTo(requestMap);
          
          // Update coordinate inputs
          document.getElementById('latitude').value = lat.toFixed(6);
          document.getElementById('longitude').value = lng.toFixed(6);
          
          showNotification('Location detected successfully!', 'success');
        },
        function(error) {
          showNotification('Could not detect location. Please drag the marker manually.', 'error');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      showNotification('Geolocation is not supported by your browser.', 'error');
    }
  });
  
  // Invalidate size after map is displayed
  setTimeout(() => {
    requestMap.invalidateSize();
  }, 100);
}

function handleRequestHelpSubmit(e) {
  e.preventDefault();

  const customerName = document.getElementById('customerName').value;
  const customerPhone = document.getElementById('customerPhone').value;
  const customerEmail = document.getElementById('customerEmail').value;
  const vehicleType = document.getElementById('vehicleType').value;
  const vehicleNumber = document.getElementById('vehicleNumber').value;
  const problemType = document.getElementById('problemType').value;
  const description = document.getElementById('problemDescription').value;
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);

  // Create or find customer
  let customer = customers.find(c => c.email === customerEmail);
  if (!customer) {
    customer = {
      id: nextCustomerId++,
      name: customerName,
      phone: customerPhone,
      email: customerEmail
    };
    customers.push(customer);
  }

  // Create request
  const request = {
    id: nextRequestId++,
    customerId: customer.id,
    customerName: customerName,
    phone: customerPhone,
    vehicleType: vehicleType,
    vehicleNumber: vehicleNumber,
    problemType: problemType,
    description: description,
    latitude: latitude,
    longitude: longitude,
    status: 'Pending',
    assignedDriver: null,
    assignedMechanic: null,
    createdDate: new Date().toISOString().split('T')[0]
  };

  requests.push(request);

  showNotification(`Request submitted successfully! Your Request ID is: ${request.id}`, 'success');
  e.target.reset();
  document.getElementById('latitude').value = '19.0760';
  document.getElementById('longitude').value = '72.8777';
  setTimeout(() => showPage('home'), 2000);
}

function loadBill() {
  const requestId = parseInt(document.getElementById('billRequestId').value);
  const request = requests.find(r => r.id === requestId);

  if (!request) {
    showNotification('Request not found!', 'error');
    return;
  }

  if (request.status !== 'Completed') {
    showNotification('Service not completed yet. Cannot generate bill.', 'warning');
    return;
  }

  let bill = bills.find(b => b.requestId === requestId);

  if (!bill) {
    // Generate new bill
    const baseAmount = Math.floor(Math.random() * 3000) + 500;
    const additionalCharges = Math.floor(Math.random() * 500);
    const tax = Math.round((baseAmount + additionalCharges) * 0.18);
    const total = baseAmount + additionalCharges + tax;

    bill = {
      id: nextBillId++,
      requestId: requestId,
      customerName: request.customerName,
      serviceType: request.problemType,
      baseAmount: baseAmount,
      additionalCharges: additionalCharges,
      tax: tax,
      total: total,
      status: 'Unpaid',
      createdDate: new Date().toISOString().split('T')[0]
    };
    bills.push(bill);
  }

  currentBillRequestId = requestId;

  // Display bill
  document.getElementById('billId').textContent = requestId;
  document.getElementById('billCustomerName').textContent = bill.customerName;
  document.getElementById('billServiceType').textContent = bill.serviceType;
  document.getElementById('billDate').textContent = bill.createdDate;
  document.getElementById('billBaseAmount').textContent = '₹' + bill.baseAmount;
  document.getElementById('billAdditionalCharges').textContent = '₹' + bill.additionalCharges;
  document.getElementById('billTax').textContent = '₹' + bill.tax;
  document.getElementById('billTotal').textContent = '₹' + bill.total;

  document.getElementById('billSelection').classList.add('hidden');
  document.getElementById('billDetails').classList.remove('hidden');
}

function handlePayment(e) {
  e.preventDefault();

  const bill = bills.find(b => b.requestId === currentBillRequestId);
  if (bill) {
    bill.status = 'Paid';
  }

  showNotification('Payment successful!', 'success');
  document.getElementById('billDetails').classList.add('hidden');
  document.getElementById('reviewForm').classList.remove('hidden');
}

function handleReviewSubmit(e) {
  e.preventDefault();

  const request = requests.find(r => r.id === currentBillRequestId);
  const reviewText = document.getElementById('reviewText').value;

  const review = {
    id: nextReviewId++,
    requestId: currentBillRequestId,
    customerName: request.customerName,
    rating: selectedRating,
    reviewText: reviewText,
    serviceType: request.problemType,
    createdDate: new Date().toISOString().split('T')[0]
  };

  reviews.push(review);

  showNotification('Thank you for your review!', 'success');
  setTimeout(() => {
    showPage('home');
    document.getElementById('billSelection').classList.remove('hidden');
    document.getElementById('billDetails').classList.add('hidden');
    document.getElementById('reviewForm').classList.add('hidden');
    document.getElementById('billRequestId').value = '';
    document.getElementById('reviewText').value = '';
    selectedRating = 0;
  }, 2000);
}

// Admin Side Functions
function handleAdminLogin(e) {
  e.preventDefault();

  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;

  if (username === 'admin' && password === 'admin123') {
    isAdminLoggedIn = true;
    document.getElementById('customer-nav').classList.add('hidden');
    document.getElementById('admin-nav').classList.remove('hidden');
    showPage('admin-dashboard');
    showNotification('Login successful!', 'success');
  } else {
    showNotification('Invalid credentials!', 'error');
  }
}

function handleAdminLogout() {
  isAdminLoggedIn = false;
  document.getElementById('customer-nav').classList.remove('hidden');
  document.getElementById('admin-nav').classList.add('hidden');
  showPage('home');
  showNotification('Logged out successfully!', 'success');
}

function renderAdminDashboard() {
  // Update dashboard stats
  document.getElementById('totalRequests').textContent = requests.length;
  document.getElementById('completedRequests').textContent = requests.filter(r => r.status === 'Completed').length;
  document.getElementById('pendingRequests').textContent = requests.filter(r => r.status === 'Pending').length;
  document.getElementById('totalStaff').textContent = staff.length;
  document.getElementById('totalRevenue').textContent = '₹' + bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.total, 0);

  // Render recent requests
  const tbody = document.querySelector('#dashboardRequestsTable tbody');
  tbody.innerHTML = requests.slice(-5).reverse().map(request => `
    <tr>
      <td>${request.id}</td>
      <td>${request.customerName}</td>
      <td>${request.vehicleNumber}</td>
      <td>${request.problemType}</td>
      <td><span class="status-badge status-${request.status.toLowerCase().replace(' ', '-')}">${request.status}</span></td>
      <td>${request.createdDate}</td>
    </tr>
  `).join('');
}

function renderRequestsTable(filterStatus = 'All') {
  const filteredRequests = filterStatus === 'All'
    ? requests
    : requests.filter(r => r.status === filterStatus);

  const tbody = document.querySelector('#requestsTable tbody');
  tbody.innerHTML = filteredRequests.map(request => `
    <tr>
      <td>${request.id}</td>
      <td>${request.customerName}</td>
      <td>${request.phone}</td>
      <td>${request.vehicleNumber}</td>
      <td>${request.problemType}</td>
      <td>${request.latitude.toFixed(4)}, ${request.longitude.toFixed(4)}</td>
      <td><span class="status-badge status-${request.status.toLowerCase().replace(' ', '-')}">${request.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn--sm btn--outline" onclick="viewRequestDetails(${request.id})">View</button>
          ${request.status === 'Pending' ? `<button class="btn btn--sm btn--primary" onclick="acceptRequest(${request.id})">Accept</button>` : ''}
          ${request.status === 'Accepted' || request.status === 'Pending' ? `<button class="btn btn--sm btn--secondary" onclick="assignStaff(${request.id})">Assign</button>` : ''}
          ${request.status === 'In Progress' ? `<button class="btn btn--sm btn--primary" onclick="completeRequest(${request.id})">Complete</button>` : ''}
          ${request.status !== 'Completed' && request.status !== 'Cancelled' ? `<button class="btn btn--sm" style="background: var(--color-error); color: white;" onclick="cancelRequest(${request.id})">Cancel</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function viewRequestDetails(requestId) {
  const request = requests.find(r => r.id === requestId);
  const content = `
    <h3>Request Details</h3>
    <div class="bill-info">
      <div class="bill-row"><span>Request ID:</span><span>${request.id}</span></div>
      <div class="bill-row"><span>Customer:</span><span>${request.customerName}</span></div>
      <div class="bill-row"><span>Phone:</span><span>${request.phone}</span></div>
      <div class="bill-row"><span>Vehicle:</span><span>${request.vehicleType} - ${request.vehicleNumber}</span></div>
      <div class="bill-row"><span>Problem:</span><span>${request.problemType}</span></div>
      <div class="bill-row"><span>Description:</span><span>${request.description}</span></div>
      <div class="bill-row"><span>Location:</span><span>${request.latitude.toFixed(4)}, ${request.longitude.toFixed(4)}</span></div>
      <div class="bill-row"><span>Status:</span><span class="status-badge status-${request.status.toLowerCase().replace(' ', '-')}">${request.status}</span></div>
      <div class="bill-row"><span>Assigned Driver:</span><span>${request.assignedDriver || 'Not assigned'}</span></div>
      <div class="bill-row"><span>Assigned Mechanic:</span><span>${request.assignedMechanic || 'Not assigned'}</span></div>
      <div class="bill-row"><span>Created Date:</span><span>${request.createdDate}</span></div>
    </div>
    <div style="margin-top: 16px;">
      <h4>Location on Map</h4>
      <div class="map" style="height: 200px; position: relative;">
        <div class="map-grid"></div>
        <div class="map-marker" style="left: 50%; top: 50%; position: absolute; transform: translate(-50%, -100%);">📍</div>
      </div>
    </div>
  `;
  showModal(content);
}

function acceptRequest(requestId) {
  const request = requests.find(r => r.id === requestId);
  if (request) {
    request.status = 'Accepted';
    renderRequestsTable();
    showNotification('Request accepted!', 'success');
  }
}

function assignStaff(requestId) {
  const request = requests.find(r => r.id === requestId);
  const drivers = staff.filter(s => s.type === 'Driver');
  const mechanics = staff.filter(s => s.type === 'Mechanic');

  const content = `
    <h3>Assign Staff</h3>
    <form id="assignStaffForm">
      <div class="form-group">
        <label class="form-label">Select Driver</label>
        <select class="form-control" id="assignDriver">
          <option value="">No driver</option>
          ${drivers.map(d => `<option value="${d.name}" ${!d.available ? 'disabled' : ''}>${d.name} ${!d.available ? '(Unavailable)' : ''}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Select Mechanic</label>
        <select class="form-control" id="assignMechanic">
          <option value="">No mechanic</option>
          ${mechanics.map(m => `<option value="${m.name}" ${!m.available ? 'disabled' : ''}>${m.name} ${!m.available ? '(Unavailable)' : ''}</option>`).join('')}
        </select>
      </div>
      <button type="button" class="btn btn--primary btn--full-width" onclick="confirmAssignment(${requestId})">Assign</button>
    </form>
  `;
  showModal(content);
}

function confirmAssignment(requestId) {
  const request = requests.find(r => r.id === requestId);
  const driverName = document.getElementById('assignDriver').value;
  const mechanicName = document.getElementById('assignMechanic').value;

  if (driverName) {
    request.assignedDriver = driverName;
    const driver = staff.find(s => s.name === driverName);
    if (driver) driver.available = false;
  }

  if (mechanicName) {
    request.assignedMechanic = mechanicName;
    const mechanic = staff.find(s => s.name === mechanicName);
    if (mechanic) mechanic.available = false;
  }

  if (driverName || mechanicName) {
    request.status = 'In Progress';
  }

  hideModal();
  renderRequestsTable();
  showNotification('Staff assigned successfully!', 'success');
}

function completeRequest(requestId) {
  const request = requests.find(r => r.id === requestId);
  if (request) {
    request.status = 'Completed';

    // Free up staff
    if (request.assignedDriver) {
      const driver = staff.find(s => s.name === request.assignedDriver);
      if (driver) driver.available = true;
    }
    if (request.assignedMechanic) {
      const mechanic = staff.find(s => s.name === request.assignedMechanic);
      if (mechanic) mechanic.available = true;
    }

    // Auto-generate bill
    const baseAmount = Math.floor(Math.random() * 3000) + 500;
    const additionalCharges = Math.floor(Math.random() * 500);
    const tax = Math.round((baseAmount + additionalCharges) * 0.18);
    const total = baseAmount + additionalCharges + tax;

    const bill = {
      id: nextBillId++,
      requestId: requestId,
      customerName: request.customerName,
      serviceType: request.problemType,
      baseAmount: baseAmount,
      additionalCharges: additionalCharges,
      tax: tax,
      total: total,
      status: 'Unpaid',
      createdDate: new Date().toISOString().split('T')[0]
    };
    bills.push(bill);

    renderRequestsTable();
    showNotification('Request completed and bill generated!', 'success');
  }
}

function cancelRequest(requestId) {
  const request = requests.find(r => r.id === requestId);
  if (request) {
    request.status = 'Cancelled';

    // Free up staff
    if (request.assignedDriver) {
      const driver = staff.find(s => s.name === request.assignedDriver);
      if (driver) driver.available = true;
    }
    if (request.assignedMechanic) {
      const mechanic = staff.find(s => s.name === request.assignedMechanic);
      if (mechanic) mechanic.available = true;
    }

    renderRequestsTable();
    showNotification('Request cancelled!', 'warning');
  }
}

function renderStaffTables() {
  const drivers = staff.filter(s => s.type === 'Driver');
  const mechanics = staff.filter(s => s.type === 'Mechanic');

  // Render drivers
  const driversTbody = document.querySelector('#driversTable tbody');
  driversTbody.innerHTML = drivers.map(driver => `
    <tr>
      <td>${driver.id}</td>
      <td>${driver.name}</td>
      <td>${driver.phone}</td>
      <td>${driver.email}</td>
      <td><span class="status-badge status-${driver.available ? 'available' : 'unavailable'}">${driver.available ? 'Available' : 'Unavailable'}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn--sm btn--secondary" onclick="toggleAvailability(${driver.id})">${driver.available ? 'Mark Unavailable' : 'Mark Available'}</button>
          <button class="btn btn--sm" style="background: var(--color-error); color: white;" onclick="removeStaff(${driver.id})">Remove</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Render mechanics
  const mechanicsTbody = document.querySelector('#mechanicsTable tbody');
  mechanicsTbody.innerHTML = mechanics.map(mechanic => `
    <tr>
      <td>${mechanic.id}</td>
      <td>${mechanic.name}</td>
      <td>${mechanic.phone}</td>
      <td>${mechanic.email}</td>
      <td><span class="status-badge status-${mechanic.available ? 'available' : 'unavailable'}">${mechanic.available ? 'Available' : 'Unavailable'}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn--sm btn--secondary" onclick="toggleAvailability(${mechanic.id})">${mechanic.available ? 'Mark Unavailable' : 'Mark Available'}</button>
          <button class="btn btn--sm" style="background: var(--color-error); color: white;" onclick="removeStaff(${mechanic.id})">Remove</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function showAddStaffModal() {
  const content = `
    <h3>Add Staff Member</h3>
    <form id="addStaffForm">
      <div class="form-group">
        <label class="form-label">Name *</label>
        <input type="text" class="form-control" id="staffName" required>
      </div>
      <div class="form-group">
        <label class="form-label">Phone Number *</label>
        <input type="tel" class="form-control" id="staffPhone" required>
      </div>
      <div class="form-group">
        <label class="form-label">Email *</label>
        <input type="email" class="form-control" id="staffEmail" required>
      </div>
      <div class="form-group">
        <label class="form-label">Type *</label>
        <select class="form-control" id="staffType" required>
          <option value="">Select type</option>
          <option value="Driver">Driver</option>
          <option value="Mechanic">Mechanic</option>
        </select>
      </div>
      <button type="button" class="btn btn--primary btn--full-width" onclick="addStaff()">Add Staff</button>
    </form>
  `;
  showModal(content);
}

function addStaff() {
  const name = document.getElementById('staffName').value;
  const phone = document.getElementById('staffPhone').value;
  const email = document.getElementById('staffEmail').value;
  const type = document.getElementById('staffType').value;

  if (!name || !phone || !email || !type) {
    showNotification('Please fill all fields!', 'error');
    return;
  }

  const newStaff = {
    id: nextStaffId++,
    name: name,
    phone: phone,
    email: email,
    type: type,
    available: true
  };

  staff.push(newStaff);
  hideModal();
  renderStaffTables();
  showNotification('Staff member added successfully!', 'success');
}

function toggleAvailability(staffId) {
  const member = staff.find(s => s.id === staffId);
  if (member) {
    member.available = !member.available;
    renderStaffTables();
    showNotification('Availability updated!', 'success');
  }
}

function removeStaff(staffId) {
  const index = staff.findIndex(s => s.id === staffId);
  if (index !== -1) {
    staff.splice(index, 1);
    renderStaffTables();
    showNotification('Staff member removed!', 'success');
  }
}

function renderBillsTable() {
  const tbody = document.querySelector('#billsTable tbody');
  tbody.innerHTML = bills.map(bill => `
    <tr>
      <td>${bill.id}</td>
      <td>${bill.requestId}</td>
      <td>${bill.customerName}</td>
      <td>${bill.serviceType}</td>
      <td>₹${bill.total}</td>
      <td>${bill.createdDate}</td>
      <td><span class="status-badge status-${bill.status.toLowerCase()}">${bill.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn--sm btn--outline" onclick="viewBillDetails(${bill.id})">View</button>
          <button class="btn btn--sm btn--secondary" onclick="downloadBill(${bill.id})">Download</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function viewBillDetails(billId) {
  const bill = bills.find(b => b.id === billId);
  const content = `
    <h3>Bill Details</h3>
    <div class="bill-info">
      <div class="bill-row"><span>Bill ID:</span><span>${bill.id}</span></div>
      <div class="bill-row"><span>Request ID:</span><span>${bill.requestId}</span></div>
      <div class="bill-row"><span>Customer Name:</span><span>${bill.customerName}</span></div>
      <div class="bill-row"><span>Service Type:</span><span>${bill.serviceType}</span></div>
      <div class="bill-row"><span>Base Amount:</span><span>₹${bill.baseAmount}</span></div>
      <div class="bill-row"><span>Additional Charges:</span><span>₹${bill.additionalCharges}</span></div>
      <div class="bill-row"><span>Tax (18% GST):</span><span>₹${bill.tax}</span></div>
      <div class="bill-row total"><span>Total Amount:</span><span>₹${bill.total}</span></div>
      <div class="bill-row"><span>Status:</span><span class="status-badge status-${bill.status.toLowerCase()}">${bill.status}</span></div>
      <div class="bill-row"><span>Created Date:</span><span>${bill.createdDate}</span></div>
    </div>
  `;
  showModal(content);
}

function downloadBill(billId) {
  showNotification('Bill download started!', 'success');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Customer Navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page) {
        showPage(page);
      }
    });
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Hero button
  document.getElementById('heroRequestBtn').addEventListener('click', () => {
    showPage('request-help');
  });

  // Admin login link
  document.getElementById('adminLoginLink').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('admin-login');
  });

  // Admin login form
  document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);

  // Admin logout
  document.getElementById('adminLogout').addEventListener('click', (e) => {
    e.preventDefault();
    handleAdminLogout();
  });

  // Admin navigation
  document.querySelectorAll('.admin-nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.id !== 'adminLogout') {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        if (page) {
          showPage(page);
        }
      }
    });
  });

  // Admin nav toggle (mobile)
  const adminNavToggle = document.getElementById('adminNavToggle');
  const adminNav = document.getElementById('admin-nav');
  if (adminNavToggle) {
    adminNavToggle.addEventListener('click', () => {
      adminNav.classList.toggle('active');
    });
  }

  // Request help form
  const requestForm = document.getElementById('requestHelpForm');
  if (requestForm) {
    requestForm.addEventListener('submit', handleRequestHelpSubmit);
    initRequestMap();
  }

  // Pay bill
  document.getElementById('loadBillBtn').addEventListener('click', loadBill);
  document.getElementById('paymentForm').addEventListener('submit', handlePayment);
  document.getElementById('submitReviewForm').addEventListener('submit', handleReviewSubmit);

  // Star rating
  document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-rating'));
      document.getElementById('reviewRating').value = selectedRating;
      document.querySelectorAll('.star').forEach((s, index) => {
        if (index < selectedRating) {
          s.textContent = '★';
          s.classList.add('active');
        } else {
          s.textContent = '☆';
          s.classList.remove('active');
        }
      });
    });
  });

  // Request filter
  document.getElementById('requestStatusFilter').addEventListener('change', (e) => {
    renderRequestsTable(e.target.value);
  });

  // Staff tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    });
  });

  // Add staff button
  document.getElementById('addStaffBtn').addEventListener('click', showAddStaffModal);

  // Modal close
  document.getElementById('modalClose').addEventListener('click', hideModal);

  // Close modal on outside click
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
      hideModal();
    }
  });

  // Footer links
  document.querySelectorAll('.footer a').forEach(link => {
    link.addEventListener('click', (e) => {
      const page = link.getAttribute('data-page');
      if (page) {
        e.preventDefault();
        showPage(page);
      }
    });
  });

  // Initialize home page
  showPage('home');
});