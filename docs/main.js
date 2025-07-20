document.addEventListener('DOMContentLoaded', function() {
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.classList.add('mobile-menu-toggle');
    document.querySelector('.header .container').appendChild(mobileMenuToggle);
    
    mobileMenuToggle.addEventListener('click', function() {
        document.querySelector('.nav-menu').classList.toggle('show');
        this.innerHTML = document.querySelector('.nav-menu').classList.contains('show') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                message: this.querySelector('textarea').value
            };
            
            // Validation
            if (!formData.name || !formData.email || !formData.message) {
                showAlert('Please fill all fields', 'error');
                return;
            }
            
            if (!validateEmail(formData.email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            simulateFormSubmission(formData)
                .then(response => {
                    showAlert('Thank you for your message! We will contact you soon.', 'success');
                    this.reset();
                })
                .catch(error => {
                    showAlert('There was an error submitting your message. Please try again.', 'error');
                });
        });
    }

    // ===== PORTAL REDIRECTIONS =====
    document.querySelectorAll('.portal-buttons .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const isPatientPortal = this.textContent.trim().includes('Patient');
            const portalType = isPatientPortal ? 'patient' : 'doctor';
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
            this.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                window.location.href = `/${portalType}`;
            }, 1500);
        });
    });

    // ===== ANIMATIONS ON SCROLL =====
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.service-card, .facility-card, .doctor-intro-card, .about-content, .contact-content'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        function checkAnimation() {
            animatedElements.forEach(el => {
                const elTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elTop < windowHeight - 100) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            });
        }
        
        window.addEventListener('load', checkAnimation);
        window.addEventListener('scroll', checkAnimation);
    }
    initScrollAnimations();

    // ===== ACTIVE NAV LINK ON SCROLL =====
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ===== HELPER FUNCTIONS =====
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    }

    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                Math.random() > 0.1 ? resolve(data) : reject(new Error('Server error'));
            }, 1000);
        });
    }
});