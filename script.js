
const heroNav = document.querySelector('.hero-nav');
const scrollCue = document.querySelector('.scroll-cue');
const line = document.querySelector('.horizontal-line'); /* nytt */

let firstScrollHandled = false;
let scrollDistance = 0;

const UNLOCK_THRESHOLD = 500; /* varje 100 = 1 scroll */
const UNLOCK_DELAY = 1800; /* delay i ms */

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
        scrollCue.classList.add('is-hidden'); /* dölj scroll-hint */
        
        /* vänta innan scroll släpps */
        setTimeout (() => {
            document.body.classList.remove('no-scroll'); /* lås upp scroll */
            firstScrollHandled = true;
        }, UNLOCK_DELAY);
    }
}, { passive: false });