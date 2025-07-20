class DoctorPortal {
    constructor() {
        this.token = localStorage.getItem('doctorToken');
        this.user = JSON.parse(localStorage.getItem('doctorUser') || '{}');
        this.apiUrl = '/api';
        
        this.init();
    }
    
    init() {
        if (this.token) {
            this.showDashboard();
            this.loadUserData();
        } else {
            this.showLoginModal();
        }
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Modal controls
        document.querySelectorAll('.close').forEach(close => {
            close.addEventListener('click', () => this.hideModals());
        });
        
        // Auth form switching
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterModal();
        });
        
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginModal();
        });
        
        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('addReportForm').addEventListener('submit', (e) => this.handleAddReport(e));
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Add report button
        document.getElementById('addReportBtn').addEventListener('click', () => this.showAddReportModal());
        
        // Profile editing
        document.getElementById('editProfileBtn').addEventListener('click', () => this.showEditProfileModal());
        document.getElementById('editProfileForm').addEventListener('submit', (e) => this.handleEditProfile(e));
        
        // Working place and hour management
        document.getElementById('addWorkingPlace').addEventListener('click', () => this.addWorkingPlaceField());
        document.getElementById('addWorkingHour').addEventListener('click', () => this.addWorkingHourField());
    }
    
    async makeRequest(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            },
            ...options
        };
        
        try {
            const response = await fetch(this.apiUrl + url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    showLoginModal() {
        this.hideModals();
        document.getElementById('loginModal').classList.add('show');
    }
    
    showRegisterModal() {
        this.hideModals();
        document.getElementById('registerModal').classList.add('show');
    }
    
    showAddReportModal() {
        this.loadPatients();
        document.getElementById('addReportModal').classList.add('show');
    }
    
    showEditProfileModal() {
        this.loadProfileForEdit();
        document.getElementById('editProfileModal').classList.add('show');
    }
    
    hideModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }
    
    showDashboard() {
        document.getElementById('doctorDashboard').style.display = 'block';
        this.hideModals();
    }
    
    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const data = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password')
                })
            });
            
            if (data.user.role !== 'doctor') {
                throw new Error('Invalid credentials for doctor portal');
            }
            
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('doctorToken', this.token);
            localStorage.setItem('doctorUser', JSON.stringify(this.user));
            
            this.showDashboard();
            this.loadUserData();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    addWorkingPlaceField() {
        const container = document.getElementById('workingPlaces');
        const div = document.createElement('div');
        div.className = 'working-place';
        div.innerHTML = `
            <input type="text" name="workingPlaceName" placeholder="Hospital/Clinic Name" required>
            <input type="text" name="workingPlaceAddress" placeholder="Address" required>
            <input type="tel" name="workingPlacePhone" placeholder="Phone" required>
            <button type="button" onclick="this.parentElement.remove()" class="btn btn-secondary">Remove</button>
        `;
        container.appendChild(div);
    }
    
    addWorkingHourField() {
        const container = document.getElementById('workingHours');
        const div = document.createElement('div');
        div.className = 'working-hour';
        div.innerHTML = `
            <select name="workingDay" required>
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
            </select>
            <input type="time" name="startTime" required>
            <input type="time" name="endTime" required>
            <label><input type="checkbox" name="isAvailable" checked> Available</label>
            <button type="button" onclick="this.parentElement.remove()" class="btn btn-secondary">Remove</button>
        `;
        container.appendChild(div);
    }
    
    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Collect working places
        const workingPlaces = [];
        const placeNames = formData.getAll('workingPlaceName');
        const placeAddresses = formData.getAll('workingPlaceAddress');
        const placePhones = formData.getAll('workingPlacePhone');
        
        for (let i = 0; i < placeNames.length; i++) {
            if (placeNames[i] && placeAddresses[i] && placePhones[i]) {
                workingPlaces.push({
                    name: placeNames[i],
                    address: placeAddresses[i],
                    phone: placePhones[i]
                });
            }
        }
        
        // Collect working hours
        const workingHours = [];
        const days = formData.getAll('workingDay');
        const startTimes = formData.getAll('startTime');
        const endTimes = formData.getAll('endTime');
        const availabilities = formData.getAll('isAvailable');
        
        for (let i = 0; i < days.length; i++) {
            if (days[i] && startTimes[i] && endTimes[i]) {
                workingHours.push({
                    day: days[i],
                    startTime: startTimes[i],
                    endTime: endTimes[i],
                    isAvailable: availabilities.includes('on')
                });
            }
        }
        
        try {
            const data = await this.makeRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    phone: formData.get('phone'),
                    specialty: formData.get('specialty'),
                    experience: parseInt(formData.get('experience')),
                    qualification: formData.get('qualification'),
                    bio: formData.get('bio'),
                    consultationFee: parseInt(formData.get('consultationFee')),
                    workingPlaces,
                    workingHours,
                    role: 'doctor'
                })
            });
            
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('doctorToken', this.token);
            localStorage.setItem('doctorUser', JSON.stringify(this.user));
            
            this.showDashboard();
            this.loadUserData();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    async loadProfile() {
        try {
            const profile = await this.makeRequest(`/doctors/${this.user.id}`);
            this.renderProfile(profile);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }
    
    renderProfile(profile) {
        const container = document.getElementById('profileInfo');
        
        container.innerHTML = `
            <div class="profile-section">
                <h3>Professional Information</h3>
                <div class="profile-grid">
                    <div class="profile-item">
                        <label>Full Name:</label>
                        <span>Dr. ${profile.name}</span>
                    </div>
                    <div class="profile-item">
                        <label>Email:</label>
                        <span>${profile.email}</span>
                    </div>
                    <div class="profile-item">
                        <label>Phone:</label>
                        <span>${profile.phone}</span>
                    </div>
                    <div class="profile-item">
                        <label>Specialty:</label>
                        <span>${profile.specialty}</span>
                    </div>
                    <div class="profile-item">
                        <label>Experience:</label>
                        <span>${profile.experience} years</span>
                    </div>
                    <div class="profile-item">
                        <label>Qualification:</label>
                        <span>${profile.qualification}</span>
                    </div>
                    <div class="profile-item">
                        <label>Consultation Fee:</label>
                        <span>$${profile.consultationFee}</span>
                    </div>
                    <div class="profile-item">
                        <label>Bio:</label>
                        <span>${profile.bio}</span>
                    </div>
                </div>
            </div>
            ${profile.workingPlaces && profile.workingPlaces.length > 0 ? `
                <div class="profile-section">
                    <h3>Working Places</h3>
                    ${profile.workingPlaces.map(place => `
                        <div class="place-item">
                            <strong>${place.name}</strong><br>
                            ${place.address}<br>
                            Phone: ${place.phone}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${profile.workingHours && profile.workingHours.length > 0 ? `
                <div class="profile-section">
                    <h3>Working Hours</h3>
                    ${profile.workingHours.map(hour => `
                        <div class="hour-item">
                            ${hour.day}: ${hour.startTime} - ${hour.endTime} ${hour.isAvailable ? '(Available)' : '(Not Available)'}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
    }
    
    async loadProfileForEdit() {
        try {
            const profile = await this.makeRequest(`/doctors/${this.user.id}`);
            document.getElementById('editName').value = profile.name;
            document.getElementById('editPhone').value = profile.phone;
            document.getElementById('editSpecialty').value = profile.specialty;
            document.getElementById('editExperience').value = profile.experience;
            document.getElementById('editQualification').value = profile.qualification;
            document.getElementById('editBio').value = profile.bio;
            document.getElementById('editConsultationFee').value = profile.consultationFee;
        } catch (error) {
            console.error('Error loading profile for edit:', error);
        }
    }
    
    async handleEditProfile(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            await this.makeRequest('/doctors/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    specialty: formData.get('specialty'),
                    experience: parseInt(formData.get('experience')),
                    qualification: formData.get('qualification'),
                    bio: formData.get('bio'),
                    consultationFee: parseInt(formData.get('consultationFee'))
                })
            });
            
            alert('Profile updated successfully!');
            this.hideModals();
            this.loadProfile();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    async loadUserData() {
        document.getElementById('userName').textContent = `Welcome, Dr. ${this.user.name}`;
        
        // Load initial data
        await this.loadSchedules();
        await this.loadReports();
        await this.loadProfile();
    }
    
    async loadSchedules() {
        try {
            const appointments = await this.makeRequest('/appointments');
            this.renderSchedules(appointments);
        } catch (error) {
            console.error('Error loading schedules:', error);
        }
    }
    
    async loadReports() {
        try {
            const reports = await this.makeRequest('/reports');
            this.renderReports(reports);
        } catch (error) {
            console.error('Error loading reports:', error);
        }
    }
    
    async loadPatients() {
        try {
            const patients = await this.makeRequest('/patients');
            const patientSelect = document.getElementById('patientSelect');
            
            patientSelect.innerHTML = '<option value="">Select Patient</option>';
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient._id;
                option.textContent = patient.name;
                patientSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    }
    
    renderSchedules(appointments) {
        const container = document.getElementById('schedulesList');
        
        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No appointments scheduled</h3>
                    <p>Your appointment schedule will appear here</p>
                </div>
            `;
            return;
        }
        
        // Sort appointments by date and time
        appointments.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateA - dateB;
        });
        
        container.innerHTML = appointments.map(appointment => `
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">${appointment.patient.name}</div>
                        <div class="card-subtitle">${appointment.patient.email} | ${appointment.patient.phone}</div>
                    </div>
                    <span class="status-badge status-${appointment.status}">
                        ${appointment.status}
                    </span>
                </div>
                <div class="card-content">
                    <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${appointment.time}</p>
                    <p><strong>Symptoms:</strong> ${appointment.symptoms}</p>
                    ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
                    ${appointment.prescription ? `<p><strong>Prescription:</strong> ${appointment.prescription}</p>` : ''}
                </div>
                <div class="card-actions">
                    ${appointment.status === 'scheduled' ? `
                        <button class="btn btn-primary" onclick="doctorPortal.completeAppointment('${appointment._id}')">
                            Complete
                        </button>
                        <button class="btn btn-secondary" onclick="doctorPortal.addPrescription('${appointment._id}')">
                            Add Prescription
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    renderReports(reports) {
        const container = document.getElementById('reportsList');
        
        if (reports.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-medical"></i>
                    <h3>No reports found</h3>
                    <p>Patient reports you create will appear here</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = reports.map(report => `
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">${report.title}</div>
                        <div class="card-subtitle">Patient: ${report.patient.name} - ${new Date(report.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="card-content">
                    <p><strong>Description:</strong> ${report.description}</p>
                    <p><strong>Diagnosis:</strong> ${report.diagnosis}</p>
                    ${report.prescription ? `<p><strong>Prescription:</strong> ${report.prescription}</p>` : ''}
                    ${report.testResults ? `<p><strong>Test Results:</strong> ${report.testResults}</p>` : ''}
                    ${report.followUpDate ? `<p><strong>Follow-up Date:</strong> ${new Date(report.followUpDate).toLocaleDateString()}</p>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="doctorPortal.viewReport('${report._id}')">View Report</button>
                </div>
            </div>
        `).join('');
    }
    
    async handleAddReport(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            await this.makeRequest('/reports', {
                method: 'POST',
                body: JSON.stringify({
                    patientId: formData.get('patientId'),
                    title: formData.get('title'),
                    description: formData.get('description'),
                    diagnosis: formData.get('diagnosis'),
                    prescription: formData.get('prescription'),
                    testResults: formData.get('testResults'),
                    followUpDate: formData.get('followUpDate')
                })
            });
            
            alert('Report added successfully!');
            this.hideModals();
            e.target.reset();
            this.loadReports();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    async viewReport(reportId) {
        try {
            const report = await this.makeRequest(`/reports/${reportId}`);
            this.showReportDetails(report);
        } catch (error) {
            alert(error.message);
        }
    }
    
    showReportDetails(report) {
        const container = document.getElementById('reportDetails');
        container.innerHTML = `
            <p><strong>Title:</strong> ${report.title}</p>
            <p><strong>Patient:</strong> ${report.patient.name}</p>
            <p><strong>Date:</strong> ${new Date(report.createdAt).toLocaleDateString()}</p>
            <p><strong>Description:</strong> ${report.description}</p>
            <p><strong>Diagnosis:</strong> ${report.diagnosis}</p>
            ${report.prescription ? `<p><strong>Prescription:</strong> ${report.prescription}</p>` : ''}
            ${report.testResults ? `<p><strong>Test Results:</strong> ${report.testResults}</p>` : ''}
            ${report.followUpDate ? `<p><strong>Follow-up Date:</strong> ${new Date(report.followUpDate).toLocaleDateString()}</p>` : ''}
        `;
        document.getElementById('viewReportModal').classList.add('show');
    }
    
    async completeAppointment(appointmentId) {
        if (!confirm('Mark this appointment as completed?')) return;
        
        try {
            await this.makeRequest(`/appointments/${appointmentId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'completed' })
            });
            
            alert('Appointment marked as completed!');
            this.loadSchedules();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    async addPrescription(appointmentId) {
        const prescription = prompt('Enter prescription:');
        if (!prescription) return;
        
        try {
            await this.makeRequest(`/appointments/${appointmentId}`, {
                method: 'PATCH',
                body: JSON.stringify({ prescription })
            });
            
            alert('Prescription added successfully!');
            this.loadSchedules();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    handleNavigation(e) {
        e.preventDefault();
        const section = e.target.dataset.section;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Show corresponding section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');
    }
    
    logout() {
        localStorage.removeItem('doctorToken');
        localStorage.removeItem('doctorUser');
        location.reload();
    }
}

// Initialize the doctor portal
const doctorPortal = new DoctorPortal();