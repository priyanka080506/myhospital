// --- Global variables ---
let currentStep = 1;
const totalSteps = 3;

// Hardcoded data
const servicesData = [
    {
        icon: 'fas fa-heart',
        title: 'Cardiology',
        description: 'Comprehensive heart care including diagnostics, treatment, and prevention of cardiovascular diseases.',
        features: ['ECG & Echo', 'Heart Surgery', 'Preventive Care']
    },
    {
        icon: 'fas fa-brain',
        title: 'Neurology',
        description: 'Specialized care for brain, spine, and nervous system disorders with advanced treatment options.',
        features: ['Brain Imaging', 'Neurological Exams', 'Treatment Plans']
    },
    {
        icon: 'fas fa-bone',
        title: 'Orthopedics',
        description: 'Expert treatment for bone, joint, and muscle conditions with both surgical and non-surgical options.',
        features: ['Joint Replacement', 'Sports Medicine', 'Rehabilitation']
    },
    {
        icon: 'fas fa-eye',
        title: 'Surgeon',
        description: 'Wide range of surgical operations, using various techniques and tools, to address a variety of conditions.',
        features: ['3D Visualization', 'Rehabilation', 'Triage Tool']
    },
    {
        icon: 'fas fa-baby',
        title: 'Pediatrics',
        description: 'Specialized healthcare for infants, children, and adolescents with compassionate care.',
        features: ['Well-child Visits', 'Vaccinations', 'Growth Monitoring']
    },
    {
        icon: 'fas fa-stethoscope',
        title: 'Dermatology',
        description: 'Expert treatment of skin, hair and nail conditions, including cosmetics concerns.',
        features: ['Teledermatology', 'Digital grafing', 'Comparision Imaging']
    }
];

const doctorsData = [
    {
        name: 'Dr. Ajanya',
        specialty: 'Cardiology',
        experience: '4+ Years',
        rating: 4.9,
        reviews: 127,
        image: 'Ajanya.jpg.jpeg',
        education: 'Harvard Medical School',
        availability: 'Jayadeva Hospital - Mon, Wed, Fri (8AM-5PM)'
    },
    {
        name: 'Dr. Brunda',
        specialty: 'Neurology',
        experience: '6+ Years',
        rating: 4.8,
        reviews: 269,
        image: 'brunda.jpg.jpeg',
        education: 'Madras Medical College',
        availability: 'Manipal Hospital - Tue, Thu, Sat (7AM-3PM)'
    },
    {
        name: 'Dr. Ashwin',
        specialty: 'Pediatrics',
        experience: '4+ Years',
        rating: 4.9,
        reviews: 156,
        image: 'ashwin.jpg.jpeg',
        education: 'St. Johns Medical college',
        availability: 'Suraksha Hospital - Mon, Tue, Thu (8:30AM-5PM)'
    },
    {
        name: 'Dr. Madhukumar',
        specialty: 'Orthopedics',
        experience: '5+ Years',
        rating: 4.7,
        reviews: 89,
        image: 'madhukumar.jpg.jpeg',
        education: 'JSS Medical College Mysore',
        availability: 'A R Hospital - Wed, Fri, Sat'
    },
    {
        name: 'Dr. Prasanna',
        specialty: 'Surgeon',
        experience: '10+ Years',
        rating: 4.8,
        reviews: 112,
        image: 'prasanna.jpg.jpeg',
        education: 'Stanley Medical College',
        availability: 'Sigma Hospital - Mon, Wed, Fri'
    },
    {
        name: 'Dr. Adhi',
        specialty: 'Dermatology',
        experience: '4+ Years',
        rating: 4.9,
        reviews: 203,
        image: 'adhi.jpg.jpeg',
        education: 'Christian Medical College Vellore',
        availability: 'JSS Hospital - Tue, Thu, Fri'
    }
];

// --- DOM Elements ---
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const appointmentDateInput = document.getElementById('appointmentDate');
const serviceSelect = document.getElementById('service');
const doctorSelect = document.getElementById('doctor');
const summaryContent = document.getElementById('summaryContent');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuBtn = document.querySelector('.mobile-menu-btn i');
const servicesGrid = document.getElementById('servicesGrid');
const doctorsGrid = document.getElementById('doctorsGrid');

// --- UI Functions ---
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    menuBtn.className = mobileMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    menuBtn.className = 'fas fa-bars';
}

function openBookingModal() {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    populateDropdowns();
    setMinDate();
}

function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    resetForm();
}

function updateStep() {
    // Update step visibility
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });

    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 <= currentStep);
    });

    // Update buttons
    backBtn.style.display = currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
}

function nextStep() {
    if (validateCurrentStep() && currentStep < totalSteps) {
        currentStep++;
        updateStep();
        if (currentStep === totalSteps) updateSummary();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
}

// --- Form Functions ---
function validateCurrentStep() {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) alert('Please fill all required fields');
    return isValid;
}

function updateSummary() {
    const formData = new FormData(bookingForm);
    summaryContent.innerHTML = `
        <div class="summary-item">
            <span>Patient:</span>
            <span>${formData.get('firstName')} ${formData.get('lastName')}</span>
        </div>
        <div class="summary-item">
            <span>Service:</span>
            <span>${formData.get('service')}</span>
        </div>
        <div class="summary-item">
            <span>Doctor:</span>
            <span>${formData.get('doctor') || 'Any Doctor'}</span>
        </div>
        <div class="summary-item">
            <span>Date & Time:</span>
            <span>${formatDate(formData.get('appointmentDate'))} at ${formData.get('appointmentTime')}</span>
        </div>
    `;
}

function resetForm() {
    currentStep = 1;
    bookingForm.reset();
    updateStep();
}

function populateDropdowns() {
    // Services
    serviceSelect.innerHTML = '<option value="">Select a Service</option>';
    servicesData.forEach(service => {
        const option = document.createElement('option');
        option.value = service.title;
        option.textContent = service.title;
        serviceSelect.appendChild(option);
    });

    // Doctors
    doctorSelect.innerHTML = '<option value="">Any Doctor</option>';
    doctorsData.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.name;
        option.textContent = `Dr. ${doctor.name} (${doctor.specialty})`;
        doctorSelect.appendChild(option);
    });
}

// --- Content Rendering ---
function renderServices() {
    servicesGrid.innerHTML = servicesData.map(service => `
        <div class="service-card">
            <div class="service-icon"><i class="${service.icon}"></i></div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <ul>${service.features.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>
    `).join('');
}

function renderDoctors() {
    doctorsGrid.innerHTML = doctorsData.map(doctor => `
        <div class="doctor-card">
            <div class="doctor-image">
                <img src="${doctor.image}" alt="${doctor.name}">
                <div class="rating">${generateStars(doctor.rating)} (${doctor.reviews})</div>
            </div>
            <div class="doctor-info">
                <h3>${doctor.name}</h3>
                <p class="specialty">${doctor.specialty}</p>
                <p class="education"><i class="fas fa-graduation-cap"></i> ${doctor.education}</p>
                <p class="experience"><i class="fas fa-award"></i> ${doctor.experience} experience</p>
                <p class="availability"><i class="fas fa-calendar-alt"></i> ${doctor.availability}</p>
                <button class="btn btn-primary" onclick="openBookingModal()">Book Appointment</button>
            </div>
        </div>
    `).join('');
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    renderDoctors();
    setMinDate();

    // Event listeners
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Appointment booked successfully! (This is a frontend demo)');
        closeBookingModal();
    });

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) closeBookingModal();
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        header.style.background = window.scrollY > 100 ? 'rgba(255,255,255,0.95)' : '#fff';
    });
});

// Global functions
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.nextStep = nextStep;
window.previousStep = previousStep;