class DoctorPortal {
    constructor() {
        this.mockDatabase = {
            doctors: JSON.parse(localStorage.getItem('mockDoctors')) || [],
            patients: JSON.parse(localStorage.getItem('mockPatients')) || [],
            appointments: JSON.parse(localStorage.getItem('mockAppointments')) || [],
            reports: JSON.parse(localStorage.getItem('mockReports')) || []
        };
        
        this.currentDoctor = JSON.parse(localStorage.getItem('currentDoctor')) || null;
        this.init();
    }

    init() {
        if (this.currentDoctor) {
            this.showDashboard();
            this.loadDoctorData();
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
        document.getElementById('createReportBtn').addEventListener('click', () => this.showCreateReportModal());
        document.getElementById('editProfileBtn').addEventListener('click', () => this.showEditProfileModal());
        
        // Working places
        document.getElementById('addWorkingPlaceBtn').addEventListener('click', () => this.addWorkingPlace());
        document.getElementById('addEditWorkingPlaceBtn').addEventListener('click', () => this.addEditWorkingPlace());
        
        // Form submissions
        document.getElementById('createReportForm').addEventListener('submit', (e) => this.handleCreateReport(e));
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
        
        const doctor = this.mockDatabase.doctors.find(d => d.email === email && d.password === password);
        
        if (doctor) {
            this.currentDoctor = doctor;
            localStorage.setItem('currentDoctor', JSON.stringify(doctor));
            this.showDashboard();
            this.loadDoctorData();
            alert('Login successful!');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const workingPlaces = this.collectWorkingPlaces('workingPlacesContainer');
        
        const newDoctor = {
            id: 'doc_' + Date.now(),
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            phone: document.getElementById('regPhone').value,
            specialty: document.getElementById('regSpecialty').value,
            qualification: document.getElementById('regQualification').value,
            experience: document.getElementById('regExperience').value,
            consultationFee: document.getElementById('regFee').value,
            workingPlaces: workingPlaces,
            image: this.getUploadedImage('regPhoto') || "https://randomuser.me/api/portraits/" + 
                  (Math.random() > 0.5 ? "men" : "women") + 
                  "/" + Math.floor(Math.random() * 100) + ".jpg",
            availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00"]
        };
        
        this.mockDatabase.doctors.push(newDoctor);
        localStorage.setItem('mockDoctors', JSON.stringify(this.mockDatabase.doctors));
        
        this.currentDoctor = newDoctor;
        localStorage.setItem('currentDoctor', JSON.stringify(newDoctor));
        
        alert('Registration successful!');
        this.showDashboard();
        this.loadDoctorData();
    }

    collectWorkingPlaces(containerId) {
        const places = [];
        const containers = document.querySelectorAll(`#${containerId} .working-place`);
        
        containers.forEach(container => {
            const name = container.querySelector('.place-name').value;
            const address = container.querySelector('.place-address').value;
            const timings = container.querySelector('.place-timings').value;
            
            if (name && address && timings) {
                places.push({
                    name: name,
                    address: address,
                    timings: timings
                });
            }
        });
        
        return places;
    }

    // Dashboard methods
    showDashboard() {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('registerModal').style.display = 'none';
        document.getElementById('doctorDashboard').style.display = 'block';
        
        // Update doctor info in header
        document.getElementById('doctorName').textContent = `Dr. ${this.currentDoctor.name}`;
        document.getElementById('doctorAvatar').src = this.currentDoctor.image;
    }

    loadDoctorData() {
        this.loadSchedules();
        this.loadReports();
        this.loadProfile();
    }

    loadSchedules() {
        const doctorAppointments = this.mockDatabase.appointments.filter(
            apt => apt.doctorId === this.currentDoctor.id
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const container = document.getElementById('schedulesList');
        if (doctorAppointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No appointments scheduled</h3>
                    <p>Your upcoming appointments will appear here</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = doctorAppointments.map(apt => {
            const patient = this.mockDatabase.patients.find(p => p.id === apt.patientId);
            return `
                <div class="appointment-card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">Appointment with ${patient.name}</div>
                            <div class="card-subtitle">${new Date(apt.date).toLocaleDateString()} at ${apt.time}</div>
                        </div>
                        <span class="status-badge status-${apt.status}">${apt.status}</span>
                    </div>
                    <div class="card-content">
                        <p><strong>Reason:</strong> ${apt.reason}</p>
                        ${apt.notes ? `<p><strong>Notes:</strong> ${apt.notes}</p>` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary complete-appointment-btn" data-id="${apt.id}">
                            Mark as Completed
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners to complete buttons
        document.querySelectorAll('.complete-appointment-btn').forEach(btn => {
            btn.addEventListener('click', () => this.completeAppointment(btn.dataset.id));
        });
    }

    loadReports() {
        const doctorReports = this.mockDatabase.reports.filter(
            report => report.doctorId === this.currentDoctor.id
        ).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const container = document.getElementById('reportsList');
        if (doctorReports.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-medical"></i>
                    <h3>No patient reports</h3>
                    <p>Reports you create will appear here</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = doctorReports.map(report => {
            const patient = this.mockDatabase.patients.find(p => p.id === report.patientId);
            return `
                <div class="report-card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">${report.title}</div>
                            <div class="card-subtitle">${patient.name} • ${new Date(report.date).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="card-content">
                        <p>${report.diagnosis.substring(0, 100)}...</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary view-report-btn" data-id="${report.id}">
                            View Report
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-report-btn').forEach(btn => {
            btn.addEventListener('click', () => this.viewReport(btn.dataset.id));
        });
    }

    loadProfile() {
        const doctor = this.currentDoctor;
        document.getElementById('profileDoctorName').textContent = `Dr. ${doctor.name}`;
        document.getElementById('profileSpecialty').textContent = doctor.specialty;
        document.getElementById('profileDoctorEmail').textContent = doctor.email;
        document.getElementById('profileDoctorPhone').textContent = doctor.phone;
        document.getElementById('profileQualification').textContent = doctor.qualification;
        document.getElementById('profileExperience').textContent = doctor.experience;
        document.getElementById('profileFee').textContent = `$${doctor.consultationFee}`;
        document.getElementById('profileDoctorAvatar').src = doctor.image;
        
        // Load working places
        const placesContainer = document.getElementById('workingPlacesList');
        placesContainer.innerHTML = doctor.workingPlaces.map(place => `
            <div class="working-place-item">
                <h4>${place.name}</h4>
                <p>${place.address}</p>
                <p><strong>Timings:</strong> ${place.timings}</p>
            </div>
        `).join('');
    }

    // Report management
    showCreateReportModal() {
        const patientSelect = document.getElementById('reportPatient');
        patientSelect.innerHTML = '<option value="">Select Patient</option>';
        
        this.mockDatabase.patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = patient.name;
            patientSelect.appendChild(option);
        });
        
        document.getElementById('createReportModal').style.display = 'flex';
    }

    handleCreateReport(e) {
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
            diagnosis: document.getElementById('reportDiagnosis').value,
            prescription: document.getElementById('reportPrescription').value,
            scanUrl: scanUrl,
            patientId: document.getElementById('reportPatient').value,
            patientName: document.getElementById('reportPatient').selectedOptions[0].text,
            doctorId: this.currentDoctor.id,
            doctorName: this.currentDoctor.name,
            createdAt: new Date().toISOString()
        };
        
        this.mockDatabase.reports.push(newReport);
        localStorage.setItem('mockReports', JSON.stringify(this.mockDatabase.reports));
        
        alert('Report created successfully!');
        this.hideModals();
        document.getElementById('createReportForm').reset();
        this.loadReports();
    }

    viewReport(reportId) {
        const report = this.mockDatabase.reports.find(r => r.id === reportId);
        const patient = this.mockDatabase.patients.find(p => p.id === report.patientId);
        const container = document.getElementById('reportDetails');
        
        container.innerHTML = `
            <h3>${report.title}</h3>
            <p><strong>Patient:</strong> ${patient.name}</p>
            <p><strong>Date:</strong> ${new Date(report.date).toLocaleDateString()}</p>
            <div class="report-section">
                <h4>Diagnosis:</h4>
                <p>${report.diagnosis}</p>
            </div>
            ${report.prescription ? `
                <div class="report-section">
                    <h4>Prescription:</h4>
                    <p>${report.prescription}</p>
                </div>
            ` : ''}
            ${report.scanUrl ? `
                <div class="report-section">
                    <h4>Attached Scan:</h4>
                    ${report.scanUrl.endsWith('.pdf') ? 
                        `<iframe src="${report.scanUrl}" style="width:100%; height:500px;"></iframe>` :
                        `<img src="${report.scanUrl}" style="max-width:100%; max-height:500px;">`}
                </div>
            ` : ''}
        `;
        
        document.getElementById('viewReportModal').style.display = 'flex';
    }

    // Appointment management
    completeAppointment(appointmentId) {
        const appointment = this.mockDatabase.appointments.find(a => a.id === appointmentId);
        if (appointment) {
            appointment.status = 'completed';
            localStorage.setItem('mockAppointments', JSON.stringify(this.mockDatabase.appointments));
            this.loadSchedules();
            alert('Appointment marked as completed!');
        }
    }

    // Working places management
    addWorkingPlace() {
        const container = document.getElementById('workingPlacesContainer');
        const div = document.createElement('div');
        div.className = 'working-place';
        div.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <input type="text" class="place-name" placeholder="Hospital/Clinic Name" required>
                </div>
                <div class="form-group">
                    <input type="text" class="place-address" placeholder="Address" required>
                </div>
            </div>
            <div class="form-group">
                <input type="text" class="place-timings" placeholder="Working Timings (e.g. Mon-Fri 9AM-5PM)" required>
            </div>
            <button type="button" class="btn btn-secondary remove-place-btn">
                <i class="fas fa-times"></i> Remove
            </button>
        `;
        container.appendChild(div);
        
        div.querySelector('.remove-place-btn').addEventListener('click', () => div.remove());
    }

    addEditWorkingPlace() {
        const container = document.getElementById('editWorkingPlacesContainer');
        const div = document.createElement('div');
        div.className = 'working-place';
        div.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <input type="text" class="place-name" placeholder="Hospital/Clinic Name" required>
                </div>
                <div class="form-group">
                    <input type="text" class="place-address" placeholder="Address" required>
                </div>
            </div>
            <div class="form-group">
                <input type="text" class="place-timings" placeholder="Working Timings (e.g. Mon-Fri 9AM-5PM)" required>
            </div>
            <button type="button" class="btn btn-secondary remove-place-btn">
                <i class="fas fa-times"></i> Remove
            </button>
        `;
        container.appendChild(div);
        
        div.querySelector('.remove-place-btn').addEventListener('click', () => div.remove());
    }

    // Profile editing
    showEditProfileModal() {
        const doctor = this.currentDoctor;
        document.getElementById('editName').value = doctor.name;
        document.getElementById('editPhone').value = doctor.phone;
        document.getElementById('editSpecialty').value = doctor.specialty;
        document.getElementById('editQualification').value = doctor.qualification;
        document.getElementById('editExperience').value = doctor.experience;
        document.getElementById('editFee').value = doctor.consultationFee;
        
        // Load working places
        const container = document.getElementById('editWorkingPlacesContainer');
        container.innerHTML = '';
        doctor.workingPlaces.forEach(place => {
            const div = document.createElement('div');
            div.className = 'working-place';
            div.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" class="place-name" value="${place.name}" required>
                    </div>
                    <div class="form-group">
                        <input type="text" class="place-address" value="${place.address}" required>
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" class="place-timings" value="${place.timings}" required>
                </div>
                <button type="button" class="btn btn-secondary remove-place-btn">
                    <i class="fas fa-times"></i> Remove
                </button>
            `;
            container.appendChild(div);
            div.querySelector('.remove-place-btn').addEventListener('click', () => div.remove());
        });
        
        document.getElementById('editProfileModal').style.display = 'flex';
    }

    handleEditProfile(e) {
        e.preventDefault();
        const workingPlaces = this.collectWorkingPlaces('editWorkingPlacesContainer');
        
        this.currentDoctor.name = document.getElementById('editName').value;
        this.currentDoctor.phone = document.getElementById('editPhone').value;
        this.currentDoctor.specialty = document.getElementById('editSpecialty').value;
        this.currentDoctor.qualification = document.getElementById('editQualification').value;
        this.currentDoctor.experience = document.getElementById('editExperience').value;
        this.currentDoctor.consultationFee = document.getElementById('editFee').value;
        this.currentDoctor.workingPlaces = workingPlaces;
        
        const newImage = this.getUploadedImage('editPhoto');
        if (newImage) {
            this.currentDoctor.image = newImage;
        }
        
        // Update in mock database
        const doctorIndex = this.mockDatabase.doctors.findIndex(d => d.id === this.currentDoctor.id);
        this.mockDatabase.doctors[doctorIndex] = this.currentDoctor;
        localStorage.setItem('mockDoctors', JSON.stringify(this.mockDatabase.doctors));
        localStorage.setItem('currentDoctor', JSON.stringify(this.currentDoctor));
        
        alert('Profile updated successfully!');
        this.hideModals();
        this.loadProfile();
    }

    // Utility methods
    getUploadedImage(inputId) {
        const fileInput = document.getElementById(inputId);
        if (fileInput.files.length > 0) {
            return URL.createObjectURL(fileInput.files[0]);
        }
        return null;
    }

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
        localStorage.removeItem('currentDoctor');
        location.reload();
    }
}

// Initialize the portal
const doctorPortal = new DoctorPortal();