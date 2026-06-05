
document.querySelectorAll('*').forEach(el => {
    if (el.offsetWidth > document.documentElement.offsetWidth) {
        console.log(el, el.offsetWidth);
    }
});
/*  CINEMATIC HERO CANVAS  */
(function () {
    const cv = document.getElementById('heroCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H;

    function resize() {
        W = cv.width = cv.offsetWidth;
        H = cv.height = cv.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /*  PALETTE  */
    const V = 'rgba(79,70,229,', C = 'rgba(180,83,9,', G = 'rgba(99,102,241,';

    /*  DATA LABELS  */
    const LABELS = [
        { t: 'Angular 17', s: 'PRIMARY STACK', col: G },
        { t: 'TypeScript', s: 'LANGUAGE', col: V },
        { t: 'RxJS', s: 'REACTIVE', col: C },
        { t: 'Cybersecurity', s: 'LEARNING', col: C },
        { t: '9+ Projects', s: 'SHIPPED', col: G },
        { t: 'PHP & MySQL', s: 'BACKEND', col: V },
        { t: 'Tailwind CSS', s: 'STYLING', col: C },
        { t: 'Docker · Git', s: 'DEVOPS', col: G },
        { t: 'Python', s: 'DATA & ML', col: V },
        { t: 'Qwen AI API', s: 'AI INTEGRATION', col: C },
        { t: 'OTP & JWT', s: 'AUTH SYSTEMS', col: G },
        { t: 'Mobile-First', s: 'RESPONSIVE', col: V },
    ];

    /*  NODES (orbiting dots)  */
    const NODES = Array.from({ length: 55 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.0002 + Math.random() * 0.0004;
        const r = 60 + Math.random() * 200;
        const rVar = Math.random() * 30;
        const rSpeed = 0.0003 + Math.random() * 0.0005;
        const rPhase = Math.random() * Math.PI * 2;
        const size = 1 + Math.random() * 2.2;
        const bright = Math.random();
        const col = bright > 0.65 ? G : bright > 0.35 ? V : C;
        return { angle, speed, r, rVar, rSpeed, rPhase, size, col, alpha: 0.3 + Math.random() * 0.5 };
    });

    /*  RINGS  */
    const RINGS = [
        { r: 90, speed: 0.00015, dashLen: 8, gapLen: 14, col: V, alpha: 0.18 },
        { r: 155, speed: -0.0001, dashLen: 12, gapLen: 20, col: C, alpha: 0.13 },
        { r: 215, speed: 0.00008, dashLen: 6, gapLen: 28, col: G, alpha: 0.1 },
        { r: 270, speed: -0.00006, dashLen: 18, gapLen: 40, col: V, alpha: 0.07 },
    ];

    /*  BEAMS (radial lines from center)  */
    const BEAMS = Array.from({ length: 8 }, (_, i) => ({
        angle: (i / 8) * Math.PI * 2,
        speed: 0.00025 + (i % 2) * 0.00015,
        col: i % 3 === 0 ? V : i % 3 === 1 ? C : G,
        len: 120 + Math.random() * 100,
        alpha: 0.06 + Math.random() * 0.06,
    }));

    /*  SCAN LINES  */
    let scanY = 0;

    /*  LABEL SYSTEM  */
    const activeLabels = [];
    let labelTimer = 0;
    const LABEL_INTERVAL = 90;

    function spawnLabel() {
        const lbl = LABELS[Math.floor(Math.random() * LABELS.length)];
        const side = Math.random() > 0.5;
        const x = side ? W * 0.55 + Math.random() * W * 0.38 : W * 0.04 + Math.random() * W * 0.3;
        const y = 40 + Math.random() * (H - 80);
        activeLabels.push({ ...lbl, x, y, life: 0, maxLife: 180 + Math.random() * 120, phase: 0 });
        if (activeLabels.length > 5) activeLabels.splice(0, 1);
    }

    /*  GRID  */
    function drawGrid(ts) {
        const off = (ts * 0.008) % 40;
        ctx.strokeStyle = 'rgba(79,70,229,0.06)';
        ctx.lineWidth = 0.5;
        for (let x = (off % 40) - 40; x < W + 40; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = (off % 40) - 40; y < H + 40; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
    }

    /*  CENTER  */
    let cx, cy;

    /*  CONNECTIONS  */
    function drawConnections(ts) {
        const visible = NODES.filter(n => {
            const a = n.angle + ts * n.speed;
            const r = n.r + Math.sin(ts * n.rSpeed + n.rPhase) * n.rVar;
            n._x = cx + Math.cos(a) * r;
            n._y = cy + Math.sin(a) * r;
            return r < 200;
        });
        for (let i = 0; i < visible.length; i++) {
            for (let j = i + 1; j < visible.length; j++) {
                const dx = visible[i]._x - visible[j]._x;
                const dy = visible[i]._y - visible[j]._y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 75) {
                    const a = (1 - d / 75) * 0.18;
                    ctx.strokeStyle = visible[i].col + a + ')';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(visible[i]._x, visible[i]._y);
                    ctx.lineTo(visible[j]._x, visible[j]._y);
                    ctx.stroke();
                }
            }
        }
    }

    /*  CROSSHAIR  */
    function drawCrosshair(ts) {
        const pulse = 0.5 + 0.5 * Math.sin(ts * 0.002);
        const len = 18 + pulse * 6;
        ctx.strokeStyle = C + (0.5 + pulse * 0.3) + ')';
        ctx.lineWidth = 1;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.moveTo(cx + dx * 6, cy + dy * 6);
            ctx.lineTo(cx + dx * len, cy + dy * len);
            ctx.stroke();
        });
        ctx.strokeStyle = V + (0.35 + pulse * 0.2) + ')';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 4 + pulse * 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    /*  SCAN LINE  */
    function drawScan() {
        if (!W || !H) return;
        scanY = (scanY + 0.6) % H;
        const grad = ctx.createLinearGradient(0, scanY - 12, 0, scanY + 12);
        grad.addColorStop(0, 'rgba(34,211,238,0)');
        grad.addColorStop(0.5, 'rgba(34,211,238,0.06)');
        grad.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 12, W, 24);
    }

    /*  BRACKET LABEL  */
    function drawLabel(lbl) {
        const fadeIn = Math.min(lbl.life / 30, 1);
        const fadeOut = lbl.life > lbl.maxLife - 30 ? (lbl.maxLife - lbl.life) / 30 : 1;
        const alpha = fadeIn * fadeOut;
        if (alpha <= 0) return;

        const { x, y, t, s, col } = lbl;
        const bw = 6, bh = 5;

        ctx.globalAlpha = alpha;

        ctx.strokeStyle = col + '0.6)';
        ctx.lineWidth = 1;
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
            const bx = x + sx * (bw + 28);
            const by = y + sy * (bh + 20);
            ctx.beginPath();
            ctx.moveTo(bx - sx * bw, by);
            ctx.lineTo(bx, by);
            ctx.lineTo(bx, by - sy * bh);
            ctx.stroke();
        });

        ctx.font = '500 9px "DM Mono", monospace';
        ctx.letterSpacing = '0.12em';
        ctx.fillStyle = col + '0.55)';
        ctx.textAlign = 'center';
        ctx.fillText(s, x, y - 8);

        ctx.font = '700 15px "Playfair Display", serif';
        ctx.fillStyle = col + '0.9)';
        ctx.fillText(t, x, y + 10);

        ctx.globalAlpha = 1;
        ctx.letterSpacing = '0';
    }

    /*  MAIN LOOP  */
    let frame = 0;
    function draw(ts) {
        cx = W / 2; cy = H / 2;
        ctx.clearRect(0, 0, W, H);

        drawGrid(ts);

        BEAMS.forEach(b => {
            b.angle += b.speed;
            ctx.strokeStyle = b.col + b.alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(b.angle) * b.len, cy + Math.sin(b.angle) * b.len);
            ctx.stroke();
        });

        RINGS.forEach(ring => {
            ring._phase = (ring._phase || 0) + ring.speed;
            const circ = 2 * Math.PI * ring.r;
            const total = ring.dashLen + ring.gapLen;
            const dashes = Math.floor(circ / total);
            for (let i = 0; i < dashes; i++) {
                const a1 = ring._phase + (i / dashes) * Math.PI * 2;
                const a2 = a1 + (ring.dashLen / circ) * Math.PI * 2;
                ctx.strokeStyle = ring.col + ring.alpha + ')';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.arc(cx, cy, ring.r, a1, a2);
                ctx.stroke();
            }
        });

        drawConnections(ts);

        NODES.forEach(n => {
            if (!n._x) return;
            ctx.beginPath();
            ctx.arc(n._x, n._y, n.size, 0, Math.PI * 2);
            ctx.fillStyle = n.col + n.alpha + ')';
            ctx.fill();
        });

        drawCrosshair(ts);
        drawScan();

        frame++;
        labelTimer++;
        if (labelTimer >= LABEL_INTERVAL) { labelTimer = 0; spawnLabel(); }
        for (let i = activeLabels.length - 1; i >= 0; i--) {
            activeLabels[i].life++;
            if (activeLabels[i].life > activeLabels[i].maxLife) { activeLabels.splice(i, 1); continue; }
            drawLabel(activeLabels[i]);
        }

        requestAnimationFrame(draw);
    }

    setTimeout(() => { spawnLabel(); setTimeout(spawnLabel, 600); }, 500);
    requestAnimationFrame(draw);
})();


/*  PROJECT DATA  */
const PROJECTS = [
    {
        num: '001',
        tag: 'Featured',
        name: 'Psychiatrist',
        nameEm: 'Clinic Website',
        brief: 'Bilingual (AR/EN) clinic with dark mode, services, reviews, session pricing, appointment booking & embedded video.',
        chips: ['Angular', 'TypeScript', 'Tailwind', 'i18n AR/EN', 'Dark Mode'],
        color: '#1a0538',
        icon: 'fa-angular',
        link: 'https://dr-mohamed-essam.vercel.app/home',
        img: 'assets/images/Psychiatrist Clinic Website.png'
    },
    {
        num: '002',
        tag: 'Live',
        name: 'SnovaVerse',
        nameEm: 'VR Company',
        brief: 'Futuristic VR/Metaverse company website with animated hero, bilingual RTL, and Formspree contact.',
        chips: ['Angular', 'RTL/i18n', 'Formspree'],
        color: '#031a2e',
        icon: 'fa-angular',
        link: 'https://snovaverse.com/#/',
        img: 'assets/images/snovaverse.png'
    },
    {
        num: '003',
        tag: 'Web App',
        name: 'E-Commerce',
        nameEm: 'Application',
        brief: 'Product listing, filtering, cart & API integration built with component-based architecture.',
        chips: ['Angular', 'TypeScript', 'REST APIs'],
        color: '#0a1a10',
        icon: 'fa-angular',
        link: 'https://github.com/hossam-mohamed-abd/Ecommerce-Anguler',
        img: 'assets/images/E-Commerce Application.png'
    },
    {
        num: '004',
        tag: 'Full Stack',
        name: 'Grand Egyptian',
        nameEm: 'Museum Portal',
        brief: 'Full-stack museum portal with auth, dynamic content & MVC architecture.',
        chips: ['PHP', 'MySQL', 'MVC'],
        color: '#1a1000',
        icon: 'fa-php',
        link: 'https://github.com/hossam-mohamed-abd/Grand-Egyptian-Museum',
        img: 'assets/images/Grand Egyptian Museum Portal.jpeg'
    },
    {
        num: '005',
        tag: 'System',
        name: 'Student',
        nameEm: 'GDG Tracks',
        brief: 'Track management: scheduling, attendance, grading & OTP email verification.',
        chips: ['PHP', 'MySQL', 'OTP Auth'],
        color: '#0e0a1a',
        icon: 'fa-php',
        link: 'https://gdg-aou.gt.tc/login',
        img: 'assets/images/Student GDG Tracks.jpeg'
    },
    {
        num: '006',
        tag: 'AI Platform',
        name: 'AskTrack',
        nameEm: 'AI Learning',
        brief: 'AI study assistant using Qwen AI API & Google Sheets as a lightweight backend.',
        chips: ['JavaScript', 'Qwen AI', 'Sheets API'],
        color: '#001a1a',
        icon: 'fa-brain',
        link: 'https://aiexportnew.vercel.app/frontend/index.html',
        img: 'assets/images/AI Portfolio Builder.png'
    },
    {
        num: '007',
        tag: 'AI Platform',
        name: 'MediSearch',
        nameEm: 'AI Drug Recommendation',
        brief: 'Smart drug recommendation system supporting Arabic & English with auto spell-correction, brand name matching, and drug similarity scoring using TF-IDF & Cosine Similarity.',
        chips: ['Python', 'FastAPI', 'TF-IDF', 'Cosine Similarity', 'NLP', 'REST API'],
        color: '#001220',
        icon: 'fa-brain',
        link: 'https://hossam-mohamed-abd.github.io/ML_MEDICEN/',
        img: 'assets/images/MediSearch AI Drug Recommendation.png'
    },
    {
        num: '008',
        tag: 'Full Stack',
        name: 'Boostly',
        nameEm: 'Discord Boost Service',
        brief: 'Full automation platform for Discord Boost services with multi-payment support (Crypto / Visa), step-by-step order tracking, and smart partial payment processing.',
        chips: ['PHP', 'MySQL', 'MVC', 'NowPayments', 'Webhooks', 'REST API'],
        color: '#0d0520',
        icon: 'fa-discord',
        link: 'https://boostly.cc/',
        img: 'assets/images/boostly.png'
    },
    {
        num: '009',
        tag: 'AI Tool',
        name: 'AI Portfolio',
        nameEm: 'Builder',
        brief: 'A web app that converts a PDF resume into a publish-ready professional portfolio in seconds, with Arabic & English support, dark mode, and instant preview.',
        chips: ['Node.js', 'Express', 'JavaScript', 'PDF Processing', 'Local Storage'],
        color: '#0a1520',
        icon: 'fa-robot',
        link: 'https://hossam-mohamed-abd.github.io/createAportfolio/',
        img: 'assets/images/AI Portfolio Builder.png'
    },
];
/*  FAN CARDS — Dynamic count  */
const fanStage = document.getElementById('fanStage');
const fanCta = document.getElementById('fanCta');

/* Show only first 6 in the fan, rest in modal only */
const FAN_PROJECTS = PROJECTS.slice(0, 6);
const FAN_ROT = [-30, -18, -6, 6, 18, 30];
const FAN_TY = [-20, -10, 0, 0, -10, -20];
const FAN_Z = [6, 5, 4, 3, 2, 1];

FAN_PROJECTS.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'fan-card';
    card.style.zIndex = FAN_Z[i];
    card.innerHTML = `
    <div class="fan-card-img" style="background:linear-gradient(135deg,${p.color},#04040e);display:flex;align-items:center;justify-content:center;">
     ${p.img ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">` : ''}
    </div>
    <div class="fan-card-body">
      <div class="fc-num">${p.num} / ${p.tag}</div>
      <div class="fc-name">${p.name} <em>${p.nameEm}</em></div>
    </div>`;
    fanStage.insertBefore(card, fanCta);
});

/* update header count */
const projHeaderRight = document.querySelector('.projects-header-right');
if (projHeaderRight) projHeaderRight.textContent = `${PROJECTS.length} projects · Angular / PHP / AI`;
const pmCount = document.querySelector('.pm-count');
if (pmCount) pmCount.textContent = `${PROJECTS.length} projects · Angular / PHP / AI`;

/*  WHEEL CAROUSEL  */
const N = FAN_PROJECTS.length;
const WHEEL_RX = 200;
const WHEEL_RY = 80;
let wheelAngle = 0;
let activeIdx = 0;
let isWheelOpen = false;
let isDragging = false;
let dragStartX = 0, dragStartAngle = 0;
let snapTween = null;
let fanReady = true;
let wheelEntering = false;

function getCardAngle(i) {
    return wheelAngle + (i / N) * Math.PI * 2;
}

function getActiveIdx() {
    let best = 0, bestScore = -Infinity;
    for (let i = 0; i < N; i++) {
        const a = ((getCardAngle(i) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const dist = Math.min(Math.abs(a - Math.PI * 1.5), Math.PI * 2 - Math.abs(a - Math.PI * 1.5));
        if (-dist > bestScore) { bestScore = -dist; best = i; }
    }
    return best;
}

function applyWheelPositions(instant) {
    const cards = fanStage.querySelectorAll('.fan-card');
    const newActive = getActiveIdx();
    cards.forEach((c, i) => {
        const a = getCardAngle(i);
        const x = Math.cos(a) * WHEEL_RX + 30;
        const y = Math.sin(a) * WHEEL_RY;
        const sinVal = (Math.sin(a) + 1) / 2;
        const isTop = i === newActive;
        const scale = isTop ? 1.18 : 0.62 + sinVal * 0.22;
        const zIdx = isTop ? 20 : Math.round(sinVal * 14) + 1;
        const alpha = isTop ? 1 : 0.38 + sinVal * 0.42;
        const dur = (isDragging || instant) ? 0 : .55;
        if (instant) {
            gsap.set(c, { x, y, rotation: 0, scale, zIndex: zIdx, opacity: alpha });
        } else {
            gsap.to(c, { x, y, rotation: 0, scale, zIndex: zIdx, opacity: alpha, duration: dur, ease: 'power2.out' });
        }
        c.classList.toggle('active-card', isTop);

        c.onclick = null;
        if (!isTop) {
            c.style.cursor = 'pointer';
            c.onclick = (e) => { e.stopPropagation(); spinToCard(i); };
        } else {
            c.style.cursor = 'pointer';
            c.onclick = openProjModal;
        }
    });
    if (newActive !== activeIdx) activeIdx = newActive;
}

function spinToCard(i) {
    if (snapTween) snapTween.kill();
    const topAngle = Math.PI * 1.5;
    let diff = (topAngle - (i / N) * Math.PI * 2) - wheelAngle;
    diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
    const proxy = { v: wheelAngle };
    snapTween = gsap.to(proxy, {
        v: wheelAngle + diff,
        duration: .85,
        ease: 'power3.out',
        onUpdate() { wheelAngle = proxy.v; applyWheelPositions(true); }
    });
}

function drawWheelRing() {
    const ringCv = document.getElementById('wheelRing');
    if (!ringCv) return;
    const rc = ringCv.getContext('2d');
    const W = 480, H = 220;
    ringCv.width = W; ringCv.height = H;
    ringCv.style.width = W + 'px'; ringCv.style.height = H + 'px';
    rc.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    rc.save();
    rc.strokeStyle = 'rgba(124,58,237,0.28)';
    rc.lineWidth = 1;
    rc.setLineDash([5, 10]);
    rc.beginPath();
    rc.ellipse(cx, cy, WHEEL_RX + 30, WHEEL_RY + 30, 0, 0, Math.PI * 2);
    rc.stroke();
    rc.setLineDash([]);
    rc.beginPath();
    rc.arc(cx, cy, 3, 0, Math.PI * 2);
    rc.fillStyle = 'rgba(196,181,253,0.4)';
    rc.fill();
    rc.strokeStyle = 'rgba(196,181,253,0.12)';
    rc.lineWidth = 0.5;
    rc.beginPath(); rc.moveTo(cx - 20, cy); rc.lineTo(cx + 20, cy); rc.stroke();
    rc.beginPath(); rc.moveTo(cx, cy - 20); rc.lineTo(cx, cy + 20); rc.stroke();
    rc.restore();
}

function applyFanPositions(animated) {
    const cards = fanStage.querySelectorAll('.fan-card');
    cards.forEach((c, i) => {
        c.onclick = null;
        c.style.cursor = '';
        if (animated) gsap.to(c, { rotation: FAN_ROT[i], y: FAN_TY[i], x: 0, scale: 1, opacity: 1, zIndex: FAN_Z[i], duration: .55, ease: 'back.out(1.4)', delay: i * .06 });
        else gsap.set(c, { rotation: FAN_ROT[i], y: FAN_TY[i], x: 0, scale: 1, opacity: 1, zIndex: FAN_Z[i] });
    });
}

function closeFlower() {
    if (!isWheelOpen) return;
    isWheelOpen = false;
    wheelEntering = false;
    stopPulse();
    if (snapTween) { snapTween.kill(); snapTween = null; }
    document.getElementById('wheelRing').classList.remove('visible');
    fanCta.classList.remove('wheel-mode');
    applyFanPositions(true);
    setTimeout(() => { if (!isWheelOpen) fanCta.classList.remove('hidden-cta'); }, 500);
}



fanStage.addEventListener('mousedown', e => {
    if (!isWheelOpen || e.target === fanCta) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartAngle = wheelAngle;
    fanStage.style.cursor = 'grabbing';
    if (snapTween) snapTween.kill();
});

window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    wheelAngle = dragStartAngle + dx * 0.007;
    applyWheelPositions(true);
});

window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    fanStage.style.cursor = '';
    snapToNearest();
});

fanStage.addEventListener('touchstart', e => {
    if (e.target === fanCta) return;
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartAngle = wheelAngle;
    if (snapTween) snapTween.kill();
}, { passive: true });

window.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - dragStartX;
    wheelAngle = dragStartAngle + dx * 0.007;
    applyWheelPositions(true);
}, { passive: true });

window.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    snapToNearest();
    e.stopPropagation();
});

fanStage.setAttribute('tabindex', '0');
fanStage.addEventListener('blur', () => { if (!isDragging) closeFlower(); });
fanStage.addEventListener('keydown', e => {
    if (!isWheelOpen) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.stopPropagation(); spinToCard((activeIdx + 1) % N); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.stopPropagation(); spinToCard((activeIdx - 1 + N) % N); }
    if (e.key === 'Enter') openProjModal();
});

function snapToNearest() {
    if (snapTween) snapTween.kill();
    const topAngle = Math.PI * 1.5;
    const step = (Math.PI * 2) / N;
    const raw = Math.round((topAngle - wheelAngle) / step) * step;
    const target = topAngle - raw;
    let diff = target - wheelAngle;
    diff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
    const proxy = { v: wheelAngle };
    snapTween = gsap.to(proxy, {
        v: wheelAngle + diff,
        duration: .65,
        ease: 'power3.out',
        onUpdate() { wheelAngle = proxy.v; applyWheelPositions(true); }
    });
}

applyFanPositions(false);


/*  MODAL ROWS — All 9 projects  */
const projModalBody = document.getElementById('proj-modal-body');
PROJECTS.forEach(p => {
    const row = document.createElement('div');
    row.className = 'proj-row';
    const chipsHtml = p.chips.map(c => `<span class="pr-chip">${c}</span>`).join('');

    /* GitHub only — no live demo link */
    const isGithub = p.num === '003' || p.num === '004';
    const linksHtml = `<a href="${p.link}" target="_blank" class="pj-link pj-link-main"><i class="${isGithub ? 'fab fa-github' : 'fas fa-external-link-alt'}"></i> ${isGithub ? 'GitHub' : 'Demo'}</a>`;

    row.style.cursor = 'pointer';
    row.addEventListener('click', (e) => {
        if (!e.target.closest('.pr-actions')) {
            window.open(p.link, '_blank');
        }
    });
    row.innerHTML = `
    <div class="pr-thumb">
      <div class="pr-thumb-inner" style="background:linear-gradient(135deg,${p.color},#04040e);width:100%;height:100%;position:relative;overflow:hidden;">
       <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">
      </div>
    </div>
    <div class="pr-info">
      <div class="pr-num">${p.num} / ${p.tag}</div>
      <div class="pr-name">${p.name} <em>${p.nameEm}</em></div>
      <div class="pr-brief">${p.brief}</div>
      <div class="pr-chips">${chipsHtml}</div>
    </div>
    <div class="pr-actions">${linksHtml}</div>`;
    projModalBody.appendChild(row);
});


/*  MODAL OPEN / CLOSE  */
const projModal = document.getElementById('proj-modal');

function openProjModal() {
    projModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const rows = projModalBody.querySelectorAll('.proj-row');
    rows.forEach((r, i) => {
        r.style.opacity = '0'; r.style.transform = 'translateY(14px)'; r.style.transition = 'none';
        setTimeout(() => {
            r.style.transition = 'opacity .38s ease,transform .38s ease';
            r.style.opacity = '1';
            r.style.transform = 'translateY(0)';
        }, i * 70 + 320);
    });
}

function closeProjModal() { projModal.classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProjModal(); });


/*  PARTICLES  */
const cvs = document.getElementById('particles'), ctx2 = cvs.getContext('2d');
let PW, PH, pts = [];
function resizeCvs() { PW = cvs.width = innerWidth; PH = cvs.height = innerHeight; }
resizeCvs(); window.addEventListener('resize', resizeCvs);
function mkP() { return { x: Math.random() * PW, y: Math.random() * PH, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.1 + .3, a: Math.random() * .4 + .08, hue: Math.random() < .6 ? 245 : 32 }; }
for (let i = 0; i < 80; i++) pts.push(mkP());
function drawP() {
    ctx2.clearRect(0, 0, PW, PH);
    pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = PW; if (p.x > PW) p.x = 0;
        if (p.y < 0) p.y = PH; if (p.y > PH) p.y = 0;
        ctx2.beginPath(); ctx2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx2.fillStyle = `hsla(${p.hue},60%,45%,${p.a})`; ctx2.fill();
    });
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 110) {
                ctx2.beginPath(); ctx2.moveTo(pts[i].x, pts[i].y); ctx2.lineTo(pts[j].x, pts[j].y);
                ctx2.strokeStyle = `hsla(245,50%,45%,${.08 * (1 - d / 110)})`; ctx2.lineWidth = .4; ctx2.stroke();
            }
        }
    }
    requestAnimationFrame(drawP);
}
drawP();



/*  TYPEWRITER  */
const phrases = ['Angular Frontend Developer', 'TypeScript Enthusiast', 'Data Engineering Explorer', 'Cybersecurity Learner', 'Clean Code Advocate'];
let pi = 0, ci = 0, dlx = false;
const tEl = document.getElementById('typed');
function type() {
    const cur = phrases[pi];
    if (!dlx) {
        tEl.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { dlx = true; setTimeout(type, 1900); return; }
    } else {
        tEl.textContent = cur.slice(0, --ci);
        if (ci === 0) { dlx = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, dlx ? 44 : 76);
}
type();


/*  PAGE TRANSITION  */
function runTransition(cb) {
    const ptL = document.getElementById('pt-left'), ptR = document.getElementById('pt-right'), ptLo = document.getElementById('pt-logo');
    gsap.timeline({
        onComplete: cb ? () => {
            gsap.timeline()
                .to(ptLo, { opacity: 0, scale: .7, duration: .22, ease: 'power2.in' })
                .to([ptL, ptR], { x: i => i === 0 ? '-100%' : '100%', duration: .42, ease: 'power3.inOut', stagger: 0 }, '-=.1');
        } : null
    })
        .set(ptL, { x: '-100%' }).set(ptR, { x: '100%' }).set(ptLo, { opacity: 0, scale: .8 })
        .to([ptL, ptR], { x: '0%', duration: .38, ease: 'power3.inOut', stagger: 0 })
        .to(ptLo, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(1.5)' }, '-=.1')
        .call(() => { if (cb) cb(); });
}


/*  SECTION ENGINE  */
const SIDS = ['s-home', 's-about', 's-skills', 's-projects', 's-contact'];
const SECTION_TITLES = ['WELCOME', 'WHO I AM', 'MY EXPERTISE', 'SELECTED WORK', "LET'S CONNECT"];
let CUR = 0, BUSY = false;
const isMobile = () => window.innerWidth <= 768;

const ENTERS = {
    's-about': () => {
        gsap.fromTo('#s-about .about-img-frame', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: .65, ease: 'power3.out' });
        gsap.fromTo('#s-about .about-badge', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, delay: .25, ease: 'back.out(1.7)' });
        gsap.fromTo('#s-about .s-tag,#s-about .s-title', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .1, delay: .1, ease: 'power3.out' });
        gsap.fromTo('#s-about .info-row', { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: .45, stagger: .07, delay: .28, ease: 'power3.out' });
        gsap.fromTo('#s-about .pill', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .36, stagger: .04, delay: .46, ease: 'back.out(1.7)' });
    },
    's-skills': () => {
        gsap.fromTo('#s-skills .s-tag,#s-skills .s-title', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .1, ease: 'power3.out' });
        gsap.fromTo('#s-skills .skills-note', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: .55, delay: .18, ease: 'power3.out' });
        gsap.fromTo('#s-skills .skill-block', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .44, stagger: .055, delay: .22, ease: 'power3.out' });
    },
    's-projects': () => {
        closeFlower();
        wheelAngle = 0;
        isWheelOpen = false;
        fanReady = false;
        gsap.fromTo('#s-projects .projects-header', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power3.out' });
        const cards = document.querySelectorAll('.fan-card');
        cards.forEach((c, i) => {
            c.onclick = null;
            c.style.cursor = '';
            c.classList.remove('active-card');
            gsap.fromTo(c, { y: 80, opacity: 0, rotation: 0 }, { y: FAN_TY[i], x: 0, scale: 1, opacity: 1, rotation: FAN_ROT[i], zIndex: FAN_Z[i], duration: .6, delay: i * .08 + .15, ease: 'back.out(1.4)' });
        });
        gsap.fromTo('#fanCta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .4, delay: .7, ease: 'power3.out' });
        fanCta.classList.remove('wheel-mode', 'hidden-cta');
        document.getElementById('wheelRing').classList.remove('visible');

        setTimeout(() => {
            fanReady = true;
            if (!isWheelOpen) {
                wheelEntering = true;
                if (snapTween) { snapTween.kill(); snapTween = null; }

                wheelAngle = -Math.PI / 2;
                activeIdx = 0;

                const cards = fanStage.querySelectorAll('.fan-card');

                isWheelOpen = true;
                document.getElementById('wheelRing').classList.add('visible');
                fanCta.classList.add('wheel-mode');

                cards.forEach((c, i) => {
                    c.classList.remove('active-card');
                    const a = wheelAngle + (i / N) * Math.PI * 2;
                    const x = Math.cos(a) * WHEEL_RX + 30;
                    const y = Math.sin(a) * WHEEL_RY;
                    const sinVal = (Math.sin(a) + 1) / 2;
                    const isTop = i === 0;
                    const scale = isTop ? 1.18 : 0.62 + sinVal * 0.22;
                    const zIdx = isTop ? 20 : Math.round(sinVal * 14) + 1;
                    const alpha = isTop ? 1 : 0.38 + sinVal * 0.42;


                    gsap.to(c, {
                        x, y,
                        rotation: 0,
                        scale,
                        zIndex: zIdx,
                        opacity: alpha,
                        duration: .9,
                        delay: i * .06,
                        ease: 'power3.inOut'
                    });
                });

                setTimeout(() => {
                    applyWheelPositions(false);
                    wheelEntering = false;
                }, N * 60 + 950);
            }
        }, 1000);

    },
    's-contact': () => {
        gsap.fromTo('#s-contact .contact-big', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .65, ease: 'power3.out' });
        gsap.fromTo('#s-contact .contact-note', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .5, delay: .15, ease: 'power3.out' });
        gsap.fromTo('#s-contact .c-link', { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: .44, stagger: .09, delay: .25, ease: 'power3.out' });
        gsap.fromTo('#s-contact .ff', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .38, stagger: .07, delay: .2, ease: 'power3.out' });
        gsap.fromTo('#s-contact .btn-submit', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .38, delay: .55, ease: 'power3.out' });
    }
};

function navigate(toIdx) {
    if (BUSY || toIdx === CUR || toIdx < 0 || toIdx >= SIDS.length) return;
    BUSY = true;
    document.getElementById('pt-logo').textContent = SECTION_TITLES[toIdx];
    const fromEl = document.getElementById(SIDS[CUR]);
    const toEl = document.getElementById(SIDS[toIdx]);
    const dir = toIdx > CUR ? 1 : -1;
    gsap.killTweensOf(fromEl); gsap.killTweensOf(toEl);
    runTransition(() => {
        fromEl.classList.remove('active');
        gsap.set(fromEl, { opacity: 1, y: 0, visibility: 'hidden', clearProps: 'opacity,y' });
        CUR = toIdx; updateUI();
        toEl.classList.add('active');
        gsap.set(toEl, { visibility: 'visible', opacity: 0, y: dir > 0 ? 30 : -30 });
        if (ENTERS[SIDS[CUR]]) setTimeout(() => ENTERS[SIDS[CUR]](), 40);
        gsap.to(toEl, { opacity: 1, y: 0, duration: .4, ease: 'power3.out', onComplete: () => { BUSY = false; } });
    });
}

function updateUI() {
    document.getElementById('progress').style.width = ((CUR / (SIDS.length - 1)) * 100) + '%';
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === CUR));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', +a.dataset.s === CUR));
    document.querySelectorAll('.nav-mobile-menu a').forEach(a => a.classList.toggle('active', +a.dataset.s === CUR));
    document.getElementById('btt').classList.toggle('show', CUR > 0);
    const ticker = document.querySelector('.ticker-wrap');
    if (ticker) ticker.style.display = (CUR === SIDS.length - 1) ? 'none' : '';
}

document.querySelectorAll('.dot').forEach(d => d.addEventListener('click', () => navigate(+d.dataset.s)));
document.querySelectorAll('[data-s]').forEach(el => {
    if (el.classList.contains('nav-mobile-menu') || el.closest('.nav-mobile-menu')) return;
    el.addEventListener('click', e => {
        if (el.tagName === 'A' || el.tagName === 'SPAN') { e.preventDefault(); navigate(+el.dataset.s); }
    });
});
document.getElementById('btt').addEventListener('click', () => navigate(0));

let wCool = false;
window.addEventListener('wheel', e => {
    if (isMobile() || projModal.classList.contains('open') || wCool) return;
    wCool = true; setTimeout(() => wCool = false, 1100);
    if (e.deltaY > 0) navigate(CUR + 1); else navigate(CUR - 1);
}, { passive: true });

let touchY = 0, touchT = 0;
window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; touchT = Date.now(); }, { passive: true });
window.addEventListener('touchend', e => {
    if (isMobile() || projModal.classList.contains('open')) return;
    const dy = touchY - e.changedTouches[0].clientY, dt = Date.now() - touchT;
    if (Math.abs(dy) > 50 && dt < 500) { if (dy > 0) navigate(CUR + 1); else navigate(CUR - 1); }
}, { passive: true });

window.addEventListener('keydown', e => {
    if (projModal.classList.contains('open')) return;
    if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); navigate(CUR + 1); }
    if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); navigate(CUR - 1); }
});

function toggleMobileNav() { document.getElementById('navMobileMenu').classList.toggle('open'); }
function mobileNav(idx) {
    document.getElementById('navMobileMenu').classList.remove('open');
    if (isMobile()) { const el = document.getElementById(SIDS[idx]); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    else navigate(idx);
}

document.querySelectorAll('.btn,.btn-submit').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * .14}px,${(e.clientY - (r.top + r.height / 2)) * .14}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

document.querySelectorAll('.skill-block').forEach((b, i) => b.style.transitionDelay = (i * .035) + 's');

/* ═══ AUTO PULSE ═══ */
let pulseInterval = null;

function startPulse() {
    if (pulseInterval) return;
    pulseInterval = setInterval(() => {
        if (isDragging || projModal.classList.contains('open')) return;
        if (isWheelOpen) {
            closeFlower();
        } else {
            wheelEntering = true;
            if (snapTween) { snapTween.kill(); snapTween = null; }
            isWheelOpen = true;
            document.getElementById('wheelRing').classList.add('visible');
            fanCta.classList.add('wheel-mode');

            const cards = fanStage.querySelectorAll('.fan-card');
            wheelAngle = -Math.PI / 2;
            activeIdx = 0;

            cards.forEach((c, i) => {
                c.classList.remove('active-card');
                const a = wheelAngle + (i / N) * Math.PI * 2;
                const x = Math.cos(a) * WHEEL_RX + 30;
                const y = Math.sin(a) * WHEEL_RY;
                const sinVal = (Math.sin(a) + 1) / 2;
                const isTop = i === 0;
                const scale = isTop ? 1.18 : 0.62 + sinVal * 0.22;
                const zIdx = isTop ? 20 : Math.round(sinVal * 14) + 1;
                const alpha = isTop ? 1 : 0.38 + sinVal * 0.42;
                gsap.to(c, {
                    x, y, rotation: 0, scale, zIndex: zIdx, opacity: alpha,
                    duration: .9, delay: i * .06, ease: 'power3.inOut'
                });
            });

            setTimeout(() => {
                applyWheelPositions(false);
                wheelEntering = false;
            }, N * 60 + 950);
        }
    }, 4000);
}

function stopPulse() {
    if (pulseInterval) { clearInterval(pulseInterval); pulseInterval = null; }
}


function applyMobileMode() {
    document.querySelectorAll('.section').forEach(s => {
        s.style.removeProperty('visibility');
        s.style.removeProperty('opacity');
        s.classList.add('active');
    });
    document.getElementById('progress').style.display = 'none';


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isWheelOpen && fanReady) {

                setTimeout(() => {
                    wheelEntering = true;
                    if (snapTween) { snapTween.kill(); snapTween = null; }
                    isWheelOpen = true;
                    document.getElementById('wheelRing').classList.add('visible');
                    fanCta.classList.add('wheel-mode');

                    const cards = fanStage.querySelectorAll('.fan-card');
                    wheelAngle = -Math.PI / 2;
                    activeIdx = 0;

                    cards.forEach((c, i) => {
                        c.classList.remove('active-card');
                        const a = wheelAngle + (i / N) * Math.PI * 2;
                        const x = Math.cos(a) * WHEEL_RX + 30;
                        const y = Math.sin(a) * WHEEL_RY;
                        const sinVal = (Math.sin(a) + 1) / 2;
                        const isTop = i === 0;
                        const scale = isTop ? 1.18 : 0.62 + sinVal * 0.22;
                        const zIdx = isTop ? 20 : Math.round(sinVal * 14) + 1;
                        const alpha = isTop ? 1 : 0.38 + sinVal * 0.42;
                        gsap.to(c, {
                            x, y, rotation: 0, scale, zIndex: zIdx, opacity: alpha,
                            duration: .9, delay: i * .06, ease: 'power3.inOut'
                        });
                    });

                    setTimeout(() => {
                        applyWheelPositions(false);
                        wheelEntering = false;
                    }, N * 60 + 950);

                    setTimeout(startPulse, 2500);

                }, 600);

            } else if (!entry.isIntersecting && isWheelOpen) {
                stopPulse();
                closeFlower();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(fanStage);
}
if (isMobile()) applyMobileMode();
window.addEventListener('resize', () => { if (isMobile()) applyMobileMode(); });


document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('.btn-submit');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    const data = new FormData(this);

    try {
        const res = await fetch('https://formspree.io/f/mzdavrrz', {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            window.location.href = 'thank-you.html';
        } else {
            btn.innerHTML = '<i class="fas fa-times"></i> Failed — Try Again';
            btn.disabled = false;
        }
    } catch (err) {
        btn.innerHTML = '<i class="fas fa-times"></i> Error — Try Again';
        btn.disabled = false;
    }
});