
const heroNav = document.querySelector('.hero-nav');
const scrollCue = document.querySelector('.scroll-cue');
const line = document.querySelector('.horizontal-line');
const socialLinks = document.querySelector('.social-links');

const aboutSection = document.querySelector('#about');
const aboutBgText = document.querySelector('.about-bg-text');

const revealElements = document.querySelectorAll('.reveal');

const skillsTitle = document.querySelector('.skills-title');
const skillColumns = document.querySelectorAll('.skills-column');

const testimonialsSection = document.querySelector('#testimonials');
const testimonials = document.querySelectorAll('.testimonial');

// --------------------------------HERO--------------------------------

let firstScrollHandled = false;
let scrollDistance = 0;

const UNLOCK_THRESHOLD = 500; /* varje 100 = 1 scroll */
const UNLOCK_DELAY = 500; /* delay i ms */

/* lås scroll i början */
document.body.classList.add('no-scroll');

window.addEventListener('wheel', (event) => {
    if (firstScrollHandled) {
        return;
    }

    event.preventDefault();

    /* samla hur mycket användaren scrollar */
    scrollDistance += Math.abs(event.deltaY);

    /* räkna ut hur stor del av linjen som ska visas */
    const progress = Math.min(scrollDistance / UNLOCK_THRESHOLD, 1);
    /* sätt bredd i % */
    line.style.width = `${progress * 100}%`;

    /* lås upp först när tröskeln nås */
    if (scrollDistance >= UNLOCK_THRESHOLD) {
        heroNav.classList.add('is-visible'); /* visa navbar */
        socialLinks.classList.add('is-visible'); /* visa social-link ikoner */
        scrollCue.classList.add('is-hidden'); /* dölj scroll-hint */

        /* vänta innan scroll släpps */
        setTimeout(() => {
            document.body.classList.remove('no-scroll'); /* lås upp scroll */
            firstScrollHandled = true;
        }, UNLOCK_DELAY);
    }
}, { passive: false });

// --------------------------------ABOUT--------------------------------

/* kolla om about-sektionen syns i fönstret */
function isAboutInView() {
    const rect = aboutSection.getBoundingClientRect(); // kollar positionen i förhållande till viewport
    return rect.top < window.innerHeight && rect.bottom > 0; // returnera om top och bottom är i viewport
}

/* varje gång använadern scrollar kör denna funktion */
window.addEventListener('scroll', () => {
    if (!aboutSection || !aboutBgText) return; // om elementen inte finns i dom så avbryt
    if (!isAboutInView()) return; // om About inte är synlig så avbryt

    /* --- PARALLAX --- */
    const scrollY = window.scrollY; // scrollY är hur många pixlar sidan har scrollat (högst upp = 0, scrolla ner 500 = 500)
    const offset = scrollY * 0.15; // rör sig 15% i förhållande till scrollen / hur sidan rör sig

    /* behåll elementet horisontellt centrerat men flytta det lite nedåt ju mer man scrollar */
    aboutBgText.style.transform =
        `translate(-50%, calc(-50% + ${offset}px))`;

    /* --- REVEAL --- */
    /* loopar igenom varje .reveal-element och mäter var elementet är på skärmen just nu */
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();

        /* om elementets toppkant är ovanför 85% av skärmens höjd (innerHeight mäter skärmens höjd i pixlar beroende på enhet)*/
        if (rect.top < window.innerHeight * 0.73) {
            el.classList.add('is-visible');
        }
    });
});

// --------------------------------SKILLZ--------------------------------
let skillsAnimated = false; // kör bara en gång

window.addEventListener('scroll', () => {
    if (skillsAnimated) return;
    if (!skillsTitle || skillColumns.length === 0) return;

    const titleRect = skillsTitle.getBoundingClientRect();

    // när skills-rubriken når in i viewport
    if (titleRect.top < window.innerHeight * 0.85) {

        // 1. visa rubriken
        skillsTitle.classList.add('is-visible');

        // 2. visa kolumnerna (lite efter varandra)
        skillColumns.forEach((col, index) => {
            setTimeout(() => {
                col.classList.add('is-visible');
            }, index * 300);
        });

        skillsAnimated = true;
    }
});

// --------------------------------TESTIMONIALS--------------------------------
// Funktion som sätter vilket tesimonial som är "aktivt"
function setActiveTestimonial(activeIndex) {
    // loopa igenom alla testimonials ett i taget
    testimonials.forEach((testimonial, index) => {
        // ta bort aktiv-klassen från alla testimonials
        testimonial.classList.remove('testimonial-active');
        // om detta testimonial har samma index som det aktiva
        if (index === activeIndex) {
            // lägg till klassen som markerar aktivt testimonial
            testimonial.classList.add('testimonial-active');
        }
    });
}

// funktion som räknar ut vilket testimonial som är i fokus
function updateTestimonialFocus() {
    const viewportMiddle = window.innerHeight / 2; // räknar ut mitten av skärmen (viewport). innerHeight = höjden på webbläsarfönstret i px

    let closestIndex = 0; // sparar index på det testimonial som är närmast mitten
    let closestDistance = Infinity; // sparar avståndet till det närmaste testimonial.

    // loopa igenom alla testimonials
    testimonials.forEach((testimonial, index) => {
        const rect = testimonial.getBoundingClientRect();
        const testimonialMiddle = rect.top + rect.height / 2; // räknar ut mitten av detta testimonial
        const distance = Math.abs(testimonialMiddle - viewportMiddle); // räkna ut avståndet mellan testimonials mitt och skärmens mitt

        // kollar om avståndet är mindre än det vi sparat tidigare
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    // när närmaste testimonial är hittat, sätt det som aktivt
    setActiveTestimonial(closestIndex);
}

function isTestimonialsInView() {
    const rect = testimonialsSection.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

// Initialt fokus
setActiveTestimonial(0);

// Scroll-lyssnare
window.addEventListener('scroll', () => {
    if (window.innerWidth < 1024) return;

    if (!isTestimonialsInView()) {
        testimonialsSection.classList.remove('testimonials-focus');
        return;
    }

    testimonialsSection.classList.add('testimonials-focus');
    updateTestimonialFocus();
});