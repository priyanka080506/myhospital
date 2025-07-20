document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const patientDashboard = document.getElementById('patientDashboard');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const logoutBtn = document.getElementById('logoutBtn');
    const closeButtons = document.querySelectorAll('.close');
    
    // Navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Mock user data storage
    const users = JSON.parse(localStorage.getItem('portalUsers')) || [];
    
    // Initialize modals
    loginModal.style.display = 'flex';
    registerModal.style.display = 'none';
    patientDashboard.style.display = 'none';
    
    // Switch between login and register forms
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
    });
    
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });
    
    // Close modal buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Find user in mock database
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store current user in session
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Hide modals and show dashboard
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            patientDashboard.style.display = 'block';
            
            // Load user data
            loadUserData(user);
            loadMockAppointments();
            loadMockReports();
        } else {
            alert('Invalid email or password');
        }
    });
    
    // Registration form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newUser = {
            id: Date.now().toString(),
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            phone: document.getElementById('regPhone').value,
            dob: document.getElementById('regDob').value,
            bloodGroup: document.getElementById('regBloodGroup').value,
            weight: document.getElementById('regWeight').value,
            height: document.getElementById('regHeight').value,
            photo: null
        };
        
        // Handle profile photo upload
        const photoInput = document.getElementById('regPhoto');
        if (photoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) {
                newUser.photo = e.target.result;
                completeRegistration(newUser);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            completeRegistration(newUser);
        }
    });
    
    function completeRegistration(user) {
        // Add new user to mock database
        users.push(user);
        localStorage.setItem('portalUsers', JSON.stringify(users));
        
        // Store current user in session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Hide modals and show dashboard
        registerModal.style.display = 'none';
        loginModal.style.display = 'none';
        patientDashboard.style.display = 'block';
        
        // Load user data
        loadUserData(user);
        loadMockAppointments();
        loadMockReports();
        
        alert('Registration successful!');
    }
    
    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        patientDashboard.style.display = 'none';
        loginModal.style.display = 'flex';
        
        // Clear login form
        loginForm.reset();
    });
    
    // Load user data into dashboard
    function loadUserData(user) {
        // Set user info in header
        document.getElementById('userName').textContent = user.name;
        document.getElementById('profileName').textContent = user.name;
        
        // Set profile image if available
        if (user.photo) {
            document.getElementById('userAvatar').src = user.photo;
            document.getElementById('profileAvatar').src = user.photo;
        } else {
            // Default avatar
            const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
            document.getElementById('userAvatar').src = defaultAvatar;
            document.getElementById('profileAvatar').src = defaultAvatar;
        }
        
        // Set profile details
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profilePhone').textContent = user.phone;
        document.getElementById('profileDob').textContent = new Date(user.dob).toLocaleDateString();
        document.getElementById('profileBloodGroup').textContent = user.bloodGroup;
        document.getElementById('profileWeight').textContent = user.weight;
        document.getElementById('profileHeight').textContent = user.height;
        
        // Calculate BMI
        const heightInMeters = user.height / 100;
        const bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
        document.getElementById('profileBMI').textContent = bmi;
    }
    
    // Dashboard navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Load mock appointments data
    function loadMockAppointments() {
        const appointmentsList = document.getElementById('appointmentsList');
        appointmentsList.innerHTML = '';
        
        const mockAppointments = [
            {
                id: '1',
                doctor: 'Dr. Sarah Johnson',
                specialty: 'Cardiology',
                date: '2023-06-15',
                time: '10:00 AM',
                status: 'Confirmed'
            },
            {
                id: '2',
                doctor: 'Dr. Michael Chen',
                specialty: 'Dermatology',
                date: '2023-06-20',
                time: '2:30 PM',
                status: 'Pending'
            }
        ];
        
        if (mockAppointments.length === 0) {
            appointmentsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No appointments scheduled</h3>
                    <p>Your upcoming appointments will appear here</p>
                </div>
            `;
        } else {
            mockAppointments.forEach(appt => {
                const appointmentElement = document.createElement('div');
                appointmentElement.className = 'appointment-card';
                appointmentElement.innerHTML = `
                    <div class="appointment-info">
                        <h4>${appt.doctor} <span>(${appt.specialty})</span></h4>
                        <p><i class="fas fa-calendar-alt"></i> ${appt.date} at ${appt.time}</p>
                        <span class="status-badge ${appt.status.toLowerCase()}">${appt.status}</span>
                    </div>
                    <button class="btn btn-secondary">Details</button>
                `;
                appointmentsList.appendChild(appointmentElement);
            });
        }
    }
    
    // Load mock reports data
    function loadMockReports() {
        const reportsList = document.getElementById('reportsList');
        reportsList.innerHTML = '';
        
        const mockReports = [
            {
                id: '1',
                title: 'Blood Test Results',
                date: '2023-05-10',
                type: 'Lab Report'
            },
            {
                id: '2',
                title: 'X-Ray Scan',
                date: '2023-04-22',
                type: 'Radiology'
            }
        ];
        
        if (mockReports.length === 0) {
            reportsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-medical"></i>
                    <h3>No medical reports</h3>
                    <p>Your medical reports will appear here</p>
                </div>
            `;
        } else {
            mockReports.forEach(report => {
                const reportElement = document.createElement('div');
                reportElement.className = 'report-card';
                reportElement.innerHTML = `
                    <div class="report-info">
                        <h4>${report.title}</h4>
                        <p><i class="fas fa-calendar-alt"></i> ${report.date} • ${report.type}</p>
                    </div>
                    <button class="btn btn-secondary">View</button>
                `;
                reportsList.appendChild(reportElement);
            });
        }
    }
    
    // Check if user is already logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
        patientDashboard.style.display = 'block';
        loadUserData(currentUser);
        loadMockAppointments();
        loadMockReports();
    }
});