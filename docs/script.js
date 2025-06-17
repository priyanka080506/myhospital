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

// Initialize the website when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeServices();
    initializeDoctors('patients'); // Initialize for the patient-facing doctor grid
    initializeDoctors('doctors'); // Initialize for the doctor-portal's doctor grid
    initializeForm();
    initializeSmoothScrolling();
    setMinDate();
    // Ensure the patient view is active by default on page load
    showView('patient-view'); 
});

// Function to switch between patient and doctor views
function showView(viewId) {
    // Hide all view sections first
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active-view');
    });
    // Show the requested view
    document.getElementById(viewId).classList.add('active-view');

    // Scroll to the top of the newly activated view for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile menu if it was open
    closeMobileMenu();
}

// Dynamically populate the services section
function initializeServices() {
    const servicesGrid = document.getElementById('servicesGrid');
    
    // Clear any existing content to prevent duplication if called multiple times
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

// Dynamically populate the doctors sections based on the target view
function initializeDoctors(targetView) {
    // Determine which doctor grid to populate based on the targetView parameter
    const doctorsGrid = document.getElementById(targetView === 'patients' ? 'doctorsGrid' : 'doctorsViewGrid');
    
    // Clear any existing content to prevent duplication
    doctorsGrid.innerHTML = '';

    doctorsData.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        
        const stars = generateStars(doctor.rating);
        
        // Customize the button on the doctor card based on the active view
        // Patients view: "Book Appointment" button that opens the modal
        // Doctors view: "View Profile" button (placeholder for doctor-specific action)
        const buttonHtml = targetView === 'patients' ? 
            `<button class="btn btn-primary" onclick="openBookingModal()">Book Appointment</button>` :
            `<button class="btn btn-outline">View Profile</button>`; // Or other doctor-specific action

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

// Helper function to generate star rating HTML for doctor cards
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        // Add 'filled' class for stars up to the doctor's rating
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star star filled"></i>';
        } else {
            stars += '<i class="fas fa-star star"></i>';
        }
    }
    return stars;
}

// Toggle mobile menu visibility and icon
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    mobileMenu.classList.toggle('active'); // Toggle 'active' class for visibility
    
    // Change menu icon based on its state
    if (mobileMenu.classList.contains('active')) {
        menuBtn.className = 'fas fa-times'; // Change to 'X' icon
    } else {
        menuBtn.className = 'fas fa-bars'; // Change back to hamburger icon
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    mobileMenu.classList.remove('active'); // Remove 'active' class to hide
    menuBtn.className = 'fas fa-bars'; // Ensure hamburger icon is displayed
}

// Initialize smooth scrolling for all internal anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default jump behavior
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight; // Get fixed header height
                const targetPosition = target.offsetTop - headerHeight; // Adjust scroll position
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth' // Smooth scroll animation
                });
            }
        });
    });
}

// Open the appointment booking modal
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active'); // Show modal
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close the appointment booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active'); // Hide modal
    document.body.style.overflow = 'auto'; // Allow background scrolling
    
    resetForm(); // Reset form state when modal closes
}

// Close modal when clicking on the overlay itself
document.getElementById('bookingModal').addEventListener('click', function(e) {
    if (e.target === this) { // Check if the click target is the overlay itself
        closeBookingModal();
    }
});

// Initialize form submission and input validation listeners
function initializeForm() {
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', handleFormSubmit); // Handle form submission
    
    // Add input event listeners for real-time validation feedback
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', validateCurrentStep);
    });
}

// Set the minimum date for the appointment date input to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    document.getElementById('appointmentDate').setAttribute('min', today);
}

// Navigate to the next step in the multi-step form
function nextStep() {
    if (validateCurrentStep()) { // Only proceed if current step is valid
        if (currentStep < totalSteps) {
            currentStep++; // Increment step
            updateStep(); // Update UI
            if (currentStep === 3) {
                updateSummary(); // Populate summary on the final step
            }
        }
    }
}

// Navigate to the previous step in the multi-step form
function previousStep() {
    if (currentStep > 1) {
        currentStep--; // Decrement step
        updateStep(); // Update UI
    }
}

// Update the visibility of form steps, progress bar, and navigation buttons
function updateStep() {
    // Hide/show form steps based on currentStep
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentStep);
    });
    
    // Update progress steps (circles)
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 <= currentStep);
    });
    
    // Update progress lines between steps
    document.querySelectorAll('.progress-line').forEach((line, index) => {
        line.classList.toggle('active', index + 1 < currentStep);
    });
    
    // Update button visibility
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    backBtn.style.display = currentStep > 1 ? 'block' : 'none'; // Show 'Back' button from step 2
    nextBtn.style.display = currentStep < totalSteps ? 'block' : 'none'; // Show 'Next' button until last step
    submitBtn.style.display = currentStep === totalSteps ? 'block' : 'none'; // Show 'Submit' button on last step
}

// Validate required fields in the current form step
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    // Select all required inputs and selects within the current active step
    const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) { // Check if input value is empty or just whitespace
            input.style.borderColor = '#ef4444'; // Highlight invalid fields
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0'; // Reset border for valid fields
        }
    });
    
    if (!isValid) {
        // Display a generic alert for missing fields
        // In a production app, more specific error messages would be better
        alert('Please fill in all required fields.'); 
    }
    
    return isValid;
}

// Populate the appointment summary on the final step
function updateSummary() {
    const formData = new FormData(document.getElementById('bookingForm')); // Get form data
    const summaryContent = document.getElementById('summaryContent');
    
    // Extract values from form data
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const service = formData.get('service');
    const doctor = formData.get('doctor');
    const appointmentDate = formData.get('appointmentDate');
    const appointmentTime = formData.get('appointmentTime');
    
    // Generate HTML for the summary
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

// Helper function to format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault(); // Prevent default form submission behavior
    
    if (validateCurrentStep()) {
        // Simulate form submission success
        alert('Appointment booked successfully! We will contact you shortly to confirm.');
        closeBookingModal(); // Close modal after successful submission
    }
}

// Reset the form and its UI state
function resetForm() {
    currentStep = 1; // Reset to first step
    document.getElementById('bookingForm').reset(); // Clear form fields
    updateStep(); // Update UI to reflect step 1
    
    // Reset border colors for all input fields
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.style.borderColor = '#e2e8f0';
    });
}

// Add a scroll effect to the header for a subtle visual change
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        // Apply a slightly transparent background and blur when scrolled down
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        // Revert to solid white background when at the top
        header.style.background = 'white';
        header.style.backdropFilter = 'none';
    }
});

// Add a fade-in animation for images when they load
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1'; // Fade in the image when loaded
        });
        
        // Set initial opacity to 0 and add transition for the fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});
