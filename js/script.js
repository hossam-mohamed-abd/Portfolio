// ===== Navbar, Menu Highlight & Scroll Spy =====
const navbar = document.getElementById("navbar");
const menuItems = document.querySelectorAll('#navbar ul li');
const highlight = document.getElementById('highlight');
const backToTop = document.getElementById("backToTop");
const aboutSection = document.getElementById("about");

navbar.classList.add('hidden');

// Map menu items to sections
const sections = Array.from(menuItems).map(item => document.querySelector(item.querySelector('a').getAttribute('href')));

// Move highlight to target menu item
const moveHighlight = target => {
    const rect = target.getBoundingClientRect();
    const parentRect = target.parentElement.getBoundingClientRect();
    highlight.style.width = `${rect.width}px`;
    highlight.style.transform = `translateX(${rect.left - parentRect.left}px)`;
};

// Initialize highlight on first item
if (menuItems.length) moveHighlight(menuItems[0]);

// Hover events for menu
menuItems.forEach(item => item.addEventListener('mouseenter', () => moveHighlight(item)));

// Reset highlight to first item on mouse leave
menuItems[0].parentElement.addEventListener('mouseleave', () => moveHighlight(menuItems[0]));

// ===== Scroll Event =====
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollMiddle = scrollY + window.innerHeight / 2;

    // Navbar visibility after 50px scroll
    navbar.classList.toggle('hidden', scrollY <= 50);

    // Back-to-top button visibility
    backToTop?.classList.toggle('hidden', scrollY < aboutSection.offsetTop - 100);

    // Scroll spy highlight
    sections.forEach((section, index) => {
        if (section.offsetTop <= scrollMiddle && section.offsetTop + section.offsetHeight > scrollMiddle) {
            moveHighlight(menuItems[index]);
        }
    });
});

// ===== VANTA Globe =====
VANTA.GLOBE({
    el: "#vanta-globe",
    mouseControls: true,
    touchControls: true,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x6646f9,
    size: 0.80,
    backgroundColor: 0x000000
});

// ===== Typed.js =====
new Typed("#typed-text", {
    strings: ["I build scalable Angular applications", "I craft responsive & modern UIs", "I explore Data Engineering & AI", "I learn Cybersecurity & secure the web"],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    loop: true
});




// GEM Slider

const gemImages = Array.from({ length: 7 }, (_, i) => `assets/images/GEM/${i + 1}.png`);
let gemIndex = 0;
const gemSlide = document.getElementById('gem-slide');

setInterval(() => {
    gemSlide.style.opacity = '0';
    setTimeout(() => {
        gemIndex = (gemIndex + 1) % gemImages.length;
        gemSlide.src = gemImages[gemIndex];
        gemSlide.style.opacity = '1';
    }, 350);
}, 3000);


// AskTrack Slider
const askImages = Array.from({ length: 4 }, (_, i) => `assets/images/askAi/${i + 1}.png`);
let askIndex = 0;
const askSlide = document.getElementById('ask-slide');
setInterval(() => {
    askSlide.style.opacity = '0';
    setTimeout(() => {
        askIndex = (askIndex + 1) % askImages.length;
        askSlide.src = askImages[askIndex];
        askSlide.style.opacity = '1';
    }, 350);
}, 2000);

// QUBACX Slider
const qubacxImages = Array.from({ length: 2 }, (_, i) => `assets/images/qubacx/${i + 1}.png`);
let qubacxIndex = 0;
const qubacxSlide = document.getElementById('qubacx-slide');
setInterval(() => {
    qubacxSlide.style.opacity = '0';
    setTimeout(() => {
        qubacxIndex = (qubacxIndex + 1) % qubacxImages.length;
        qubacxSlide.src = qubacxImages[qubacxIndex];
        qubacxSlide.style.opacity = '1';
    }, 350);
}, 2000);