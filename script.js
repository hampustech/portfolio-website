
const langSwitch = document.querySelector('.lang-switch');

const heroNav = document.querySelector('.hero-nav');
const scrollCue = document.querySelector('.scroll-cue');
const line = document.querySelector('.horizontal-line');
const socialLinks = document.querySelector('.social-links');

const mediaQuery = window.matchMedia("(max-width: 900px)");

const aboutSection = document.querySelector('#about');
const aboutBgText = document.querySelector('.about-bg-text');

const revealElements = document.querySelectorAll('.reveal');

const skillsTitle = document.querySelector('.skills-title');
const skillColumns = document.querySelectorAll('.skills-column');

const testimonialsSection = document.querySelector('#testimonials');
const testimonials = document.querySelectorAll('.testimonial');

function handleScreenChange(e) {
  const isSmallScreen = e.matches;

  if (isSmallScreen) {
    heroNav.classList.add('is-visible');
    socialLinks.classList.add('is-visible');
    langSwitch?.classList.add('is-visible');


    scrollCue.classList.add('is-hidden');
    line.style.width = "100%";

    document.body.classList.remove('no-scroll');
  }
}

handleScreenChange(mediaQuery);

mediaQuery.addEventListener('change', handleScreenChange);

let firstScrollHandled = false;
let scrollDistance = 0;

const UNLOCK_THRESHOLD = 500;
const UNLOCK_DELAY = 500;

if (!mediaQuery.matches) {
  document.body.classList.add('no-scroll');

  window.addEventListener('wheel', (event) => {
      if (firstScrollHandled) return;

      event.preventDefault();

      scrollDistance += Math.abs(event.deltaY);
      const progress = Math.min(scrollDistance / UNLOCK_THRESHOLD, 1);
      line.style.width = `${progress * 100}%`;

      if (scrollDistance >= UNLOCK_THRESHOLD) {
          heroNav.classList.add('is-visible');
          socialLinks.classList.add('is-visible');
          langSwitch?.classList.add('is-visible');

          scrollCue.classList.add('is-hidden');

          setTimeout(() => {
              document.body.classList.remove('no-scroll');
              firstScrollHandled = true;
          }, UNLOCK_DELAY);
      }
  }, { passive: false });
}

function isAboutInView() {
    const rect = aboutSection.getBoundingClientRect(); 
    return rect.top < window.innerHeight && rect.bottom > 0;
}

window.addEventListener('scroll', () => {
    if (!aboutSection || !aboutBgText) return; 
    if (!isAboutInView()) return; 

    const scrollY = window.scrollY;
    const offset = scrollY * 0.15;

    aboutBgText.style.transform =
        `translate(-50%, calc(-50% + ${offset}px))`;

    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.73) {
            el.classList.add('is-visible');
        }
    });
});

let skillsAnimated = false;

window.addEventListener('scroll', () => {
    if (skillsAnimated) return;
    if (!skillsTitle || skillColumns.length === 0) return;

    const titleRect = skillsTitle.getBoundingClientRect();

    if (titleRect.top < window.innerHeight * 0.85) {

        skillsTitle.classList.add('is-visible');

        skillColumns.forEach((col, index) => {
            setTimeout(() => {
                col.classList.add('is-visible');
            }, index * 300);
        });

        skillsAnimated = true;
    }
});

function setActiveTestimonial(activeIndex) {

    testimonials.forEach((testimonial, index) => {

        testimonial.classList.remove('testimonial-active');
        if (index === activeIndex) {
            testimonial.classList.add('testimonial-active');
        }
    });
}

function updateTestimonialFocus() {
    const viewportMiddle = window.innerHeight / 2; 

    let closestIndex = 0; 
    let closestDistance = Infinity; 

    testimonials.forEach((testimonial, index) => {
        const rect = testimonial.getBoundingClientRect();
        const testimonialMiddle = rect.top + rect.height / 2; 
        const distance = Math.abs(testimonialMiddle - viewportMiddle); 

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    setActiveTestimonial(closestIndex);
}

function isTestimonialsInView() {
    const rect = testimonialsSection.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

setActiveTestimonial(0);

window.addEventListener('scroll', () => {
    if (window.innerWidth < 300) return;

    if (!isTestimonialsInView()) {
        testimonialsSection.classList.remove('testimonials-focus');
        return;
    }

    testimonialsSection.classList.add('testimonials-focus');
    updateTestimonialFocus();
});

setTimeout(() => window.dispatchEvent(new Event('scroll')), 0);