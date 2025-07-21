// ===== ERROR-PROOF INTERACTIONS =====
document.addEventListener('DOMContentLoaded', () => {
  // Smooth navigation
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // PDF Export
  const pdfButton = document.getElementById('exportPdf');
  if (pdfButton) {
    pdfButton.addEventListener('click', () => {
      window.print();
    });
  }

  // Animate progress bars on scroll
  const animateSkills = () => {
    document.querySelectorAll('.skill').forEach(skill => {
      const progressBar = skill.querySelector('.progress-bar div');
      const percentage = skill.querySelector('.skill-header span:last-child').textContent;
      if (progressBar && percentage) {
        progressBar.style.width = percentage;
      }
    });
  };
  
  window.addEventListener('load', animateSkills);
});

// Add this to your existing app.js
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...

  // Animate timeline items on scroll
  const animateTimeline = () => {
    document.querySelectorAll('.timeline-item').forEach(item => {
      if (isElementInViewport(item)) {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }
    });
  };

  // Helper function
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75
    );
  }

  // Initialize animations
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease';
  });

  window.addEventListener('load', animateTimeline);
  window.addEventListener('scroll', animateTimeline);
});

// Contact Form Handling
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Form data collection
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  
  // Here you would typically send to a server
  console.log('Form submitted:', formData);
  alert('Message sent successfully!');
  this.reset();
});

// Smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const body = document.body;

if (mobileMenuBtn && sidebar) {
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    body.classList.toggle('menu-open');
    
    // Change icon
    const icon = mobileMenuBtn.querySelector('i');
    if (sidebar.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
  
  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      sidebar.classList.remove('active');
      body.classList.remove('menu-open');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
}

// Safe vCard Download Function
function downloadVCard() {
  try {
    // Contact information
    const contact = {
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Senior Developer',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      website: 'https://yourportfolio.com',
      linkedIn: 'https://linkedin.com/in/yourprofile'
    };

    // Validate required fields
    if (!contact.firstName || !contact.lastName) {
      throw new Error('Name fields are required');
    }

    // Build vCard content
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contact.firstName} ${contact.lastName}`,
      `N:${contact.lastName};${contact.firstName};;;`,
      `TITLE:${contact.jobTitle}`,
      `EMAIL:${contact.email}`,
      `TEL;TYPE=WORK,VOICE:${contact.phone}`,
      `URL:${contact.website}`,
      `URL:${contact.linkedIn}`,
      'REV:' + new Date().toISOString(),
      'END:VCARD'
    ].filter(Boolean).join('\n');

    // Create download
    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contact.firstName}_${contact.lastName}.vcf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error('vCard generation failed:', error);
    alert('Failed to generate contact file. Please try again.');
  }
}

// Safe event listener attachment
const vCardButton = document.getElementById('downloadVcard');
if (vCardButton) {
  vCardButton.addEventListener('click', downloadVCard);
}
// Load translations based on browser language

let currentLanguage = 'en';
let translations = {};

async function loadTranslations(lang) {
  try {
    const response = await fetch(`/locales/${lang}.json`);
    translations[lang] = await response.json();
    applyTranslations(lang);
  } catch (error) {
    console.error(`Failed to load ${lang} translations:`, error);
    if (lang !== 'en') loadTranslations('en'); // Fallback to English
  }
}

function applyTranslations(lang) {
  const translation = translations[lang];
  if (!translation) return;
  
  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);
  
  // Update simple text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const keys = el.getAttribute('data-i18n').split('.');
    let value = translation;
    keys.forEach(key => value = value?.[key]);
    if (value !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    }
  });
  
  // Update dynamic content
  document.querySelectorAll('[data-i18n-dynamic]').forEach(el => {
    const keys = el.getAttribute('data-i18n-dynamic').split('.');
    let data = translation;
    keys.forEach(key => data = data?.[key]);
    
    if (data) {
      if (el.querySelector('h3')) el.querySelector('h3').textContent = data.title || '';
      if (el.querySelector('p')) el.querySelector('p').textContent = data.description || '';
      if (el.querySelector('.timeline-company')) {
        el.querySelector('.timeline-company').textContent = data.company || '';
      }
      if (el.querySelector('.project-link')) {
        el.querySelector('.project-link').textContent = data.link || '';
      }
      if (el.querySelector('.timeline-description')) {
        const points = el.querySelectorAll('.timeline-description li');
        data.points?.forEach((point, i) => {
          if (points[i]) points[i].textContent = point;
        });
      }
    }
  });
  
  // Update active language button
  document.querySelectorAll('.language-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Load preferred language or browser language
  const preferredLang = localStorage.getItem('preferredLanguage');
  const browserLang = navigator.language.split('-')[0];
  const initialLang = ['en', 'fr'].includes(preferredLang) 
    ? preferredLang 
    : ['en', 'fr'].includes(browserLang) 
      ? browserLang 
      : 'en';
  
  loadTranslations(initialLang);
  
  // Set up language switcher
  document.querySelectorAll('.language-option').forEach(btn => {
    btn.addEventListener('click', () => loadTranslations(btn.dataset.lang));
  });
});