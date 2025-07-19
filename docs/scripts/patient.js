class PatientPortal {
    constructor() {
        this.token = localStorage.getItem('patientToken');
        this.user = JSON.parse(localStorage.getItem('patientUser') || '{}');
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
        document.getElementById('appointmentForm').addEventListener('submit', (e) => this.handleAppointmentBooking(e));
        document.getElementById('addReportForm').addEventListener('submit', (e) => this.handleAddReport(e));
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Add report button
        document.getElementById('addReportBtn').addEventListener('click', () => this.showAddReportModal());
        
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.searchDoctors());
        
        // Profile editing
        document.getElementById('editProfileBtn').addEventListener('click', () => this.showEditProfileModal());
        document.getElementById('editProfileForm').addEventListener('submit', (e) => this.handleEditProfile(e));
        
        // Specialty change
        document.getElementById('specialty').addEventListener('change', () => this.loadDoctorsBySpecialty());
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
        document.getElementById('patientDashboard').style.display = 'block';
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
            
            if (data.user.role !== 'patient') {
                throw new Error('Invalid credentials for patient portal');
            }
            
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('patientToken', this.token);
            localStorage.setItem('patientUser', JSON.stringify(this.user));
            
            this.showDashboard();
            this.loadUserData();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            const data = await this.makeRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    phone: formData.get('phone'),
                    dateOfBirth: formData.get('dateOfBirth'),
                    gender: formData.get('gender'),
                    address: formData.get('address'),
                    role: 'patient'
                })
            });
            
            this.token = data.token;
            this.user = data.user;
            
            localStorage.setItem('patientToken', this.token);
            localStorage.setItem('patientUser', JSON.stringify(this.user));
            
            this.showDashboard();
            this.loadUserData();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    async loadUserData() {
        document.getElementById('userName').textContent = `Welcome, ${this.user.name}`;
        
        // Load initial data
        await this.loadAppointments();
        await this.loadReports();
        await this.loadSpecialties();
        await this.loadProfile();
    }
    
    async loadAppointments() {
        try {
            const appointments = await this.makeRequest('/appointments');
            this.renderAppointments(appointments);
        } catch (error) {
            console.error('Error loading appointments:', error);
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
    
    async loadSpecialties() {
        try {
            const specialties = await this.makeRequest('/doctors/specialties/list');
            const specialtySelect = document.getElementById('specialty');
            
            specialtySelect.innerHTML = '<option value="">Select Specialty</option>';
            specialties.forEach(specialty => {
                const option = document.createElement('option');
                option.value = specialty;
                option.textContent = specialty;
                specialtySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading specialties:', error);
        }
    }
    
    async loadDoctorsBySpecialty() {
        const specialty = document.getElementById('specialty').value;
        const doctorSelect = document.getElementById('doctor');
        
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        
        if (!specialty) return;
        
        try {
            const doctors = await this.makeRequest(`/doctors?specialty=${specialty}`);
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor._id;
                option.textContent = `Dr. ${doctor.name}`;
                doctorSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading doctors:', error);
        }
    }
    
    async searchDoctors() {
        const searchName = document.getElementById('searchName').value;
        const searchSpecialty = document.getElementById('searchSpecialty').value;
        const minFee = document.getElementById('minFee').value;
        const maxFee = document.getElementById('maxFee').value;
        
        const params = new URLSearchParams();
        if (searchName) params.append('search', searchName);
        if (searchSpecialty) params.append('specialty', searchSpecialty);
        if (minFee) params.append('minFee', minFee);
        if (maxFee) params.append('maxFee', maxFee);
        
        try {
            const doctors = await this.makeRequest(`/doctors?${params.toString()}`);
            this.renderSearchResults(doctors);
        } catch (error) {
            console.error('Error searching doctors:', error);
        }
    }
    
    renderSearchResults(doctors) {
        const container = document.getElementById('searchResults');
        
        if (doctors.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-md"></i>
                    <h3>No doctors found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = doctors.map(doctor => `
            <div class="doctor-card">
                <div class="doctor-header">
                    <div class="doctor-info">
                        <h3>Dr. ${doctor.name}</h3>
                        <div class="specialty">${doctor.specialty}</div>
                        <div class="experience">${doctor.experience} years experience</div>
                    </div>
                    <div class="consultation-fee">$${doctor.consultationFee}</div>
                </div>
                <div class="doctor-details">
                    <p><strong>Qualification:</strong> ${doctor.qualification}</p>
                    <p><strong>Bio:</strong> ${doctor.bio}</p>
                    ${doctor.workingPlaces && doctor.workingPlaces.length > 0 ? `
                        <div class="working-places">
                            <h4>Working Places:</h4>
                            ${doctor.workingPlaces.map(place => `
                                <div class="place-item">
                                    <strong>${place.name}</strong><br>
                                    ${place.address}<br>
                                    Phone: ${place.phone}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    ${doctor.workingHours && doctor.workingHours.length > 0 ? `
                        <div class="working-hours">
                            <h4>Working Hours:</h4>
                            ${doctor.workingHours.map(hour => `
                                <div class="hour-item">
                                    ${hour.day}: ${hour.startTime} - ${hour.endTime} ${hour.isAvailable ? '(Available)' : '(Not Available)'}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="doctor-actions">
                    <button class="btn btn-primary" onclick="patientPortal.bookWithDoctor('${doctor._id}')">
                        Book Appointment
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    bookWithDoctor(doctorId) {
        // Switch to book appointment section and pre-select doctor
        this.handleNavigation({ target: { dataset: { section: 'book-appointment' } } });
        
        // Pre-select the doctor (you might need to load specialty first)
        setTimeout(() => {
            document.getElementById('doctor').value = doctorId;
        }, 500);
    }
    
    async loadProfile() {
        try {
            const profile = await this.makeRequest('/patients/profile');
            this.renderProfile(profile);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }
    
    renderProfile(profile) {
        const container = document.getElementById('profileInfo');
        
        container.innerHTML = `
            <div class="profile-section">
                <h3>Personal Information</h3>
                <div class="profile-grid">
                    <div class="profile-item">
                        <label>Full Name:</label>
                        <span>${profile.name}</span>
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
                        <label>Date of Birth:</label>
                        <span>${new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div class="profile-item">
                        <label>Gender:</label>
                        <span>${profile.gender}</span>
                    </div>
                    <div class="profile-item">
                        <label>Address:</label>
                        <span>${profile.address}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    async loadProfileForEdit() {
        try {
            const profile = await this.makeRequest('/patients/profile');
            document.getElementById('editName').value = profile.name;
            document.getElementById('editPhone').value = profile.phone;
            document.getElementById('editAddress').value = profile.address;
        } catch (error) {
            console.error('Error loading profile for edit:', error);
        }
    }
    
    async handleEditProfile(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            await this.makeRequest('/patients/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    address: formData.get('address')
                })
            });
            
            alert('Profile updated successfully!');
            this.hideModals();
            this.loadProfile();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    renderAppointments(appointments) {
        const container = document.getElementById('appointmentsList');
        
        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No appointments found</h3>
                    <p>Book your first appointment to get started</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = appointments.map(appointment => `
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">Dr. ${appointment.doctor.name}</div>
                        <div class="card-subtitle">${appointment.doctor.specialty}</div>
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
                ${appointment.status === 'scheduled' ? `
                    <div class="card-actions">
                        <button class="btn btn-secondary" onclick="patientPortal.cancelAppointment('${appointment._id}')">
                            Cancel
                        </button>
                    </div>
                ` : ''}
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
                    <p>Your medical reports will appear here</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = reports.map(report => `
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">${report.title}</div>
                        <div class="card-subtitle">By Dr. ${report.doctor.name} - ${new Date(report.createdAt).toLocaleDateString()}</div>
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
                    <button class="btn btn-primary" onclick="patientPortal.viewReport('${report._id}')">View Report</button>
                </div>
            </div>
        `).join('');
    }
    
    async handleAppointmentBooking(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            await this.makeRequest('/appointments', {
                method: 'POST',
                body: JSON.stringify({
                    doctorId: formData.get('doctor'),
                    date: formData.get('date'),
                    time: formData.get('time'),
                    symptoms: formData.get('symptoms')
                })
            });
            
            alert('Appointment booked successfully!');
            e.target.reset();
            this.loadAppointments();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    async handleAddReport(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        try {
            await this.makeRequest('/reports', {
                method: 'POST',
                body: JSON.stringify({
                    patientId: this.user.id,
                    title: formData.get('title'),
                    description: formData.get('description'),
                    diagnosis: formData.get('diagnosis'),
                    prescription: formData.get('prescription')
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
            <p><strong>Doctor:</strong> Dr. ${report.doctor.name} (${report.doctor.specialty})</p>
            <p><strong>Date:</strong> ${new Date(report.createdAt).toLocaleDateString()}</p>
            <p><strong>Description:</strong> ${report.description}</p>
            <p><strong>Diagnosis:</strong> ${report.diagnosis}</p>
            ${report.prescription ? `<p><strong>Prescription:</strong> ${report.prescription}</p>` : ''}
            ${report.testResults ? `<p><strong>Test Results:</strong> ${report.testResults}</p>` : ''}
            ${report.followUpDate ? `<p><strong>Follow-up Date:</strong> ${new Date(report.followUpDate).toLocaleDateString()}</p>` : ''}
        `;
        document.getElementById('viewReportModal').classList.add('show');
    }
    
    async cancelAppointment(appointmentId) {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;
        
        try {
            await this.makeRequest(`/appointments/${appointmentId}`, {
                method: 'PATCH',
                body: JSON.stringify({ status: 'cancelled' })
            });
            
            alert('Appointment cancelled successfully!');
            this.loadAppointments();
            
        } catch (error) {
            alert(error.message);
        }
    }
    
    handleNavigation(e) {
        e.preventDefault();
        const section = e.target.dataset.section;
        
        // Load search specialties when switching to search section
        if (section === 'search-doctors') {
            const specialties = await this.makeRequest('/doctors/specialties/list');
            const searchSpecialtySelect = document.getElementById('searchSpecialty');
            searchSpecialtySelect.innerHTML = '<option value="">All Specialties</option>' + 
                specialties.map(s => `<option value="${s}">${s}</option>`).join('');
        }
        
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
        localStorage.removeItem('patientToken');
        localStorage.removeItem('patientUser');
        location.reload();
    }
}

// Initialize the patient portal
const patientPortal = new PatientPortal();