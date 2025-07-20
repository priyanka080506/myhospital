// Patient Dashboard JavaScript

let appointments = [];
let reports = [];
let doctors = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'patient') {
        window.location.href = 'patient-login.html';
        return;
    }
    
    loadDashboardData();
    loadUserProfile();  // Moved this up since profile is now first
    populateDoctorDropdown();
    populatePatientSelect();
    initializeDateInputs();
    loadDoctorsForSearch();
});

// Load user profile - moved to top since profile section is first
function loadUserProfile() {
    const currentUser = getCurrentUser();
    const userData = currentUser.data;
    
    document.getElementById('welcome-message').textContent = 
        `Welcome back, ${userData.firstName}! How are you feeling today?`;
    
    // Update profile section
    document.getElementById('profile-name').textContent = 
        `${userData.firstName} ${userData.lastName}`;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-phone').textContent = userData.phone || '-';
    document.getElementById('profile-dob').textContent = userData.dateOfBirth || '-';
    document.getElementById('profile-gender').textContent = userData.gender || '-';
    document.getElementById('profile-blood-group').textContent = userData.bloodGroup || '-';
    document.getElementById('profile-weight').textContent = userData.weight || '-';
    document.getElementById('profile-height').textContent = userData.height || '-';
    document.getElementById('profile-address').textContent = userData.address || '-';
    
    // Calculate BMI
    if (userData.weight && userData.height) {
        const bmi = (userData.weight / Math.pow(userData.height / 100, 2)).toFixed(1);
        document.getElementById('profile-bmi').textContent = bmi;
    }
    
    // Update profile picture
    if (userData.profilePicture) {
        document.getElementById('profile-picture').src = userData.profilePicture;
    }
}

// Load dashboard data
function loadDashboardData() {
    // Load appointments from localStorage
    const storedAppointments = localStorage.getItem('patient_appointments');
    if (storedAppointments) {
        appointments = JSON.parse(storedAppointments);
    }
    
    // Load reports from localStorage
    const storedReports = localStorage.getItem('patient_reports');
    if (storedReports) {
        reports = JSON.parse(storedReports);
    }
    
    // Load doctors
    doctors = getAllDoctors();
    
    updateDashboardStats();
    loadAppointments();
    loadReports();
}

// Update dashboard statistics
function updateDashboardStats() {
    document.getElementById('total-appointments').textContent = appointments.length;
    document.getElementById('upcoming-appointments').textContent = 
        appointments.filter(apt => apt.status === 'scheduled').length;
    document.getElementById('total-reports').textContent = reports.length;
    
    // Update recent activity
    const recentActivity = document.getElementById('recent-activity');
    const recentAppointments = appointments.slice(-3);
    if (recentAppointments.length > 0) {
        recentActivity.innerHTML = recentAppointments.map(apt => 
            `<p><small>${apt.date} - ${apt.doctorName}</small></p>`
        ).join('');
    }
}

// Show/hide sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').style.display = 'block';
    
    // Special actions for certain sections
    if (sectionName === 'search') {
        displayAllDoctors();
    }
}

// Initialize date inputs
function initializeDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const appointmentDateInput = document.getElementById('appointment-date');
    if (appointmentDateInput) {
        appointmentDateInput.min = today;
    }
    
    const scheduleDate = document.getElementById('schedule-date');
    if (scheduleDate) {
        scheduleDate.value = today;
    }
    
    const reportDate = document.getElementById('report-date');
    if (reportDate) {
        reportDate.value = today;
    }
}

// Populate doctor dropdown for booking
function populateDoctorDropdown() {
    const doctorSelect = document.getElementById('doctor-select');
    if (doctorSelect) {
        doctorSelect.innerHTML = '<option value="">Choose a doctor</option>';
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization} ($${doctor.consultationFee})`;
            doctorSelect.appendChild(option);
        });
    }
}

// Populate patient select for adding reports
function populatePatientSelect() {
    const patientSelect = document.getElementById('patient-select');
    if (patientSelect) {
        const currentUser = getCurrentUser();
        patientSelect.innerHTML = `<option value="${currentUser.data.id}">${currentUser.data.firstName} ${currentUser.data.lastName}</option>`;
    }
}

// Load doctors for search functionality
function loadDoctorsForSearch() {
    displayAllDoctors();
}

// Display all doctors in search results
function displayAllDoctors() {
    const searchResults = document.getElementById('doctors-search-results');
    if (searchResults) {
        searchResults.innerHTML = '';
        doctors.forEach(doctor => {
            const doctorCard = createDoctorSearchCard(doctor);
            searchResults.appendChild(doctorCard);
        });
    }
}

// Create doctor search card
function createDoctorSearchCard(doctor) {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.innerHTML = `
        <img src="${doctor.profilePicture}" alt="Dr. ${doctor.firstName} ${doctor.lastName}">
        <div class="doctor-info">
            <h3>Dr. ${doctor.firstName} ${doctor.lastName}</h3>
            <p class="qualification">${doctor.degree} - ${doctor.specialization}<br>${doctor.institution}</p>
            <p class="workplace"><strong>${doctor.workingPlace}</strong><br>
                ${formatWorkingDays(doctor.workingDays)}<br>
                ${doctor.startTime} - ${doctor.endTime}</p>
            <p class="fee">Consultation Fee: $${doctor.consultationFee}</p>
            <button class="btn btn-primary" onclick="bookWithDoctor(${doctor.id})">Book Appointment</button>
        </div>
    `;
    return card;
}

// Format working days
function formatWorkingDays(days) {
    const dayNames = {
        'monday': 'Mon',
        'tuesday': 'Tue',
        'wednesday': 'Wed',
        'thursday': 'Thu',
        'friday': 'Fri',
        'saturday': 'Sat',
        'sunday': 'Sun'
    };
    return days.map(day => dayNames[day]).join(', ');
}

// Search doctors
function searchDoctors() {
    const searchTerm = document.getElementById('doctor-search').value.toLowerCase();
    const specializationFilter = document.getElementById('specialization-filter').value;
    const feeFilter = document.getElementById('fee-filter').value;
    
    let filteredDoctors = doctors;
    
    // Apply search term filter
    if (searchTerm) {
        filteredDoctors = filteredDoctors.filter(doctor => 
            doctor.firstName.toLowerCase().includes(searchTerm) ||
            doctor.lastName.toLowerCase().includes(searchTerm) ||
            doctor.specialization.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply specialization filter
    if (specializationFilter) {
        filteredDoctors = filteredDoctors.filter(doctor => 
            doctor.specialization === specializationFilter
        );
    }
    
    // Apply fee filter
    if (feeFilter) {
        filteredDoctors = filteredDoctors.filter(doctor => {
            const fee = doctor.consultationFee;
            switch(feeFilter) {
                case '0-100': return fee <= 100;
                case '100-200': return fee > 100 && fee <= 200;
                case '200-300': return fee > 200 && fee <= 300;
                case '300+': return fee > 300;
                default: return true;
            }
        });
    }
    
    // Display filtered results
    const searchResults = document.getElementById('doctors-search-results');
    searchResults.innerHTML = '';
    filteredDoctors.forEach(doctor => {
        const doctorCard = createDoctorSearchCard(doctor);
        searchResults.appendChild(doctorCard);
    });
}

// Book appointment with specific doctor
function bookWithDoctor(doctorId) {
    const doctorSelect = document.getElementById('doctor-select');
    doctorSelect.value = doctorId;
    openBookingModal();
}

// Modal functions
function openBookingModal() {
    document.getElementById('booking-modal').style.display = 'block';
}

function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
    document.getElementById('booking-form').reset();
}

function openAddReportModal() {
    document.getElementById('add-report-modal').style.display = 'block';
}

function closeAddReportModal() {
    document.getElementById('add-report-modal').style.display = 'none';
    document.getElementById('add-report-form').reset();
}

function openEditProfileModal() {
    const currentUser = getCurrentUser();
    const userData = currentUser.data;
    
    document.getElementById('edit-first-name').value = userData.firstName;
    document.getElementById('edit-last-name').value = userData.lastName;
    document.getElementById('edit-phone').value = userData.phone || '';
    document.getElementById('edit-weight').value = userData.weight || '';
    document.getElementById('edit-height').value = userData.height || '';
    document.getElementById('edit-address').value = userData.address || '';
    
    document.getElementById('edit-profile-modal').style.display = 'block';
}

function closeEditProfileModal() {
    document.getElementById('edit-profile-modal').style.display = 'none';
}

// Appointment booking
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const doctorId = parseInt(document.getElementById('doctor-select').value);
            const doctor = doctors.find(d => d.id === doctorId);
            const currentUser = getCurrentUser();
            
            const appointmentData = {
                id: appointments.length + 1,
                patientId: currentUser.data.id,
                patientName: `${currentUser.data.firstName} ${currentUser.data.lastName}`,
                doctorId: doctorId,
                doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                date: document.getElementById('appointment-date').value,
                time: document.getElementById('appointment-time').value,
                reason: document.getElementById('appointment-reason').value,
                status: 'scheduled'
            };
            
            appointments.push(appointmentData);
            localStorage.setItem('patient_appointments', JSON.stringify(appointments));
            
            closeBookingModal();
            showSuccessMessage('Appointment booked successfully! You will be informed shortly.');
            loadAppointments();
            updateDashboardStats();
        });
    }
});

// Add report
document.addEventListener('DOMContentLoaded', function() {
    const addReportForm = document.getElementById('add-report-form');
    if (addReportForm) {
        addReportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentUser = getCurrentUser();
            const fileInput = document.getElementById('report-file');
            let fileName = '';
            
            if (fileInput.files[0]) {
                fileName = fileInput.files[0].name;
            }
            
            const reportData = {
                id: reports.length + 1,
                patientId: currentUser.data.id,
                patientName: `${currentUser.data.firstName} ${currentUser.data.lastName}`,
                type: document.getElementById('report-type').value,
                doctor: document.getElementById('report-doctor').value,
                date: document.getElementById('report-date').value,
                notes: document.getElementById('report-notes').value,
                fileName: fileName
            };
            
            reports.push(reportData);
            localStorage.setItem('patient_reports', JSON.stringify(reports));
            
            closeAddReportModal();
            showSuccessMessage('Report added successfully!');
            loadReports();
            updateDashboardStats();
        });
    }
});

// Edit profile
document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const updateData = {
                firstName: document.getElementById('edit-first-name').value,
                lastName: document.getElementById('edit-last-name').value,
                phone: document.getElementById('edit-phone').value,
                weight: parseFloat(document.getElementById('edit-weight').value) || null,
                height: parseInt(document.getElementById('edit-height').value) || null,
                address: document.getElementById('edit-address').value
            };
            
            if (updateUserData(updateData)) {
                closeEditProfileModal();
                showSuccessMessage('Profile updated successfully!');
                loadUserProfile();
            } else {
                alert('Failed to update profile!');
            }
        });
    }
});

// Load appointments
function loadAppointments() {
    const tableBody = document.getElementById('appointments-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.doctorName}</td>
                <td><span class="status-${appointment.status}">${appointment.status}</span></td>
                <td>
                    ${appointment.status === 'scheduled' ? 
                        `<button class="btn btn-small" onclick="cancelAppointment(${appointment.id})">Cancel</button>` : 
                        '-'
                    }
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Load reports
function loadReports() {
    const tableBody = document.getElementById('reports-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        reports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.date}</td>
                <td>${report.type}</td>
                <td>${report.doctor}</td>
                <td>
                    <button class="btn btn-small" onclick="viewReport(${report.id})">View</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointment = appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = 'cancelled';
            localStorage.setItem('patient_appointments', JSON.stringify(appointments));
            loadAppointments();
            updateDashboardStats();
            showSuccessMessage('Appointment cancelled successfully!');
        }
    }
}

// View report
function viewReport(reportId) {
    const report = reports.find(r => r.id === reportId);
    if (report) {
        alert(`Report Details:\n\nType: ${report.type}\nDoctor: ${report.doctor}\nDate: ${report.date}\nNotes: ${report.notes || 'No notes'}\nFile: ${report.fileName || 'No file attached'}`);
    }
}

// Change profile picture
function changeProfilePicture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                document.getElementById('profile-picture').src = imageUrl;
                updateUserData({ profilePicture: imageUrl });
                showSuccessMessage('Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});