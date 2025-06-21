// Authentication state
let currentDoctor = null;

// Mock data for doctor's working locations
// In a real application, this would come from a backend database
let doctorLocations = [
    {
        id: 1,
        name: "City General Hospital",
        address: "123 Health Ave, Bengaluru, 560001",
        timings: [
            "Monday - Friday: 09:00 AM - 01:00 PM",
            "Saturday: 10:00 AM - 12:00 PM"
        ]
    },
    {
        id: 2,
        name: "CareWell Clinic",
        address: "456 Clinic Rd, Jayanagar, Bengaluru, 560041",
        timings: [
            "Monday - Friday: 02:00 PM - 06:00 PM"
        ]
    }
];

// DOM elements
const authSection = document.getElementById('authSection');
const mainDashboard = document.getElementById('mainDashboard');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const logoutButton = document.getElementById('logoutButton');
const doctorNameElement = document.getElementById('doctorName');
const doctorSpecialtyElement = document.getElementById('doctorSpecialty');
const doctorEmailElement = document.getElementById('doctorEmail');

// New DOM elements for locations section
const addLocationButton = document.querySelector('.working-locations-section .action-button.primary');
const locationsListContainer = document.querySelector('.locations-list'); // The container for location cards


// Authentication event listeners
showRegisterBtn.addEventListener('click', () => {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
});

showLoginBtn.addEventListener('click', () => {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
});

loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation (in real app, this would connect to backend)
    if (email && password) {
        // Simulate successful login
        currentDoctor = {
            name: 'Dr. Smitha',
            email: email,
            specialty: 'Cardiology',
            license: 'MD-2024-001'
        };
        showDashboard();
    } else {
        alert('Please enter valid credentials');
    }
});

registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const specialty = document.getElementById('registerSpecialty').value;
    const license = document.getElementById('registerLicense').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate form
    if (!name || !email || !phone || !specialty || !license || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Simulate successful registration
    currentDoctor = {
        name: name,
        email: email,
        specialty: specialty,
        license: license
    };
    showDashboard();
});

logoutButton.addEventListener('click', () => {
    currentDoctor = null;
    showAuth();
    // Clear forms
    loginFormElement.reset();
    registerFormElement.reset();
});

function showAuth() {
    authSection.style.display = 'flex';
    mainDashboard.style.display = 'none';
}

function showDashboard() {
    authSection.style.display = 'none';
    mainDashboard.style.display = 'block';
    
    // Update doctor info if user is logged in
    if (currentDoctor) {
        doctorNameElement.textContent = currentDoctor.name;
        doctorSpecialtyElement.textContent = currentDoctor.specialty + ' Specialist';
        doctorEmailElement.textContent = currentDoctor.email;
    }
    
    // Initialize dashboard content
    initializeDashboard();
}

function initializeDashboard() {
    // Mock data for today's schedule
    const todaysSchedule = [
        {
            id: 1,
            time: "09:00 AM",
            duration: "30 min",
            patient: "Mega",
            patientId: "PT-2024-001",
            type: "Follow-up",
            status: "confirmed",
            condition: "Hypertension check",
            notes: "Regular blood pressure monitoring"
        },
        {
            id: 2,
            time: "09:30 AM",
            duration: "45 min",
            patient: "Punith",
            patientId: "PT-2024-047",
            type: "Consultation",
            status: "confirmed",
            condition: "Chest pain evaluation",
            notes: "New patient, requires ECG"
        },
        {
            id: 3,
            time: "10:15 AM",
            duration: "30 min",
            patient: "Rahul",
            patientId: "PT-2024-089",
            type: "Follow-up",
            status: "confirmed",
            condition: "Post-surgery check",
            notes: "Cardiac catheterization follow-up"
        },
        {
            id: 4,
            time: "11:00 AM",
            duration: "30 min",
            patient: "Perry",
            patientId: "PT-2024-156",
            type: "Checkup",
            status: "pending",
            condition: "Annual cardiac screening",
            notes: "Routine preventive care"
        },
        {
            id: 5,
            time: "02:00 PM",
            duration: "45 min",
            patient: "Smrithi",
            patientId: "PT-2024-203",
            type: "Consultation",
            status: "confirmed",
            condition: "Arrhythmia evaluation",
            notes: "Palpitations and irregular heartbeat"
        },
        {
            id: 6,
            time: "02:45 PM",
            duration: "30 min",
            patient: "rajath",
            patientId: "PT-2024-178",
            type: "Follow-up",
            status: "confirmed",
            condition: "Medication adjustment",
            notes: "Blood pressure medication review"
        },
        {
            id: 7,
            time: "03:30 PM",
            duration: "30 min",
            patient: "Jithesh",
            patientId: "PT-2024-234",
            type: "Follow-up",
            status: "confirmed",
            condition: "Cholesterol management",
            notes: "Lab results review"
        },
        {
            id: 8,
            time: "04:15 PM",
            duration: "45 min",
            patient: "Swasthik",
            patientId: "PT-2024-267",
            type: "Consultation",
            status: "pending",
            condition: "Heart murmur evaluation",
            notes: "Referral from primary care"
        }
    ];

    // Mock data for patient reports
    const patientReports = [
        {
            id: 1,
            patient: "Mega",
            patientId: "PT-2024-001",
            lastVisit: "2024-06-15",
            condition: "Hypertension",
            urgency: "medium",
            summary: "Blood pressure remains elevated despite medication. Consider dosage adjustment.",
            nextAction: "Schedule follow-up in 2 weeks"
        },
        {
            id: 2,
            patient: "Punith",
            patientId: "PT-2024-047",
            lastVisit: "2024-06-18",
            condition: "Chest Pain",
            urgency: "high",
            summary: "ECG shows minor abnormalities. Stress test recommended.",
            nextAction: "Schedule stress test immediately"
        },
        {
            id: 3,
            patient: "Rahul",
            patientId: "PT-2024-089",
            lastVisit: "2024-06-12",
            condition: "Post Cardiac Surgery",
            urgency: "low",
            summary: "Recovery progressing well. Incision sites healing properly.",
            nextAction: "Continue current care plan"
        },
        {
            id: 4,
            patient: "Perry",
            patientId: "PT-2024-156",
            lastVisit: "2024-06-10",
            condition: "Preventive Care",
            urgency: "low",
            summary: "Annual screening complete. All results within normal range.",
            nextAction: "Schedule next annual checkup"
        },
        {
            id: 5,
            patient: "Smrithi",
            patientId: "PT-2024-203",
            lastVisit: "2024-06-16",
            condition: "Arrhythmia",
            urgency: "high",
            summary: "Holter monitor shows frequent PVCs. Medication trial recommended.",
            nextAction: "Start antiarrhythmic therapy"
        },
        {
            id: 6,
            patient: "Rajath",
            patientId: "PT-2024-178",
            lastVisit: "2024-06-14",
            condition: "Hypertension",
            urgency: "medium",
            summary: "Good response to current medication. BP trending downward.",
            nextAction: "Continue current regimen"
        },
        {
            id: 7,
            patient: "Jithesh",
            patientId: "PT-2024-234",
            lastVisit: "2024-06-13",
            condition: "High Cholesterol",
            urgency: "medium",
            summary: "LDL levels improved but still above target. Lifestyle counseling needed.",
            nextAction: "Nutrition consultation referral"
        },
        {
            id: 8,
            patient: "Swasthik",
            patientId: "PT-2024-267",
            lastVisit: "2024-06-17",
            condition: "Heart Murmur",
            urgency: "medium",
            summary: "Innocent murmur confirmed. No intervention required.",
            nextAction: "Reassure patient, routine follow-up"
        }
    ];

    // Render schedule and patient reports
    renderSchedule(todaysSchedule);
    renderPatientReports(patientReports);
    
    // Render working locations
    renderLocations(doctorLocations); // <-- New call

    // Set up search functionality
    setupSearch(todaysSchedule, patientReports);
    
    // Set up tab functionality
    setupTabs();
    
    // Update stats
    updateStats(todaysSchedule, patientReports);
}

// --- New Functions for Locations Management ---

function renderLocations(locations) {
    locationsListContainer.innerHTML = ''; // Clear existing content

    if (locations.length === 0) {
        locationsListContainer.innerHTML = '<p class="no-data-message">No working locations added yet. Click "Add New Location" to get started!</p>';
        return;
    }

    locations.forEach(location => {
        const timingsHtml = location.timings.map(time => `
            <li><i class="fas fa-calendar-day"></i> ${time}</li>
        `).join('');

        const locationCardHtml = `
            <div class="location-card" data-id="${location.id}">
                <div class="location-header">
                    <h3>${location.name}</h3>
                    <div class="location-actions">
                        <button class="action-button edit-location-btn" data-id="${location.id}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="action-button logout-button delete-location-btn" data-id="${location.id}"><i class="fas fa-trash-alt"></i> Delete</button>
                    </div>
                </div>
                <p class="location-address"><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
                <h4>Timings:</h4>
                <ul class="timings-list">
                    ${timingsHtml}
                </ul>
            </div>
        `;
        locationsListContainer.insertAdjacentHTML('beforeend', locationCardHtml);
    });

    // Attach event listeners for edit and delete buttons after rendering
    attachLocationButtonListeners();
}

function attachLocationButtonListeners() {
    document.querySelectorAll('.edit-location-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const locationId = parseInt(e.currentTarget.dataset.id);
            handleEditLocation(locationId);
        });
    });

    document.querySelectorAll('.delete-location-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const locationId = parseInt(e.currentTarget.dataset.id);
            handleDeleteLocation(locationId);
        });
    });
}

function handleAddLocation() {
    // In a real app, this would open a modal/form for input
    // For now, let's add a dummy location
    const newLocation = {
        id: doctorLocations.length > 0 ? Math.max(...doctorLocations.map(loc => loc.id)) + 1 : 1,
        name: `New Clinic ${Date.now().toString().slice(-4)}`, // Unique name
        address: "New Street, Bengaluru, India",
        timings: [
            "Monday - Wednesday: 09:00 AM - 12:00 PM",
            "Thursday: 01:00 PM - 05:00 PM"
        ]
    };
    doctorLocations.push(newLocation);
    renderLocations(doctorLocations);
    alert(`Added new location: ${newLocation.name}`);
}

function handleEditLocation(id) {
    // In a real app, you'd fetch the location by ID, populate a form,
    // allow editing, and then update the data and re-render.
    const locationToEdit = doctorLocations.find(loc => loc.id === id);
    if (locationToEdit) {
        alert(`Editing location: ${locationToEdit.name}\n(ID: ${id}) - In a real app, this would open an edit form.`);
        // Example: Change one timing to show an effect
        if (locationToEdit.timings.length > 0) {
            locationToEdit.timings[0] = "Daily: 09:00 AM - 05:00 PM (Updated)";
        }
        renderLocations(doctorLocations); // Re-render to show changes
    }
}

function handleDeleteLocation(id) {
    if (confirm('Are you sure you want to delete this location?')) {
        doctorLocations = doctorLocations.filter(loc => loc.id !== id);
        renderLocations(doctorLocations);
        alert('Location deleted successfully!');
    }
}

// --- Existing Functions (unchanged for Schedule/Reports/Search/Tabs/Stats) ---

function renderSchedule(schedule) {
    const scheduleList = document.getElementById('scheduleList');
    const scheduleCount = document.getElementById('scheduleCount');
    
    scheduleCount.textContent = `${schedule.length} appointments`;
    
    scheduleList.innerHTML = schedule.map(appointment => `
        <div class="card">
            <div class="schedule-header">
                <div>
                    <div class="appointment-time">
                        <i class="fas fa-clock"></i>
                        <span class="time">${appointment.time}</span>
                    </div>
                    <div class="appointment-duration">
                        <i class="fas fa-hourglass-half"></i>
                        <span>${appointment.duration}</span>
                    </div>
                </div>
                <div class="appointment-badges">
                    <span class="status-badge ${appointment.status}">${appointment.status}</span>
                    <span class="type-badge ${appointment.type.toLowerCase().replace('-', '')}">${appointment.type}</span>
                </div>
            </div>
            
            <div class="patient-info">
                <div class="patient-detail">
                    <i class="fas fa-user"></i>
                    <div>
                        <span class="label">${appointment.patient}</span>
                        <div class="value">${appointment.patientId}</div>
                    </div>
                </div>
                <div class="patient-detail">
                    <i class="fas fa-stethoscope"></i>
                    <div>
                        <span class="label">Condition</span>
                        <div class="value">${appointment.condition}</div>
                    </div>
                </div>
            </div>
            
            <div class="appointment-notes">
                <div class="notes-header">
                    <i class="fas fa-file-text"></i>
                    <span class="notes-title">Notes:</span>
                </div>
                <div class="notes-content">${appointment.notes}</div>
            </div>
            
            <div class="action-buttons">
                <button class="action-button primary">
                    <i class="fas fa-play"></i>
                    Start Appointment
                </button>
                <button class="action-button">
                    <i class="fas fa-phone"></i>
                    Call Patient
                </button>
            </div>
        </div>
    `).join('');
}

function renderPatientReports(reports) {
    const patientsList = document.getElementById('patientsList');
    const patientsCount = document.getElementById('patientsCount');
    
    patientsCount.textContent = `${reports.length} reports`;
    
    patientsList.innerHTML = reports.map(report => `
        <div class="card">
            <div class="patient-header">
                <div class="patient-name-section">
                    <div class="patient-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div class="patient-name">${report.patient}</div>
                        <div class="patient-id">${report.patientId}</div>
                    </div>
                </div>
                <span class="urgency-badge ${report.urgency}">${report.urgency.toUpperCase()}</span>
            </div>
            
            <div class="patient-info">
                <div class="patient-detail">
                    <i class="fas fa-calendar"></i>
                    <div>
                        <span class="label">Last Visit</span>
                        <div class="value">${formatDate(report.lastVisit)}</div>
                    </div>
                </div>
                <div class="patient-detail">
                    <i class="fas fa-heartbeat"></i>
                    <div>
                        <span class="label">Condition</span>
                        <div class="value">${report.condition}</div>
                    </div>
                </div>
            </div>
            
            <div class="report-summary">
                <p><strong>Summary:</strong> ${report.summary}</p>
                <p><strong>Next Action:</strong> ${report.nextAction}</p>
            </div>
            
            <div class="action-buttons">
                <button class="action-button primary">
                    <i class="fas fa-edit"></i>
                    Update Report
                </button>
                <button class="action-button">
                    <i class="fas fa-eye"></i>
                    View History
                </button>
                <button class="action-button">
                    <i class="fas fa-phone"></i>
                    Contact
                </button>
            </div>
        </div>
    `).join('');
}

function setupSearch(schedule, reports) {
    const searchInput = document.getElementById('searchInput');
    const originalSchedule = [...schedule];
    const originalReports = [...reports];
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredSchedule = originalSchedule.filter(appointment =>
            appointment.patient.toLowerCase().includes(searchTerm) ||
            appointment.condition.toLowerCase().includes(searchTerm) ||
            appointment.type.toLowerCase().includes(searchTerm)
        );
        
        const filteredReports = originalReports.filter(report =>
            report.patient.toLowerCase().includes(searchTerm) ||
            report.condition.toLowerCase().includes(searchTerm) ||
            report.patientId.toLowerCase().includes(searchTerm)
        );
        
        renderSchedule(filteredSchedule);
        renderPatientReports(filteredReports);
        // No search for locations implemented here, but could be added similarly
    });
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

function updateStats(schedule, reports) {
    document.getElementById('todayAppointments').textContent = schedule.length;
    document.getElementById('totalPatients').textContent = reports.length;
    document.getElementById('pendingReports').textContent = reports.filter(r => r.urgency === 'high').length;
    document.getElementById('upcomingAppointments').textContent = '12'; // Mock weekly data
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Show authentication by default
    showAuth();

    // Attach event listener for Add New Location button
    addLocationButton.addEventListener('click', handleAddLocation);
});