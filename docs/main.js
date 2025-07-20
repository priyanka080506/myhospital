// Initialize mock database if not exists
if (!localStorage.getItem('mockDatabase')) {
    const mockDatabase = {
        doctors: [
            {
                id: 'doc1',
                name: "Dr. Sarah Johnson",
                specialty: "Cardiology",
                qualification: "MD Cardiology - Harvard Medical School",
                institution: "City General Hospital",
                experience: "15 years",
                workingPlaces: [
                    {
                        name: "City General Hospital",
                        address: "123 Medical St, Health City",
                        timings: "Mon-Fri: 9AM-5PM"
                    }
                ],
                image: "https://randomuser.me/api/portraits/women/65.jpg",
                availableSlots: ["09:00", "10:00", "14:00"]
            },
            {
                id: 'doc2',
                name: "Dr. Michael Chen",
                specialty: "Neurology",
                qualification: "MD Neurology - Johns Hopkins University",
                institution: "Metro Medical Center",
                experience: "12 years",
                workingPlaces: [
                    {
                        name: "Metro Medical Center",
                        address: "456 Health Ave, Medtown",
                        timings: "Tue-Sat: 10AM-6PM"
                    }
                ],
                image: "https://randomuser.me/api/portraits/men/75.jpg",
                availableSlots: ["10:00", "11:00", "15:00"]
            }
        ],
        appointments: [],
        facilities: [
            {
                name: "Advanced Operation Theaters",
                icon: "fas fa-procedures",
                description: "State-of-the-art surgical facilities with modern equipment"
            },
            {
                name: "Digital Imaging",
                icon: "fas fa-x-ray",
                description: "High-resolution MRI, CT Scan and X-ray machines"
            }
        ]
    };
    localStorage.setItem('mockDatabase', JSON.stringify(mockDatabase));
}

// DOM Elements
const bookingModal = document.getElementById('bookingModal');
const appointmentForm = document.getElementById('appointmentForm');
const doctorSelect = document.getElementById('doctorSelect');
const doctorsList = document.getElementById('doctorsList');
const facilitiesGrid = document.querySelector('.facility-grid');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadDoctors();
    loadFacilities();
    setupEventListeners();
});

function loadDoctors() {
    const db = JSON.parse(localStorage.getItem('mockDatabase'));
    doctorsList.innerHTML = db.doctors.map(doctor => `
        <div class="doctor-card">
            <div class="doctor-image">
                <img src="${doctor.image}" alt="${doctor.name}">
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p class="specialty">${doctor.specialty}</p>
                <p class="qualification">${doctor.qualification}</p>
                <p class="institution">${doctor.institution}</p>
                <div class="working-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${doctor.workingPlaces[0].name}</p>
                    <p><i class="fas fa-clock"></i> ${doctor.workingPlaces[0].timings}</p>
                </div>
                <button class="btn btn-primary book-btn" data-id="${doctor.id}">Book Appointment</button>
            </div>
        </div>
    `).join('');

    // Populate doctor dropdown
    doctorSelect.innerHTML = '<option value="">Select Doctor</option>' + 
        db.doctors.map(doctor => `
            <option value="${doctor.id}">Dr. ${doctor.name} - ${doctor.specialty}</option>
        `).join('');
}

function loadFacilities() {
    const db = JSON.parse(localStorage.getItem('mockDatabase'));
    facilitiesGrid.innerHTML = db.facilities.map(facility => `
        <div class="facility-card">
            <i class="${facility.icon}"></i>
            <h3>${facility.name}</h3>
            <p>${facility.description}</p>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Book appointment buttons
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const doctorId = this.getAttribute('data-id');
            document.getElementById('doctorSelect').value = doctorId;
            bookingModal.style.display = 'flex';
        });
    });

    // Close modal
    document.querySelector('.close').addEventListener('click', function() {
        bookingModal.style.display = 'none';
    });

    // Appointment form submission
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        bookAppointment();
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });
}

function bookAppointment() {
    const db = JSON.parse(localStorage.getItem('mockDatabase'));
    const formData = new FormData(appointmentForm);
    
    const newAppointment = {
        id: 'appt_' + Date.now(),
        patientName: formData.get('patientName'),
        patientEmail: formData.get('patientEmail'),
        patientPhone: formData.get('patientPhone'),
        date: formData.get('appointmentDate'),
        time: formData.get('appointmentTime'),
        doctorId: formData.get('doctorSelect'),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    db.appointments.push(newAppointment);
    localStorage.setItem('mockDatabase', JSON.stringify(db));
    
    // Show success message
    alert('Appointment booked successfully! You will be informed shortly.');
    
    // Reset form and close modal
    appointmentForm.reset();
    bookingModal.style.display = 'none';
}