// Patient Dashboard JavaScript

let patientAppointments = [];
let patientReports = [];
let allDoctors = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'patient') {
        window.location.href = 'patient-login.html';
        return;
    }
    
    loadDashboardData();
    loadUserProfile();
    populateDoctorDropdown();
    initializeDateInputs();
    loadAllDoctors();
});

// Load dashboard data
function loadDashboardData() {
    // Load appointments from localStorage
    const storedAppointments = localStorage.getItem('patient_appointments');
    if (storedAppointments) {
        const allAppointments = JSON.parse(storedAppointments);
        const currentUser = getCurrentUser();
        patientAppointments = allAppointments.filter(apt => apt.patientId === currentUser.data.id);
    }
    
    // Load reports from localStorage
    const storedReports = localStorage.getItem('patient_reports');
    if (storedReports) {
        const allReports = JSON.parse(storedReports);
        const currentUser = getCurrentUser();
        patientReports = allReports.filter(report => report.patientId === currentUser.data.id);
    }
    
    // Load doctor reports for this patient
    const doctorReports = localStorage.getItem('doctor_reports');
    if (doctorReports) {
        const drReports = JSON.parse(doctorReports);
        const currentUser = getCurrentUser();
        const patientDoctorReports = drReports.filter(report => report.patientId === currentUser.data.id);
        patientReports = [...patientReports, ...patientDoctorReports];
    }
    
    // Load all doctors
    allDoctors = getAllDoctors();
    
    updateDashboardStats();
    loadAppointments();
    loadReports();
}

// Update dashboard statistics
function updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const upcomingAppointments = patientAppointments.filter(apt => apt.date >= today && apt.status === 'scheduled');
    
    document.getElementById('total-appointments').textContent = patientAppointments.length;
    document.getElementById('upcoming-appointments').textContent = upcomingAppointments.length;
    document.getElementById('total-reports').textContent = patientReports.length;
}

// Load user profile
function loadUserProfile() {
    const currentUser = getCurrentUser();
    const userData = currentUser.data;
    
    document.getElementById('welcome-message').textContent = 
        `Welcome back, ${userData.firstName}! Good to see you again.`;
    
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
        const heightInMeters = userData.height / 100;
        const bmi = (userData.weight / (heightInMeters * heightInMeters)).toFixed(1);
        document.getElementById('profile-bmi').textContent = bmi;
    }
    
    // Update profile picture
    if (userData.profilePicture) {
        document.getElementById('profile-picture').src = userData.profilePicture;
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
    const appointmentDate = document.getElementById('appointment-date');
    if (appointmentDate) {
        appointmentDate.min = today;
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
        allDoctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `Dr. ${doctor.firstName} ${doctor.lastName} - ${doctor.specialization.replace('-', ' ')} (₹${doctor.consultationFee})`;
            doctorSelect.appendChild(option);
        });
    }
}

// Load all doctors for search
function loadAllDoctors() {
    displayAllDoctors();
}

// Display all doctors in search results
function displayAllDoctors() {
    const searchResults = document.getElementById('doctors-search-results');
    if (searchResults) {
        searchResults.innerHTML = '';
        
        allDoctors.forEach(doctor => {
            const doctorCard = createDoctorCard(doctor);
            searchResults.appendChild(doctorCard);
        });
    }
}

// Create doctor card for search results
function createDoctorCard(doctor) {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.innerHTML = `
        <img src="${doctor.profilePicture}" alt="Dr. ${doctor.firstName} ${doctor.lastName}">
        <div class="doctor-info">
            <h3>Dr. ${doctor.firstName} ${doctor.lastName}</h3>
            <p class="qualification">${doctor.degree} - ${doctor.specialization.replace('-', ' ').toUpperCase()}<br>${doctor.institution}</p>
            <p class="workplace"><strong>${doctor.workingPlace}</strong><br>${formatWorkingDays(doctor.workingDays)}: ${doctor.startTime} - ${doctor.endTime}</p>
            <p class="fee">Consultation Fee: ₹${doctor.consultationFee}</p>
            <button class="btn btn-primary btn-small" onclick="bookAppointmentWithDoctor(${doctor.id})">Book Appointment</button>
        </div>
    `;
    return card;
}

// Format working days
function formatWorkingDays(days) {
    if (!days || !Array.isArray(days)) return '';
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

// Book appointment with specific doctor
function bookAppointmentWithDoctor(doctorId) {
    const doctorSelect = document.getElementById('doctor-select');
    if (doctorSelect) {
        doctorSelect.value = doctorId;
    }
    openBookingModal();
}

// Search doctors
function searchDoctors() {
    const searchTerm = document.getElementById('doctor-search').value.toLowerCase();
    const specializationFilter = document.getElementById('specialization-filter').value;
    const feeFilter = document.getElementById('fee-filter').value;
    
    let filteredDoctors = allDoctors;
    
    // Filter by search term (name or specialization)
    if (searchTerm) {
        filteredDoctors = filteredDoctors.filter(doctor => {
            const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
            const specialization = doctor.specialization.replace('-', ' ').toLowerCase();
            return fullName.includes(searchTerm) || specialization.includes(searchTerm);
        });
    }
    
    // Filter by specialization
    if (specializationFilter) {
        filteredDoctors = filteredDoctors.filter(doctor => 
            doctor.specialization === specializationFilter
        );
    }
    
    // Filter by fee range
    if (feeFilter) {
        filteredDoctors = filteredDoctors.filter(doctor => {
            const fee = doctor.consultationFee;
            switch (feeFilter) {
                case '0-1000':
                    return fee <= 1000;
                case '1000-2000':
                    return fee > 1000 && fee <= 2000;
                case '2000-3000':
                    return fee > 2000 && fee <= 3000;
                case '3000+':
                    return fee > 3000;
                default:
                    return true;
            }
        });
    }
    
    // Display filtered results
    const searchResults = document.getElementById('doctors-search-results');
    if (searchResults) {
        searchResults.innerHTML = '';
        
        if (filteredDoctors.length === 0) {
            searchResults.innerHTML = '<p style="text-align: center; color: #666;">No doctors found matching your criteria.</p>';
            return;
        }
        
        filteredDoctors.forEach(doctor => {
            const doctorCard = createDoctorCard(doctor);
            searchResults.appendChild(doctorCard);
        });
    }
}

// Load appointments
function loadAppointments() {
    const tableBody = document.getElementById('appointments-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        if (patientAppointments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No appointments found</td></tr>';
            return;
        }
        
        patientAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        patientAppointments.forEach(appointment => {
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
        
        if (patientReports.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No reports found</td></tr>';
            return;
        }
        
        patientReports.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        patientReports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.date}</td>
                <td>${report.type}</td>
                <td>${report.doctorName || report.doctor || 'Self-added'}</td>
                <td>
                    <button class="btn btn-small" onclick="viewReport(${report.id})">View Report</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        // Update the appointment in localStorage
        const allAppointments = JSON.parse(localStorage.getItem('patient_appointments') || '[]');
        const appointmentIndex = allAppointments.findIndex(apt => apt.id === appointmentId);
        
        if (appointmentIndex !== -1) {
            allAppointments[appointmentIndex].status = 'cancelled';
            localStorage.setItem('patient_appointments', JSON.stringify(allAppointments));
            
            // Update local data
            const localAppointment = patientAppointments.find(apt => apt.id === appointmentId);
            if (localAppointment) {
                localAppointment.status = 'cancelled';
            }
            
            loadAppointments();
            updateDashboardStats();
            showSuccessMessage('Appointment cancelled successfully!');
        }
    }
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

// Book appointment
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentUser = getCurrentUser();
            const doctorId = parseInt(document.getElementById('doctor-select').value);
            const doctor = allDoctors.find(d => d.id === doctorId);
            
            const appointmentData = {
                id: Date.now(), // Unique ID
                patientId: currentUser.data.id,
                patientName: `${currentUser.data.firstName} ${currentUser.data.lastName}`,
                doctorId: doctorId,
                doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
                date: document.getElementById('appointment-date').value,
                time: document.getElementById('appointment-time').value,
                reason: document.getElementById('appointment-reason').value,
                status: 'scheduled'
            };
            
            // Save to localStorage
            let allAppointments = JSON.parse(localStorage.getItem('patient_appointments') || '[]');
            allAppointments.push(appointmentData);
            localStorage.setItem('patient_appointments', JSON.stringify(allAppointments));
            
            // Update local data
            patientAppointments.push(appointmentData);
            
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
                id: Date.now(), // Unique ID
                patientId: currentUser.data.id,
                type: document.getElementById('report-type').value,
                doctor: document.getElementById('report-doctor').value,
                date: document.getElementById('report-date').value,
                notes: document.getElementById('report-notes').value,
                fileName: fileName
            };
            
            // Save to localStorage
            let allReports = JSON.parse(localStorage.getItem('patient_reports') || '[]');
            allReports.push(reportData);
            localStorage.setItem('patient_reports', JSON.stringify(allReports));
            
            // Update local data
            patientReports.push(reportData);
            
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
                weight: parseFloat(document.getElementById('edit-weight').value) || 0,
                height: parseInt(document.getElementById('edit-height').value) || 0,
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

// View report
function viewReport(reportId) {
    const report = patientReports.find(r => r.id === reportId);
    if (report) {
        alert(`Report Details:\n\nType: ${report.type}\nDoctor: ${report.doctor || report.doctorName || 'Self-added'}\nDate: ${report.date}\nNotes: ${report.notes || 'No notes'}\n${report.fileName ? `File: ${report.fileName}` : ''}`);
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