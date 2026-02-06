// Data storage (localStorage)
let listings = JSON.parse(localStorage.getItem('donationListings')) || [];
let requests = JSON.parse(localStorage.getItem('itemRequests')) || [];

// Show/hide sections
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (sectionId === 'donationListings') loadListings();
    if (sectionId === 'itemRequests') loadRequests();
}

// Handle donation form
document.getElementById('donateForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const listing = {
        id: 'DON-' + Date.now().toString().slice(-6),
        name: document.getElementById('donorName').value,
        phone: document.getElementById('donorPhone').value,
        type: document.getElementById('itemType').value,
        details: document.getElementById('itemDetails').value,
        location: document.getElementById('location').value,
        photo: document.getElementById('itemPhoto').files[0] ? URL.createObjectURL(document.getElementById('itemPhoto').files[0]) : '',
        timestamp: new Date().toLocaleString()
    };
    
    listings.unshift(listing);
    localStorage.setItem('donationListings', JSON.stringify(listings));
    
    alert('✅ Listing posted successfully!\nID: ' + listing.id + '\nPeople will contact you soon.');
    this.reset();
    showSection('donationListings');
});

// Handle request form
document.getElementById('requestForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const request = {
        id: 'REQ-' + Date.now().toString().slice(-6),
        name: document.getElementById('reqName').value,
       
        type: document.getElementById('reqType').value,
        details: document.getElementById('reqDetails').value,
        timestamp: new Date().toLocaleString()
    };
    
    requests.unshift(request);
    localStorage.setItem('itemRequests', JSON.stringify(requests));
    
    alert('✅ Request submitted successfully!\nID: ' + request.id + '\nDonors will contact you soon.');
    this.reset();
    showSection('itemRequests');
});

// Load donation listings
function loadListings() {
    const container = document.getElementById('listingsContainer');
    container.innerHTML = '';
    
    listings.forEach((listing, index) => {
        const card = document.createElement('div');
        card.className = 'listing-card';
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteListing(${index})">🗑️</button>
            <div class="listing-id">${listing.id}</div>
            <img src="${listing.photo || 'https://via.placeholder.com/300x200?text=Item+Photo'}" alt="${listing.type}">
            <h3>${listing.type}</h3>
            <p><strong>Details:</strong> ${listing.details}</p>
            <p><strong>Location:</strong> ${listing.location}</p>
            <p><em>Posted: ${listing.timestamp}</em></p>
            <button class="contact-btn" onclick="requestContact('${listing.id}')">Contact Donor</button>
        `;
        container.appendChild(card);
    });
}

// Load item requests
function loadRequests() {
    const container = document.getElementById('requestsContainer');
    container.innerHTML = '';
    
    requests.forEach((request, index) => {
        const card = document.createElement('div');
        card.className = 'request-card';
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteRequest(${index})">🗑️</button>
            <div class="request-id">${request.id}</div>
            <img src="https://via.placeholder.com/300x200?text=${request.type}" alt="${request.type}">
            <h3>${request.type}</h3>
            <p><strong>Details:</strong> ${request.details}</p>
            <p><strong>Phone:</strong> ${request.phone}</p>
            <p><em>Posted: ${request.timestamp}</em></p>
            <button class="contact-btn" onclick="contactRequester('${request.id}')">Contact Requester</button>
        `;
        container.appendChild(card);
    });
}

// Delete listing
function deleteListing(index) {
    if (confirm('Are you sure you want to delete this listing?')) {
        listings.splice(index, 1);
        localStorage.setItem('donationListings', JSON.stringify(listings));
        loadListings();
    }
}

// Delete request
function deleteRequest(index) {
    if (confirm('Are you sure you want to delete this request?')) {
        requests.splice(index, 1);
        localStorage.setItem('itemRequests', JSON.stringify(requests));
        loadRequests();
    }
}

// Contact functions
function requestContact(listingId) {
    const phone = prompt('Enter your phone number for verification (10 digits):');
    if (phone && phone.length === 10 && /^\d{10}$/.test(phone)) {
        const listing = listings.find(l => l.id === listingId);
        if (listing) {
            alert(`✅ Request sent to donor!\nThey will approve and share contact details.\nListing ID: ${listingId}\nExpect response within 24 hours.`);
        }
    } else {
        alert('❌ Please enter valid 10-digit phone number for verification.');
    }
}

function contactRequester(requestId) {
    const phone = prompt('Enter your phone number for verification (10 digits):');
    if (phone && phone.length === 10 && /^\d{10}$/.test(phone)) {
        const request = requests.find(r => r.id === requestId);
        if (request) {
            alert(`✅ Contact request sent!\nRequester will respond soon.\nRequest ID: ${requestId}`);
        }
    } else {
        alert('❌ Please enter valid 10-digit phone number for verification.');
    }
}

// Initialize
window.onload = () => showSection('home');
