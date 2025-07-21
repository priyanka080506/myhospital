// Authentication and registration handling

// Mock data for development
let users = {
    patients: [
        {
            id: 1,
            email: 'patient@demo.com',
            password: 'password',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1-555-0123',
            dateOfBirth: '1990-05-15',
            bloodGroup: 'A+',
            gender: 'male',
            weight: 75,
            height: 175,
            address: '123 Main St, City, State 12345',
            profilePicture: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
            id: 2,
            email: 'jane@demo.com',
            password: 'password',
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '+1-555-0124',
            dateOfBirth: '1985-08-22',
            bloodGroup: 'B+',
            gender: 'female',
            weight: 65,
            height: 165,
            address: '456 Oak Ave, City, State 12345',
            profilePicture: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300'
        }
    ],
    doctors: [
        {
            id: 1,
            email: 'doctor@demo.com',
            password: 'password',
            firstName: 'Dr. Sarah',
            lastName: 'Johnson',
            phone: '+1-555-0125',
            specialization: 'cardiology',
            degree: 'MBBS, MD',
            institution: 'Johns Hopkins University',
            experience: 15,
            consultationFee: 150,
            workingPlace: 'City General Hospital',
            workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            startTime: '09:00',
            endTime: '17:00',
            bio: 'Experienced cardiologist with a focus on preventive cardiology and heart disease management.',
            profilePicture: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
            id: 2,
            email: 'michael@demo.com',
            password: 'password',
            firstName: 'Dr. Michael',
            lastName: 'Chen',
            phone: '+1-555-0126',
            specialization: 'orthopedics',
            degree: 'MBBS, MS',
            institution: 'Harvard Medical School',
            experience: 12,
            consultationFee: 200,
            workingPlace: 'Orthopedic Specialty Clinic',
            workingDays: ['monday', 'tuesday', 'wednesday', 'thursday'],
            startTime: '08:00',
            endTime: '16:00',
            bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement.',
            profilePicture: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
            id: 3,
            email: 'emily@demo.com',
            password: 'password',
            firstName: 'Dr. Emily',
            lastName: 'Rodriguez',
            phone: '+1-555-0127',
            specialization: 'pediatrics',
            degree: 'MBBS, MD',
            institution: 'Stanford University',
            experience: 8,
            consultationFee: 120,
            workingPlace: 'Children\'s Medical Center',
            workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            startTime: '10:00',
            endTime: '18:00',
            bio: 'Pediatrician with expertise in child development and pediatric preventive care.',
            profilePicture: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
            id: 4,
            email: 'james@demo.com',
            password: 'password',
            firstName: 'Dr. James',
            lastName: 'Wilson',
            phone: '+1-555-0128',
            specialization: 'internal-medicine',
            degree: 'MBBS, MD',
            institution: 'Mayo Clinic College',
            experience: 20,
            consultationFee: 180,
            workingPlace: 'Metro Health Center',
            workingDays: ['monday', 'wednesday', 'friday'],
            startTime: '09:00',
            endTime: '17:00',
            bio: 'Internal medicine specialist with focus on diabetes and chronic disease management.',
            profilePicture: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300'
        }
    ]
};

// Save to localStorage
function saveUsers() {
    localStorage.setItem('medicare_users', JSON.stringify(users));
}

// Load from localStorage
function loadUsers() {
    const stored = localStorage.getItem('medicare_users');
    if (stored) {
        users = JSON.parse(stored);
    }
}

// Initialize users data
loadUsers();

// Patient Login
document.addEventListener('DOMContentLoaded', function() {
    const patientLoginForm = document.getElementById('patient-login-form');
    if (patientLoginForm) {
        patientLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const patient = users.patients.find(p => p.email === email && p.password === password);
            
            if (patient) {
                localStorage.setItem('current_user', JSON.stringify({ type: 'patient', data: patient }));
                window.location.href = 'patient-dashboard.html';
            } else {
                alert('Invalid email or password!');
            }
        });
    }

    // Doctor Login
    const doctorLoginForm = document.getElementById('doctor-login-form');
    if (doctorLoginForm) {
        doctorLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const doctor = users.doctors.find(d => d.email === email && d.password === password);
            
            if (doctor) {
                localStorage.setItem('current_user', JSON.stringify({ type: 'doctor', data: doctor }));
                window.location.href = 'doctor-dashboard.html';
            } else {
                alert('Invalid email or password!');
            }
        });
    }

    // Patient Registration
    const patientRegisterForm = document.getElementById('patient-register-form');
    if (patientRegisterForm) {
        patientRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(patientRegisterForm);
            const patientData = {
                id: users.patients.length + 1,
                email: formData.get('email'),
                password: formData.get('password'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                phone: formData.get('phone'),
                dateOfBirth: formData.get('dateOfBirth'),
                bloodGroup: formData.get('bloodGroup'),
                gender: formData.get('gender'),
                weight: parseFloat(formData.get('weight')),
                height: parseInt(formData.get('height')),
                address: formData.get('address'),
                profilePicture: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300'
            };
            
            // Check if email already exists
            if (users.patients.some(p => p.email === patientData.email) || 
                users.doctors.some(d => d.email === patientData.email)) {
                alert('Email already exists!');
                return;
            }
            
            users.patients.push(patientData);
            saveUsers();
            
            alert('Registration successful! Please login.');
            window.location.href = 'patient-login.html';
        });
    }

    // Doctor Registration
    const doctorRegisterForm = document.getElementById('doctor-register-form');
    if (doctorRegisterForm) {
        doctorRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(doctorRegisterForm);
            const workingDays = Array.from(doctorRegisterForm.querySelectorAll('input[name="workingDays"]:checked'))
                .map(cb => cb.value);
            
            const doctorData = {
                id: users.doctors.length + 1,
                email: formData.get('email'),
                password: formData.get('password'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                phone: formData.get('phone'),
                specialization: formData.get('specialization'),
                degree: formData.get('degree'),
                institution: formData.get('institution'),
                experience: parseInt(formData.get('experience')),
                consultationFee: parseInt(formData.get('consultationFee')),
                workingPlace: formData.get('workingPlace'),
                licenseId: formData.get('licenseId'),
                workingDays: workingDays,
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                bio: formData.get('bio') || '',
                profilePicture: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=300'
            };
            
            // Check if email already exists
            if (users.patients.some(p => p.email === doctorData.email) || 
                users.doctors.some(d => d.email === doctorData.email)) {
                alert('Email already exists!');
                return;
            }
            
            users.doctors.push(doctorData);
            saveUsers();
            
            alert('Registration successful! Please login.');
            window.location.href = 'doctor-login.html';
        });
    }
});

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('current_user');
    return userData ? JSON.parse(userData) : null;
}

// Logout
function logout() {
    localStorage.removeItem('current_user');
    window.location.href = 'index.html';
}

// Get all doctors (for patient dashboard)
function getAllDoctors() {
    return users.doctors;
}

// Get all patients (for doctor dashboard)
function getAllPatients() {
    return users.patients;
}

// Update user data
function updateUserData(userData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    if (currentUser.type === 'patient') {
        const index = users.patients.findIndex(p => p.id === currentUser.data.id);
        if (index !== -1) {
            users.patients[index] = { ...users.patients[index], ...userData };
            currentUser.data = users.patients[index];
            localStorage.setItem('current_user', JSON.stringify(currentUser));
            saveUsers();
            return true;
        }
    } else if (currentUser.type === 'doctor') {
        const index = users.doctors.findIndex(d => d.id === currentUser.data.id);
        if (index !== -1) {
            users.doctors[index] = { ...users.doctors[index], ...userData };
            currentUser.data = users.doctors[index];
            localStorage.setItem('current_user', JSON.stringify(currentUser));
            saveUsers();
            return true;
        }
    }
    
    return false;
}