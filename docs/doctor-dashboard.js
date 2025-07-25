// Doctor Dashboard JavaScript

let doctorAppointments = [];
let patientReports = [];
let patients = [];

// Mock data for testing
const mockDoctorAppointments = [
    {
        id: 3001,
        patientId: 1,
        patientName: 'Smitha',
        doctorId: 1,
        doctorName: 'Dr. Amog',
        date: '2025-07-24',
        time: '10:00',
        reason: 'Regular checkup',
        status: 'scheduled'
    },
    {
        id: 3002,
        patientId: 2,
        patientName: 'Adhi',
        doctorId: 1,
        doctorName: 'Dr. Amog',
        date: '2025-07-24',
        time: '11:00',
        reason: 'Heart consultation',
        status: 'scheduled'
    }
];

const mockPatientReports = [
    {
        id: 4001,
        patientId: 1,
        patientName: 'Smitha',
        doctorId: 1,
        doctorName: 'Dr. Amog',
        type: 'consultation',
        date: '2025-07-24',
        notes: 'Patient shows good recovery progress',
        fileName: 'bloodtest.jpeg'
    },
    {
        id: 4002,
        patientId: 2,
        patientName: 'Adhi',
        doctorId: 1,
        doctorName: 'Dr. Amog',
        type: 'consultation',
        date: '2025-07-24',
        notes: 'Normal',
        fileName: 'xray.jpeg'
    }
];

// Load user profile
function loadUserProfile() {
    const currentUser = getCurrentUser();
    const userData = currentUser.data;
    
    document.getElementById('welcome-message').textContent = 
        `Welcome, Dr. ${userData.lastName}! Ready to help your patients today.`;
    
    // Update profile section
    document.getElementById('profile-name').textContent = 
        `Dr. ${userData.firstName} ${userData.lastName}`;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-specialization').textContent = 
        userData.specialization.replace('-', ' ').toUpperCase();
    document.getElementById('profile-phone').textContent = userData.phone || '-';
    document.getElementById('profile-degree').textContent = userData.degree || '-';
    document.getElementById('profile-institution').textContent = userData.institution || '-';
    document.getElementById('profile-experience').textContent = userData.experience || '-';
    document.getElementById('profile-fee').textContent = userData.consultationFee || '-';
    document.getElementById('profile-workplace').textContent = userData.workingPlace || '-';
    document.getElementById('profile-working-days').textContent = 
        formatWorkingDays(userData.workingDays) || '-';
    document.getElementById('profile-working-hours').textContent = 
        `${userData.startTime} - ${userData.endTime}` || '-';
    document.getElementById('profile-bio').textContent = userData.bio || '-';
    document.getElementById('profile-license').textContent = userData.licenseId || '-';
    
    // Update profile picture
    if (userData.profilePicture) {
        document.getElementById('profile-picture').src = userData.profilePicture;
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'doctor') {
        window.location.href = 'doctor-login.html';
        return;
    }
    
    loadDashboardData();
    loadUserProfile();
    populatePatientDropdown();
    initializeDateInputs();
    loadTodaySchedule();
    
    // Initialize form handlers
    initializeDoctorFormHandlers();
});

// Initialize form handlers for doctor
function initializeDoctorFormHandlers() {
    // Add patient report form
    const addPatientReportForm = document.getElementById('add-patient-report-form');
    if (addPatientReportForm) {
        addPatientReportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentUser = getCurrentUser();
            const patientId = parseInt(document.getElementById('patient-select').value);
            const patient = patients.find(p => p.id === patientId);
            
            if (!patient) {
                alert('Please select a patient');
                return;
            }
            
            const fileInput = document.getElementById('patient-report-file');
            let fileName = '';
            
            if (fileInput.files[0]) {
                fileName = fileInput.files[0].name;
            } else {
                // Use a random mock file name if no file selected
                const mockFiles = ['consultation_notes.pdf', 'diagnosis_report.pdf', 'prescription.jpg', 'lab_results.pdf', 'follow_up.pdf'];
                fileName = mockFiles[Math.floor(Math.random() * mockFiles.length)];
            }
            
            // Get current date and time
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0];
            const currentTime = now.toLocaleTimeString('en-IN', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            const reportData = {
                id: Date.now() + Math.floor(Math.random() * 1000), // Unique ID
                patientId: patientId,
                patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
                doctorId: currentUser.data.id,
                doctorName: `Dr. ${currentUser.data.firstName} ${currentUser.data.lastName}`,
                type: document.getElementById('patient-report-type').value,
                date: currentDate,
                time: currentTime,
                notes: document.getElementById('patient-report-notes').value,
                fileName: fileName
            };
            
            // Save to doctor reports
            let doctorReports = JSON.parse(localStorage.getItem('doctor_reports') || '[]');
            doctorReports.push(reportData);
            localStorage.setItem('doctor_reports', JSON.stringify(doctorReports));
            
            // Update local data
            patientReports.push(reportData);
            
            closeAddPatientReportModal();
            showSuccessMessage('Report added successfully!');
            loadPatientReports();
            updateDashboardStats();
        });
    }
    
    // Edit profile form
    const editProfileForm = document.getElementById('edit-profile-form');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const updateData = {
                firstName: document.getElementById('edit-first-name').value,
                lastName: document.getElementById('edit-last-name').value,
                phone: document.getElementById('edit-phone').value,
                consultationFee: parseInt(document.getElementById('edit-fee').value) || 0,
                workingPlace: document.getElementById('edit-workplace').value,
                startTime: document.getElementById('edit-start-time').value,
                endTime: document.getElementById('edit-end-time').value,
                bio: document.getElementById('edit-bio').value
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
}
// Load dashboard data
function loadDashboardData() {
    // Load appointments from localStorage or use mock data
    const storedAppointments = localStorage.getItem('patient_appointments');
    if (storedAppointments) {
        const allAppointments = JSON.parse(storedAppointments);
        const currentUser = getCurrentUser();
        doctorAppointments = allAppointments.filter(apt => apt.doctorId === currentUser.data.id);
    } else {
        // Use mock data if no stored data
        const currentUser = getCurrentUser();
        doctorAppointments = mockDoctorAppointments.filter(apt => apt.doctorId === currentUser.data.id);
    }
    
    // Load patient reports from localStorage or use mock data
    const storedReports = localStorage.getItem('patient_reports');
    if (storedReports) {
        patientReports = JSON.parse(storedReports);
    } else {
        // Use mock data if no stored data
        patientReports = [...mockPatientReports];
    }
    
    // Add doctor-created reports
    const doctorReports = localStorage.getItem('doctor_reports');
    if (doctorReports) {
        const drReports = JSON.parse(doctorReports);
        patientReports = [...patientReports, ...drReports];
    }
    
    // Load patients
    patients = getAllPatients();
    
    updateDashboardStats();
    loadSchedule();
    loadPatientReports();
}

// Update dashboard statistics
function updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = doctorAppointments.filter(apt => apt.date === today);
    
    document.getElementById('today-appointments').textContent = todayAppointments.length;
    document.getElementById('completed-appointments').textContent = 
        todayAppointments.filter(apt => apt.status === 'completed').length;
    document.getElementById('pending-appointments').textContent = 
        todayAppointments.filter(apt => apt.status === 'scheduled').length;
    
    document.getElementById('new-reports').textContent = 
        patientReports.filter(report => {
            const reportDate = new Date(report.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return reportDate > weekAgo;
        }).length;
    
    document.getElementById('total-patient-reports').textContent = patientReports.length;
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
    if (sectionName === 'schedules') {
        loadTodaySchedule();
    }
}

// Initialize date inputs
function initializeDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const scheduleDate = document.getElementById('schedule-date');
    if (scheduleDate) {
        scheduleDate.value = today;
    }
    
    const reportDate = document.getElementById('patient-report-date');
    if (reportDate) {
        reportDate.value = today;
    }
}

// Load today's schedule
function loadTodaySchedule() {
    const today = new Date().toISOString().split('T')[0];
    const scheduleDate = document.getElementById('schedule-date');
    if (scheduleDate) {
        scheduleDate.value = today;
    }
    loadScheduleForDate();
}

// Load schedule for specific date
function loadScheduleForDate() {
    const selectedDate = document.getElementById('schedule-date').value;
    const dayAppointments = doctorAppointments.filter(apt => apt.date === selectedDate);
    
    const tableBody = document.getElementById('schedule-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        if (dayAppointments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No appointments for this date</td></tr>';
            return;
        }
        
        dayAppointments.sort((a, b) => a.time.localeCompare(b.time));
        
        dayAppointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.time}</td>
                <td>${appointment.patientName}</td>
                <td>${appointment.reason || '-'}</td>
                <td><span class="status-${appointment.status}">${appointment.status}</span></td>
                <td>
                    ${appointment.status === 'scheduled' ? 
                        `<button class="btn btn-small" onclick="completeAppointment(${appointment.id})">Complete</button>` : 
                        '-'
                    }
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Complete appointment
function completeAppointment(appointmentId) {
    if (confirm('Mark this appointment as completed?')) {
        // Update the appointment in localStorage
        const allAppointments = JSON.parse(localStorage.getItem('patient_appointments') || '[]');
        const appointmentIndex = allAppointments.findIndex(apt => apt.id === appointmentId);
        
        if (appointmentIndex !== -1) {
            allAppointments[appointmentIndex].status = 'completed';
            localStorage.setItem('patient_appointments', JSON.stringify(allAppointments));
            
            // Update local data
            const localAppointment = doctorAppointments.find(apt => apt.id === appointmentId);
            if (localAppointment) {
                localAppointment.status = 'completed';
            }
            
            loadScheduleForDate();
            updateDashboardStats();
            showSuccessMessage('Appointment marked as completed!');
        }
    }
}

// Populate patient dropdown
function populatePatientDropdown() {
    const patientSelect = document.getElementById('patient-select');
    if (patientSelect) {
        patientSelect.innerHTML = '<option value="">Choose a patient</option>';
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = `${patient.firstName} ${patient.lastName}`;
            patientSelect.appendChild(option);
        });
    }
}

// Load all appointments (schedule)
function loadSchedule() {
    // This is handled by loadScheduleForDate
}

// Load patient reports
function loadPatientReports() {
    const tableBody = document.getElementById('patient-reports-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        patientReports.forEach(report => {
            const patient = patients.find(p => p.id === report.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}` : report.patientName || 'Unknown';
            
            const displayDate = report.time ? `${report.date} ${report.time}` : report.date;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patientName}</td>
                <td>${report.type}</td>
                <td>${displayDate}</td>
                <td>
                    <button class="btn btn-small" onclick="viewPatientReport(${report.id})">View Report</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Search patient reports
function searchPatientReports() {
    const searchTerm = document.getElementById('patient-search').value.toLowerCase();
    
    const filteredReports = patientReports.filter(report => {
        const patient = patients.find(p => p.id === report.patientId);
        const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : 
                            (report.patientName || '').toLowerCase();
        return patientName.includes(searchTerm);
    });
    
    const tableBody = document.getElementById('patient-reports-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        filteredReports.forEach(report => {
            const patient = patients.find(p => p.id === report.patientId);
            const patientName = patient ? `${patient.firstName} ${patient.lastName}` : report.patientName || 'Unknown';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patientName}</td>
                <td>${report.type}</td>
                <td>${report.date}</td>
                <td>
                    <button class="btn btn-small" onclick="viewPatientReport(${report.id})">View Report</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
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

// Modal functions
function openAddPatientReportModal() {
    document.getElementById('add-patient-report-modal').style.display = 'block';
}

function closeAddPatientReportModal() {
    document.getElementById('add-patient-report-modal').style.display = 'none';
    document.getElementById('add-patient-report-form').reset();
}

function openViewReportModal() {
    document.getElementById('view-report-modal').style.display = 'block';
}

function closeViewReportModal() {
    document.getElementById('view-report-modal').style.display = 'none';
}

function openEditProfileModal() {
    const currentUser = getCurrentUser();
    const userData = currentUser.data;
    
    document.getElementById('edit-first-name').value = userData.firstName;
    document.getElementById('edit-last-name').value = userData.lastName;
    document.getElementById('edit-phone').value = userData.phone || '';
    document.getElementById('edit-fee').value = userData.consultationFee || '';
    document.getElementById('edit-workplace').value = userData.workingPlace || '';
    document.getElementById('edit-start-time').value = userData.startTime || '';
    document.getElementById('edit-end-time').value = userData.endTime || '';
    document.getElementById('edit-bio').value = userData.bio || '';
    
    document.getElementById('edit-profile-modal').style.display = 'block';
}

function closeEditProfileModal() {
    document.getElementById('edit-profile-modal').style.display = 'none';
}


// View patient report
function viewPatientReport(reportId) {
    const report = patientReports.find(r => r.id === reportId);
    if (report) {
        const reportDetails = document.getElementById('report-details');
        reportDetails.innerHTML = `
            <div class="dashboard-card" style="margin: 0;">
                <h3>Report Information</h3>
                <p><strong>Patient:</strong> ${report.patientName}</p>
                <p><strong>Type:</strong> ${report.type}</p>
                <p><strong>Date:</strong> ${report.date}</p>
                <p><strong>Doctor:</strong> ${report.doctorName || report.doctor || 'Unknown'}</p>
                ${report.notes ? `<p><strong>Notes:</strong></p><p style="background: #f8fafb; padding: 1rem; border-radius: 8px;">${report.notes}</p>` : ''}
                ${report.fileName ? `<p><strong>Attached File:</strong> ${report.fileName}</p>` : ''}
            </div>
        `;
        openViewReportModal();
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