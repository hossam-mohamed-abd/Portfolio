
const navbar = document.getElementById("navbar");
const menuItems = document.querySelectorAll('#navbar ul li');
const highlight = document.getElementById('highlight');
const backToTop = document.getElementById("backToTop");
const aboutSection = document.getElementById("about");

navbar.classList.add('hidden');


const sections = Array.from(menuItems).map(item => document.querySelector(item.querySelector('a').getAttribute('href')));


const moveHighlight = target => {
    const rect = target.getBoundingClientRect();
    const parentRect = target.parentElement.getBoundingClientRect();
    highlight.style.width = `${rect.width}px`;
    highlight.style.transform = `translateX(${rect.left - parentRect.left}px)`;
};


if (menuItems.length) moveHighlight(menuItems[0]);


menuItems.forEach(item => item.addEventListener('mouseenter', () => moveHighlight(item)));


menuItems[0].parentElement.addEventListener('mouseleave', () => moveHighlight(menuItems[0]));


window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scrollMiddle = scrollY + window.innerHeight / 2;

    
    navbar.classList.toggle('hidden', scrollY <= 50);

    
    backToTop?.classList.toggle('hidden', scrollY < aboutSection.offsetTop - 100);

    
    sections.forEach((section, index) => {
        if (section.offsetTop <= scrollMiddle && section.offsetTop + section.offsetHeight > scrollMiddle) {
            moveHighlight(menuItems[index]);
        }
    });
});


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


new Typed("#typed-text", {
    strings: ["I build scalable Angular applications", "I craft responsive & modern UIs", "I explore Data Engineering & AI", "I learn Cybersecurity & secure the web"],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1500,
    loop: true
});






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








const snovaImages = Array.from({ length: 11 }, (_, i) => `assets/images/SnovaVerse/${i + 1}.jpeg`);
let snovaIndex = 0;
const snovaSlide = document.getElementById('snova-slide');
setInterval(() => {
    snovaSlide.style.opacity = '0';
    setTimeout(() => {
        snovaIndex = (snovaIndex + 1) % snovaImages.length;
        snovaSlide.src = snovaImages[snovaIndex];
        snovaSlide.style.opacity = '1';
    }, 350);
}, 2000);


const psychImages = Array.from({ length: 14 }, (_, i) => `assets/images/Psychology/(${i + 1}).jpeg`);
let psychIndex = 0;
const psychSlide = document.getElementById('psych-slide');
setInterval(() => {
    psychSlide.style.opacity = '0';
    setTimeout(() => {
        psychIndex = (psychIndex + 1) % psychImages.length;
        psychSlide.src = psychImages[psychIndex];
        psychSlide.style.opacity = '1';
    }, 350);
}, 3000);


const gdgImages = Array.from({ length: 9 }, (_, i) => `assets/images/GDG/(${i + 1}).jpeg`);
let gdgIndex = 0;
const gdgSlide = document.getElementById('gdg-slide');
setInterval(() => {
    gdgSlide.style.opacity = '0';
    setTimeout(() => {
        gdgIndex = (gdgIndex + 1) % gdgImages.length;
        gdgSlide.src = gdgImages[gdgIndex];
        gdgSlide.style.opacity = '1';
    }, 350);
}, 4000);




