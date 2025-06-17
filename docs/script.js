// Global variables
let currentStep = 1;
const totalSteps = 3;

// Services data
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
        title: 'Ophthalmology',
        description: 'Complete eye care services from routine exams to advanced surgical procedures.',
        features: ['Eye Exams', 'LASIK Surgery', 'Retinal Care']
    },
    {
        icon: 'fas fa-baby',
        title: 'Pediatrics',
        description: 'Specialized healthcare for infants, children, and adolescents with compassionate care.',
        features: ['Well-child Visits', 'Vaccinations', 'Growth Monitoring']
    },
    {
        icon: 'fas fa-stethoscope',
        title: 'General Medicine',
        description: 'Primary care services for adults including preventive care and chronic disease management.',
        features: ['Annual Checkups', 'Chronic Care', 'Health Screenings']
    }
];

// Doctors data
const doctorsData = [
    {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        experience: '15+ Years',
        rating: 4.9,
        reviews: 127,
        image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400',
        education: 'Harvard Medical School',
        availability: 'Mon, Wed, Fri'
    },
    {
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        experience: '12+ Years',
        rating: 4.8,
        reviews: 98,
        image: 'https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=400',
        education: 'Johns Hopkins University',
        availability: 'Tue, Thu, Sat'
    },
    {
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrics',
        experience: '10+ Years',
        rating: 4.9,
        reviews: 156,
        image: 'https://images.pexels.com/photos/5407205/pexels-photo-5407205.jpeg?auto=compress&cs=tinysrgb&w=400',
        education: 'Stanford University',
        availability: 'Mon, Tue, Thu'
    },
    {
        name: 'Dr. James Wilson',
        specialty: 'Orthopedics',
        experience: '18+ Years',
        rating: 4.7,
        reviews: 89,
        image: 'https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg?auto=compress&cs=tinysrgb&w=400',
        education: 'Yale School of Medicine',
        availability: 'Wed, Fri, Sat'
    },
    {
        name: 'Dr. Lisa Thompson',
        specialty: 'Ophthalmology',
        experience: '14+ Years',
        rating: 4.8,
        reviews: 112,
        image: 'https://images.pexels.com/photos/5407204/pexels-photo-5407204.jpeg?auto=compress&cs=tinysrgb&w=400',
        education: 'Mayo Clinic School of Medicine',
        availability: 'Mon, Wed, Fri'
    },
    {
        name: 'Dr. Robert Kumar',
        specialty: 'General Medicine',
        experience: '20+ Years',
        rating: 4.9,
        reviews: 203,
        image: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=400',
        education: 'University of Pennsylvania',
        availability: 'Tue, Thu, Fri'
    }
];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeServices();
    initializeDoctors('patients'); // Initialize for patient view
    initializeDoctors('doctors'); // Initialize for doctor view
    initializeForm();
    initializeSmoothScrolling();
    setMinDate();
    // Ensure the patient view is active on load
    showView('patient-view');
});

// Function to switch between views
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active-view');
    });
    document.getElementById(viewId).classList.add('active-view');

    // Adjust scroll behavior for fixed header if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile menu if open
    closeMobileMenu();
}


// Initialize services section
function initializeServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    
    // Clear existing content to prevent duplication on re-initialization if any
    servicesGrid.innerHTML = ''; 

    servicesData.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        
        serviceCard.innerHTML = `
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <ul class="service-features">
                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
        
        servicesGrid.appendChild(serviceCard);
    });
}

// Initialize doctors section
function initializeDoctors(targetView) {
    const doctorsGrid = document.getElementById(targetView === 'patients' ? 'doctorsGrid' : 'doctorsViewGrid');
    
    // Clear existing content to prevent duplication on re-initialization
    doctorsGrid.innerHTML = '';

    doctorsData.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        
        const stars = generateStars(doctor.rating);
        
        // Conditional button for patient vs doctor view
        const buttonHtml = targetView === 'patients' ? 
            `<button class="btn btn-primary" onclick="openBookingModal()">Book Appointment</button>` :
            `<button class="btn btn-outline">View Profile</button>`;

        doctorCard.innerHTML = `
            <div class="doctor-image">
                <img src="${doctor.image}" alt="${doctor.name}">
                <div class="doctor-rating">
                    <i class="fas fa-star star"></i>
                    <span>${doctor.rating}</span>
                </div>
            </div>
            <div class="doctor-info">
                <h3 class="doctor-name">${doctor.name}</h3>
                <p class="doctor-specialty">${doctor.specialty}</p>
                <div class="doctor-details">
                    <div class="doctor-detail">
                        <i class="fas fa-graduation-cap"></i>
                        <span>${doctor.education}</span>
                    </div>
                    <div class="doctor-detail">
                        <i class="fas fa-award"></i>
                        <span>${doctor.experience} Experience</span>
                    </div>
                    <div class="doctor-detail">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Available: ${doctor.availability}</span>
                    </div>
                </div>
                <div class="doctor-reviews">
                    <div class="stars">
                        ${stars}
                    </div>
                    <span class="review-count">(${doctor.reviews} reviews)</span>
                </div>
                ${buttonHtml}
            </div>
        `;
        
        doctorsGrid.appendChild(doctorCard);
    });
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star star filled"></i>';
        } else {
            stars += '<i class="fas fa-star star"></i>';
        }
    }
    return stars;
}

// Mobile menu functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    mobileMenu.classList.toggle('active');
    
    if (mobileMenu.classList.contains('active')) {
        menuBtn.className = 'fas fa-times';
    } else {
        menuBtn.className = 'fas fa-bars';
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    mobileMenu.classList.remove('active');
    menuBtn.className = 'fas fa-bars';
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Modal functions
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    resetForm();
}

// Close modal when clicking outside
document.getElementById('bookingModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeBookingModal();
    }
});

// Form functions
function initializeForm() {
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Add input event listeners for real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', validateCurrentStep);
    });
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').setAttribute('min', today);
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep();
            if (currentStep === 3) {
                updateSummary();
            }
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStep();
    }
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
    
    document.querySelectorAll('.progress-line').forEach((line, index) => {
        line.classList.toggle('active', index + 1 < currentStep);
    });
    
    // Update buttons
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    backBtn.style.display = currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none';
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none';
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
    }
    
    return isValid;
}

function updateSummary() {
    const formData = new FormData(document.getElementById('bookingForm'));
    const summaryContent = document.getElementById('summaryContent');
    
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const service = formData.get('service');
    const doctor = formData.get('doctor');
    const appointmentDate = formData.get('appointmentDate');
    const appointmentTime = formData.get('appointmentTime');
    
    summaryContent.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Patient:</span>
            <span class="summary-value">${firstName} ${lastName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Service:</span>
            <span class="summary-value">${service}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Doctor:</span>
            <span class="summary-value">${doctor}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Date & Time:</span>
            <span class="summary-value">${formatDate(appointmentDate)} at ${appointmentTime}</span>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateCurrentStep()) {
        // Simulate form submission
        alert('Appointment booked successfully! We will contact you shortly to confirm.');
        closeBookingModal();
    }
}

function resetForm() {
    currentStep = 1;
    document.getElementById('bookingForm').reset();
    updateStep();
    
    // Reset input border colors
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.style.borderColor = '#e2e8f0';
    });
}

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'white';
        header.style.backdropFilter = 'none';
    }
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});