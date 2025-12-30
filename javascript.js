const themeSwitch = document.getElementById('theme-switch');
const body = document.body;
const header = document.querySelector('.header');
const navToggle = document.getElementById('navToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section');
const contactForm = document.getElementById('contactForm');

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        body.classList.add('darkmode');
    } else {
        body.classList.remove('darkmode');
    }
    
    updateThemeIcon();
}

function toggleTheme() {
    body.classList.toggle('darkmode');
    
    const currentTheme = body.classList.contains('darkmode') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);

    updateThemeIcon();
    
    setTimeout(updateHeaderTransparency, 100);
}

function updateThemeIcon() {
    const isDarkMode = body.classList.contains('darkmode');
    const sunIcon = themeSwitch.querySelector('.sun');
    const moonIcon = themeSwitch.querySelector('.moon');
    
    if (sunIcon && moonIcon) {
        sunIcon.style.opacity = isDarkMode ? '0' : '1';
        moonIcon.style.opacity = isDarkMode ? '1' : '0';
    }
}

function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    navToggle.classList.add('active');
    body.classList.add('sidebar-open');
    sidebar.style.transform = 'translateX(0)';
    sidebarOverlay.style.opacity = '1';
    sidebarOverlay.style.visibility = 'visible';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    navToggle.classList.remove('active');
    body.classList.remove('sidebar-open');
    sidebar.style.transform = 'translateX(-100%)';
    sidebarOverlay.style.opacity = '0';
    sidebarOverlay.style.visibility = 'hidden';
}

function updateHeaderTransparency() {
    if (!header) return;
    
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function updateActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && 
            scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    if (window.scrollY < 100) {
        navLinks.forEach(link => link.classList.remove('active'));
        sidebarLinks.forEach(link => link.classList.remove('active'));
        
        const homeNavLink = document.querySelector('.nav-menu a[href="#home"]');
        const homeSidebarLink = document.querySelector('.sidebar-link[href="#home"]');
        
        if (homeNavLink) homeNavLink.classList.add('active');
        if (homeSidebarLink) homeSidebarLink.classList.add('active');
    }
}

function initSmoothScroll() {
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, targetId);
                updateActiveNav();
            }
        });
    });
    
    sidebarLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, targetId);
                updateActiveNav();
                closeSidebar();
            }
        });
    });
}

function initContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = this.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            this.reset();
            
            submitBtn.innerHTML = '<span>Message Sent!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    });
    
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.remove('valid', 'invalid');
            } else if (this.checkValidity()) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else {
                this.classList.add('invalid');
                this.classList.remove('valid');
            }
        });
    });
}

let scrollTimeout;
function handleScroll() {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        updateActiveNav();
        updateHeaderTransparency();
    });
}

function initEventListeners() {
    themeSwitch.addEventListener('click', toggleTheme);
    
    if (navToggle) {
        navToggle.addEventListener('click', openSidebar);
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateHeaderTransparency);
}

function init() {
    initTheme();
    initSmoothScroll();
    initContactForm();
    initEventListeners();
    updateCurrentYear();
    
    console.log(
        `%c👋 Welcome to Solon's Portfolio! %c\nBuilt with HTML, CSS & JavaScript\n`,
        'color: #0d6efd; font-weight: bold; font-size: 16px;',
        'color: #6c757d;'
    );
    
    updateActiveNav();
    updateHeaderTransparency();
}

function updateCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });
}

document.addEventListener('DOMContentLoaded', init);