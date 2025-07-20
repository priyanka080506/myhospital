class PatientPortal {
    constructor() {
        this.mockDatabase = {
            patients: JSON.parse(localStorage.getItem('mockPatients')) || [],
            doctors: JSON.parse(localStorage.getItem('mockDoctors')) || this.createMockDoctors(),
            appointments: JSON.parse(localStorage.getItem('mockAppointments')) || [],
            reports: JSON.parse(localStorage.getItem('mockReports')) || []
        };
        
        this.currentUser = JSON.parse(localStorage.getItem('currentPatient')) || null;
        this.init();
    }

    createMockDoctors() {
        const mockDoctors = [
            {
                id: 'doc1',
                name: "Dr. Sarah Johnson",
                specialty: "Cardiology",
                qualification: "MD Cardiology - Harvard Medical School",
                institution: "City General Hospital",
                experience: "15 years",
                consultationFee: 150,
                workingPlaces: [
                    {
                        name: "City General Hospital",
                        address: "123 Medical St, Health City",
                        timings: "Mon-Fri: 9AM-5PM"
                    }
                ],
                availableSlots: ["09:00", "10:00", "14:00"],
                image: "https://randomuser.me/api/portraits/women/65.jpg"
            },
            // More mock doctors...
        ];
        localStorage.setItem('mockDoctors', JSON.stringify(mockDoctors));
        return mockDoctors;
    }

    init() {
        if (this.currentUser) {
            this.showDashboard();
            this.loadUserData();
        } else {
            this.showLoginModal();
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Modals
        document.getElementById('bookAppointmentBtn').addEventListener('click', () => this.showBookAppointmentModal());
        document.getElementById('addReportBtn').addEventListener('click', () => this.showAddReportModal());
        document.getElementById('editProfileBtn').addEventListener('click', () => this.showEditProfileModal());
        
        // Form submissions
        document.getElementById('bookAppointmentForm').addEventListener('submit', (e) => this.handleBookAppointment(e));
        document.getElementById('addReportForm').addEventListener('submit', (e) => this.handleAddReport(e));
        document.getElementById('editProfileForm').addEventListener('submit', (e) => this.handleEditProfile(e));
        
        // Auth switching
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterModal();
        });
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginModal();
        });
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Close modals
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => this.hideModals());
        });
    }

    // Authentication methods
    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const patient = this.mockDatabase.patients.find(p => p.email === email && p.password === password);
        
        if (patient) {
            this.currentUser = patient;
            localStorage.setItem('currentPatient', JSON.stringify(patient));
            this.showDashboard();
            this.loadUserData();
            alert('Login successful!');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const newPatient = {
            id: 'pat_' + Date.now(),
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            phone: document.getElementById('regPhone').value,
            dob: document.getElementById('regDob').value,
            bloodGroup: document.getElementById('regBloodGroup').value,
            weight: document.getElementById('regWeight').value,
            height: document.getElementById('regHeight').value,
            image: this.getUploadedImage('regPhoto') || "https://randomuser.me/api/portraits/" + 
                  (Math.random() > 0.5 ? "men" : "women") + 
                  "/" + Math.floor(Math.random() * 100) + ".jpg"
        };
        
        this.mockDatabase.patients.push(newPatient);
        localStorage.setItem('mockPatients', JSON.stringify(this.mockDatabase.patients));
        
        this.currentUser = newPatient;
        localStorage.setItem('currentPatient', JSON.stringify(newPatient));
        
        alert('Registration successful!');
        this.showDashboard();
        this.loadUserData();
    }

    getUploadedImage(inputId) {
        const fileInput = document.getElementById(inputId);
        if (fileInput.files.length > 0) {
            return URL.createObjectURL(fileInput.files[0]);
        }
        return null;
    }

    // Dashboard methods
    showDashboard() {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('registerModal').style.display = 'none';
        document.getElementById('patientDashboard').style.display = 'block';
        
        // Update user info in header
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('userAvatar').src = this.currentUser.image;
    }

    loadUserData() {
        this.loadAppointments();
        this.loadReports();
        this.loadProfile();
    }

    loadAppointments() {
        const patientAppointments = this.mockDatabase.appointments.filter(
            apt => apt.patientId === this.currentUser.id
        );
        
        const container = document.getElementById('appointmentsList');
        if (patientAppointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No appointments scheduled</h3>
                    <p>Your upcoming appointments will appear here</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = patientAppointments.map(apt => {
            const doctor = this.mockDatabase.doctors.find(d => d.id === apt.doctorId);
            return `
                <div class="appointment-card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">Appointment with Dr. ${doctor.name}</div>
                            <div class="card-subtitle">${new Date(apt.date).toLocaleDateString()} at ${apt.time}</div>
                        </div>
                        <span class="status-badge status-${apt.status}">${apt.status}</span>
                    </div>
                    <div class="card-content">
                        <p><strong>Reason:</strong> ${apt.reason}</p>
                        ${apt.notes ? `<p><strong>Notes:</strong> ${apt.notes}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    loadReports() {
        const patientReports = this.mockDatabase.reports.filter(
            report => report.patientId === this.currentUser.id
        );
        
        const container = document.getElementById('reportsList');
        if (patientReports.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-medical"></i>
                    <h3>No medical reports</h3>
                    <p>Your medical reports will appear here</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = patientReports.map(report => `
            <div class="report-card">
                <div class="card-header">
                    <div>
                        <div class="card-title">${report.title}</div>
                        <div class="card-subtitle">${new Date(report.date).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="card-content">
                    <p>${report.description.substring(0, 100)}...</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary view-report-btn" data-id="${report.id}">
                        View Report
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-report-btn').forEach(btn => {
            btn.addEventListener('click', () => this.viewReport(btn.dataset.id));
        });
    }

    loadProfile() {
        const patient = this.currentUser;
        document.getElementById('profileName').textContent = patient.name;
        document.getElementById('profileEmail').textContent = patient.email;
        document.getElementById('profilePhone').textContent = patient.phone;
        document.getElementById('profileDob').textContent = patient.dob;
        document.getElementById('profileBloodGroup').textContent = patient.bloodGroup;
        document.getElementById('profileWeight').textContent = patient.weight;
        document.getElementById('profileHeight').textContent = patient.height;
        document.getElementById('profileBMI').textContent = this.calculateBMI(patient.weight, patient.height);
        document.getElementById('profileAvatar').src = patient.image;
    }

    calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    // Appointment booking
    showBookAppointmentModal() {
        const doctorSelect = document.getElementById('appointmentDoctor');
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        
        this.mockDatabase.doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = `Dr. ${doctor.name} (${doctor.specialty}) - $${doctor.consultationFee}`;
            doctorSelect.appendChild(option);
        });
        
        document.getElementById('bookAppointmentModal').style.display = 'flex';
    }

    handleBookAppointment(e) {
        e.preventDefault();
        const formData = {
            doctorId: document.getElementById('appointmentDoctor').value,
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            reason: document.getElementById('appointmentReason').value,
            status: 'scheduled',
            patientId: this.currentUser.id,
            patientName: this.currentUser.name,
            createdAt: new Date().toISOString()
        };
        
        this.mockDatabase.appointments.push(formData);
        localStorage.setItem('mockAppointments', JSON.stringify(this.mockDatabase.appointments));
        
        alert('Appointment booked successfully! You will be informed shortly.');
        this.hideModals();
        this.loadAppointments();
    }

    // Report management
    showAddReportModal() {
        document.getElementById('addReportModal').style.display = 'flex';
    }

    handleAddReport(e) {
        e.preventDefault();
        const fileInput = document.getElementById('reportScan');
        let scanUrl = null;
        
        if (fileInput.files.length > 0) {
            scanUrl = URL.createObjectURL(fileInput.files[0]);
        }
        
        const newReport = {
            id: 'rep_' + Date.now(),
            title: document.getElementById('reportTitle').value,
            date: document.getElementById('reportDate').value,
            description: document.getElementById('reportDescription').value,
            scanUrl: scanUrl,
            patientId: this.currentUser.id,
            patientName: this.currentUser.name,
            doctorId: null, // Can be added later by doctor
            createdAt: new Date().toISOString()
        };
        
        this.mockDatabase.reports.push(newReport);
        localStorage.setItem('mockReports', JSON.stringify(this.mockDatabase.reports));
        
        alert('Report added successfully!');
        this.hideModals();
        document.getElementById('addReportForm').reset();
        this.loadReports();
    }

    viewReport(reportId) {
        const report = this.mockDatabase.reports.find(r => r.id === reportId);
        const container = document.getElementById('reportDetails');
        
        container.innerHTML = `
            <h3>${report.title}</h3>
            <p><strong>Date:</strong> ${new Date(report.date).toLocaleDateString()}</p>
            <p><strong>Description:</strong></p>
            <p>${report.description}</p>
            ${report.scanUrl ? `
                <div class="report-scan">
                    <h4>Attached Scan:</h4>
                    <iframe src="${report.scanUrl}" frameborder="0" style="width:100%; height:500px;"></iframe>
                </div>
            ` : ''}
        `;
        
        document.getElementById('viewReportModal').style.display = 'flex';
    }

    // Profile editing
    showEditProfileModal() {
        const patient = this.currentUser;
        document.getElementById('editName').value = patient.name;
        document.getElementById('editPhone').value = patient.phone;
        document.getElementById('editBloodGroup').value = patient.bloodGroup;
        document.getElementById('editWeight').value = patient.weight;
        document.getElementById('editHeight').value = patient.height;
        
        document.getElementById('editProfileModal').style.display = 'flex';
    }

    handleEditProfile(e) {
        e.preventDefault();
        this.currentUser.name = document.getElementById('editName').value;
        this.currentUser.phone = document.getElementById('editPhone').value;
        this.currentUser.bloodGroup = document.getElementById('editBloodGroup').value;
        this.currentUser.weight = document.getElementById('editWeight').value;
        this.currentUser.height = document.getElementById('editHeight').value;
        
        const newImage = this.getUploadedImage('editPhoto');
        if (newImage) {
            this.currentUser.image = newImage;
        }
        
        // Update in mock database
        const patientIndex = this.mockDatabase.patients.findIndex(p => p.id === this.currentUser.id);
        this.mockDatabase.patients[patientIndex] = this.currentUser;
        localStorage.setItem('mockPatients', JSON.stringify(this.mockDatabase.patients));
        localStorage.setItem('currentPatient', JSON.stringify(this.currentUser));
        
        alert('Profile updated successfully!');
        this.hideModals();
        this.loadProfile();
    }

    // Utility methods
    hideModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
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
        localStorage.removeItem('currentPatient');
        location.reload();
    }
}

// Initialize the portal
const patientPortal = new PatientPortal();