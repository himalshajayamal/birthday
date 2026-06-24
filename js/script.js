// ============================================
// HAPPY BIRTHDAY BOO 🐻 — JAVASCRIPT
// Photorealistic sky + all features + Puzzle game
// ============================================

// ============================================
// PHOTOREALISTIC SKY CANVAS
// Renders a real night sky using Canvas 2D:
//   • Deep space gradient background
//   • 2,000+ multi-color stars with realistic
//     brightness distribution & twinkle
//   • Milky Way wisp using layered alpha arcs
//   • Photorealistic moon with crater shading,
//     limb darkening, and atmospheric halo
//   • Subtle cloud wisps near horizon
// ============================================
function initSkyCanvas() {
    var canvas = document.getElementById('skyCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', function() { resize(); });

    // --- STAR DATA ---
    var starCount = 1800;
    var stars = [];
    for (var i = 0; i < starCount; i++) {
        var mag = Math.pow(Math.random(), 2.5); // realistic brightness distribution
        var hue = Math.random() < 0.12
            ? (Math.random() < 0.5 ? 220 : 30)  // blue or orange tint
            : 0;
        var sat = hue !== 0 ? (20 + Math.random() * 30) : 0;
        stars.push({
            x:       Math.random(),
            y:       Math.random() * 0.85,
            r:       0.3 + mag * 1.8,
            bright:  0.35 + mag * 0.65,
            hue:     hue,
            sat:     sat,
            phase:   Math.random() * Math.PI * 2,
            speed:   0.4 + Math.random() * 1.2
        });
    }

    // --- MOON POSITION ---
    var moonX = 0.78, moonY = 0.18, moonR = 64;

    var t = 0;

    function drawBackground(w, h) {
        // Deep space gradient — not flat, has subtle navy-to-black sweep
        var sky = ctx.createRadialGradient(w*0.5, 0, 0, w*0.5, h*0.6, h*1.1);
        sky.addColorStop(0.00, '#0d1a35');
        sky.addColorStop(0.18, '#08101f');
        sky.addColorStop(0.50, '#04060f');
        sky.addColorStop(0.85, '#060410');
        sky.addColorStop(1.00, '#030208');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);
    }

    function drawMilkyWay(w, h) {
        // Diagonal band of faint luminosity
        ctx.save();
        ctx.globalAlpha = 0.055;
        for (var i = 0; i < 6; i++) {
            var grd = ctx.createLinearGradient(w*0.1, h*0.0, w*0.9, h*0.75);
            grd.addColorStop(0,   'rgba(180,200,255,0)');
            grd.addColorStop(0.3, 'rgba(180,200,255,0.6)');
            grd.addColorStop(0.5, 'rgba(200,210,255,0.8)');
            grd.addColorStop(0.7, 'rgba(180,200,255,0.5)');
            grd.addColorStop(1,   'rgba(180,200,255,0)');
            ctx.fillStyle = grd;
            ctx.filter = 'blur(' + (18 + i * 14) + 'px)';
            ctx.fillRect(0, 0, w, h);
        }
        ctx.filter = 'none';
        ctx.restore();
    }

    function drawStars(w, h) {
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            var twinkle = 0.7 + 0.3 * Math.sin(t * s.speed + s.phase);
            var alpha = s.bright * twinkle;
            var sx = s.x * w;
            var sy = s.y * h;
            var r  = s.r;

            // Diffraction spike for bright stars
            if (s.bright > 0.80 && r > 1.2) {
                ctx.save();
                ctx.globalAlpha = alpha * 0.35;
                ctx.strokeStyle = s.hue !== 0
                    ? 'hsl(' + s.hue + ',' + s.sat + '%,85%)'
                    : '#c8daff';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(sx - r * 3, sy); ctx.lineTo(sx + r * 3, sy);
                ctx.moveTo(sx, sy - r * 3); ctx.lineTo(sx, sy + r * 3);
                ctx.stroke();
                ctx.restore();
            }

            // Glow halo
            if (r > 0.9) {
                var halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3.5);
                var col = s.hue !== 0
                    ? 'hsla(' + s.hue + ',' + s.sat + '%,85%,'
                    : 'rgba(210,225,255,';
                halo.addColorStop(0,   col + (alpha * 0.55) + ')');
                halo.addColorStop(0.5, col + (alpha * 0.10) + ')');
                halo.addColorStop(1,   col + '0)');
                ctx.beginPath();
                ctx.arc(sx, sy, r * 3.5, 0, Math.PI * 2);
                ctx.fillStyle = halo;
                ctx.fill();
            }

            // Core dot
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fillStyle = s.hue !== 0
                ? 'hsla(' + s.hue + ',' + s.sat + '%,92%,' + alpha + ')'
                : 'rgba(235,240,255,' + alpha + ')';
            ctx.fill();
        }
    }

    function drawMoon(w, h) {
        var mx = moonX * w;
        var my = moonY * h;
        var mr = moonR;

        ctx.save();

        // Outer atmospheric halo — two-layer soft glow
        var atm1 = ctx.createRadialGradient(mx, my, mr*0.9, mx, my, mr*3.8);
        atm1.addColorStop(0,   'rgba(230,225,190,0.18)');
        atm1.addColorStop(0.3, 'rgba(210,205,165,0.07)');
        atm1.addColorStop(1,   'rgba(210,205,165,0)');
        ctx.beginPath();
        ctx.arc(mx, my, mr*3.8, 0, Math.PI*2);
        ctx.fillStyle = atm1;
        ctx.fill();

        var atm2 = ctx.createRadialGradient(mx, my, mr*0.95, mx, my, mr*2.0);
        atm2.addColorStop(0,   'rgba(255,250,220,0.24)');
        atm2.addColorStop(1,   'rgba(255,250,220,0)');
        ctx.beginPath();
        ctx.arc(mx, my, mr*2.0, 0, Math.PI*2);
        ctx.fillStyle = atm2;
        ctx.fill();

        // ---- MOON DISK ----
        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI*2);
        ctx.clip();

        // Base color — warm ivory
        var base = ctx.createRadialGradient(
            mx - mr*0.28, my - mr*0.28, mr*0.05,
            mx,           my,           mr
        );
        base.addColorStop(0.00, '#f7f3e8');
        base.addColorStop(0.40, '#ede6d0');
        base.addColorStop(0.75, '#d6cdb5');
        base.addColorStop(1.00, '#b8aa8e');
        ctx.fillStyle = base;
        ctx.fillRect(mx-mr, my-mr, mr*2, mr*2);

        // Limb darkening — realistic edge fade
        var limb = ctx.createRadialGradient(mx, my, mr*0.65, mx, my, mr);
        limb.addColorStop(0,   'rgba(0,0,0,0)');
        limb.addColorStop(0.7, 'rgba(0,0,0,0.06)');
        limb.addColorStop(1,   'rgba(0,0,0,0.38)');
        ctx.fillStyle = limb;
        ctx.fillRect(mx-mr, my-mr, mr*2, mr*2);

        // ---- CRATERS ----
        var craters = [
            { dx:-0.25, dy:-0.15, r:0.14, d:0.22 }, // Copernicus-like
            { dx: 0.32, dy: 0.28, r:0.10, d:0.18 },
            { dx:-0.10, dy: 0.35, r:0.16, d:0.20 },
            { dx: 0.18, dy:-0.30, r:0.08, d:0.15 },
            { dx:-0.38, dy: 0.10, r:0.09, d:0.17 },
            { dx: 0.05, dy: 0.05, r:0.22, d:0.12 }, // Mare Imbrium-like
            { dx: 0.38, dy:-0.08, r:0.06, d:0.20 },
            { dx:-0.18, dy:-0.38, r:0.07, d:0.16 }
        ];

        craters.forEach(function(c) {
            var cx = mx + c.dx * mr;
            var cy = my + c.dy * mr;
            var cr = c.r * mr;

            // Shadow arc (lower-right)
            var shadow = ctx.createRadialGradient(cx + cr*0.15, cy + cr*0.15, 0, cx, cy, cr);
            shadow.addColorStop(0,   'rgba(0,0,0,' + c.d + ')');
            shadow.addColorStop(0.6, 'rgba(0,0,0,' + (c.d*0.4) + ')');
            shadow.addColorStop(1,   'rgba(0,0,0,0)');
            ctx.beginPath();
            ctx.arc(cx, cy, cr, 0, Math.PI*2);
            ctx.fillStyle = shadow;
            ctx.fill();

            // Highlight rim (upper-left)
            ctx.beginPath();
            ctx.arc(cx - cr*0.12, cy - cr*0.12, cr * 0.35, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(255,255,240,0.12)';
            ctx.fill();
        });

        // Mare (dark flat plains)
        var mares = [
            { dx: 0.05, dy: 0.0,  rx: 0.30, ry: 0.20, a: 0.13 },
            { dx:-0.20, dy: 0.25, rx: 0.18, ry: 0.14, a: 0.10 }
        ];

        mares.forEach(function(m) {
            ctx.beginPath();
            ctx.ellipse(mx + m.dx*mr, my + m.dy*mr, m.rx*mr, m.ry*mr, -0.3, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(80,72,60,' + m.a + ')';
            ctx.fill();
        });

        // Light surface texture noise
        ctx.globalAlpha = 0.08;
        for (var k = 0; k < 55; k++) {
            var tx = mx + (Math.random() - 0.5) * mr * 1.7;
            var ty = my + (Math.random() - 0.5) * mr * 1.7;
            ctx.beginPath();
            ctx.arc(tx, ty, Math.random() * 3.5 + 0.5, 0, Math.PI*2);
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)';
            ctx.fill();
        }

        ctx.restore();
    }

    function drawHorizonGlow(w, h) {
        // Atmospheric glow at horizon horizon
        var grd = ctx.createLinearGradient(0, h*0.75, 0, h);
        grd.addColorStop(0,   'rgba(15,22,50,0)');
        grd.addColorStop(0.6, 'rgba(15,22,50,0.30)');
        grd.addColorStop(1,   'rgba(15,22,50,0.55)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
    }

    function frame() {
        var w = canvas.width;
        var h = canvas.height;
        t += 0.008;

        ctx.clearRect(0, 0, w, h);
        drawBackground(w, h);
        drawMilkyWay(w, h);
        drawStars(w, h);
        drawMoon(w, h);
        drawHorizonGlow(w, h);

        requestAnimationFrame(frame);
    }

    frame();
}

// ============================================
// AOS (Animate On Scroll) INIT
// ============================================
function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true, offset: 100 });
}

// ============================================
// TYPED.JS — TYPING EFFECT
// ============================================
function initTyped() {
    if (typeof Typed === 'undefined') return;
    var heroSub = document.getElementById('heroSubtitle');
    if (heroSub) {
        new Typed('#heroSubtitle', {
            strings: [
                'To the girl who taught me that some connections transcend time...',
                'To my Boo 🐻, forever in my heart...',
                'Happy Birthday, my stargazer...'
            ],
            typeSpeed: 50,
            backSpeed: 28,
            backDelay: 2200,
            startDelay: 2500,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// ============================================
// GSAP ANIMATIONS
// ============================================
function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.hero-title',  { y: 80, opacity: 0, duration: 1.4, ease: 'power4.out', delay: 0.5 });
    gsap.from('.hero-image',  { scale: 0, rotation: 180, opacity: 0, duration: 1.4, ease: 'back.out(1.7)', delay: 0.3 });
    gsap.from('.date-badge',  { scale: 0, opacity: 0, duration: 0.8, ease: 'elastic.out(1,0.5)', delay: 1.1 });
    gsap.from('.counter-box', { y: 40, opacity: 0, duration: 0.7, stagger: 0.18, ease: 'power3.out', delay: 1.4 });

    gsap.from('.letter-content p', {
        scrollTrigger: { trigger: '#letter', start: 'top 70%', toggleActions: 'play none none reverse' },
        y: 28, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out'
    });

    gsap.from('.letter-signature', {
        scrollTrigger: { trigger: '.letter-signature', start: 'top 88%' },
        x: 80, opacity: 0, duration: 0.9, ease: 'power3.out'
    });

    document.querySelectorAll('.timeline-item').forEach(function(item, i) {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: 'top 82%' },
            x: i % 2 === 0 ? -80 : 80, opacity: 0, duration: 0.9, ease: 'power3.out'
        });
    });

    gsap.from('.gallery-item', {
        scrollTrigger: { trigger: '#gallery', start: 'top 72%' },
        scale: 0.85, opacity: 0, duration: 0.55, stagger: 0.09, ease: 'back.out(1.7)'
    });

    gsap.from('.memory-card', {
        scrollTrigger: { trigger: '#memories', start: 'top 72%' },
        y: 50, opacity: 0, rotationX: 12, duration: 0.7, stagger: 0.09, ease: 'power3.out'
    });

    gsap.from('.roast-card', {
        scrollTrigger: { trigger: '#roasts', start: 'top 72%' },
        y: 40, opacity: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out'
    });

    // Video section entrance
    gsap.from('.video-frame', {
        scrollTrigger: { trigger: '#video', start: 'top 70%' },
        scale: 0.92, opacity: 0, duration: 1.0, ease: 'power3.out'
    });
}

// ============================================
// MEMORY CARD REVEAL
// ============================================
function revealMemory(card) {
    var preview = card.querySelector('.memory-preview');
    var text    = card.querySelector('.memory-text');
    var date    = card.querySelector('.memory-date');

    if (text && text.style.display === 'none') {
        if (preview) preview.style.display = 'none';
        text.style.display = 'block';
        if (date) date.textContent = 'A precious memory 💫';
        card.style.borderColor = 'rgba(245,200,66,0.40)';
        for (var i = 0; i < 5; i++) {
            setTimeout(function() { createSparkle(card); }, i * 90);
        }
    }
}

function createSparkle(element) {
    var sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    var rect = element.getBoundingClientRect();
    sparkle.style.left = (rect.left + Math.random() * rect.width)  + 'px';
    sparkle.style.top  = (rect.top  + Math.random() * rect.height) + 'px';
    document.body.appendChild(sparkle);
    setTimeout(function() { sparkle.remove(); }, 900);
}

// ============================================
// QUIZ SYSTEM
// ============================================
var quizData = [
    { question: "What is Boo's full name?", options: ["Dewmini Savindi Katawala","Dewmini Sanduni Katawala","Dewmini Sithumi Katawala","Dewmini Senuri Katawala"], correct: 0 },
    { question: "What is Boo's secret nickname?", options: ["Boo 🐰","Boo 🐻","Boo 🐱","Boo 🦋"], correct: 1 },
    { question: "What is Boo's favorite sugary treat?", options: ["Chocolate","Lollipops","Cotton Candy","Gummy Bears"], correct: 2 },
    { question: "What degree is Boo pursuing?", options: ["Computer Science","Electrical & Telecommunication Engineering","Mechanical Engineering","Civil Engineering"], correct: 1 },
    { question: "What is Boo's favorite color?", options: ["Pink","Purple","Blue","Green"], correct: 2 },
    { question: "When is Boo's birthday?", options: ["June 25, 2002","July 25, 2002","June 15, 2002","July 15, 2002"], correct: 0 },
    { question: "Where is Boo studying?", options: ["University of Colombo","HND Galle","University of Peradeniya","University of Moratuwa"], correct: 1 },
    { question: "What does Boo love to watch at night?", options: ["Movies","The night sky","TV Shows","Fireworks"], correct: 1 }
];

var currentQuestion = 0;
var score = 0;
var quizAnswered = false;

function initQuiz() { updateQuizProgress(); showQuestion(); }

function updateQuizProgress() {
    var p = document.getElementById('quizProgress');
    if (!p) return;
    p.innerHTML = '';
    for (var i = 0; i < quizData.length; i++) {
        var dot = document.createElement('div');
        dot.className = 'quiz-progress-dot' +
            (i === currentQuestion ? ' active' : i < currentQuestion ? ' done' : '');
        p.appendChild(dot);
    }
}

function showQuestion() {
    var c = document.getElementById('quizContent');
    if (!c) return;
    quizAnswered = false;
    if (currentQuestion >= quizData.length) { showQuizResult(); return; }

    var q = quizData[currentQuestion];
    c.innerHTML =
        '<div class="quiz-question">' + q.question + '</div>' +
        '<div class="quiz-options">' +
        q.options.map(function(opt, i) {
            return '<div class="quiz-option" onclick="selectAnswer(' + i + ')">' + opt + '</div>';
        }).join('') +
        '</div><div class="quiz-feedback" id="quizFeedback"></div>';
}

function selectAnswer(idx) {
    if (quizAnswered) return;
    quizAnswered = true;

    var opts = document.querySelectorAll('.quiz-option');
    var fb   = document.getElementById('quizFeedback');
    var q    = quizData[currentQuestion];

    opts[q.correct].classList.add('correct');

    if (idx === q.correct) {
        score++;
        if (fb) fb.textContent = '✨ Correct! You know Boo so well!';
    } else {
        opts[idx].classList.add('wrong');
        if (fb) fb.textContent = '💙 Not quite — the correct answer is highlighted.';
    }

    setTimeout(function() {
        currentQuestion++;
        updateQuizProgress();
        showQuestion();
    }, 1500);
}

function showQuizResult() {
    var c = document.getElementById('quizContent');
    if (!c) return;
    var pct = Math.round((score / quizData.length) * 100);
    var msg = pct === 100 ? 'Wow! You know Boo better than anyone! 🌟'
            : pct >= 75  ? 'Great job! You really know your Boo! 🐻'
            : pct >= 50  ? "Not bad! But there's more to learn about Boo! 💙"
            : 'Time to get to know Boo a little better! 🎂';

    c.innerHTML = '<div class="quiz-result">' +
        '<h3>Quiz Complete!</h3>' +
        '<div class="quiz-score">' + score + '/' + quizData.length + '</div>' +
        '<p>' + msg + '</p>' +
        '<button class="game-btn" onclick="resetQuiz()">Try Again</button>' +
        '</div>';
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    updateQuizProgress();
    showQuestion();
}

// ============================================
// GAME 1 — CATCH THE FALLING STARS
// ============================================
var gameScore = 0;
var gameActive = false;
var gameTimer = null;
var starInterval = null;

function startGame() {
    if (gameActive) return;
    gameActive = true;
    gameScore = 0;

    var scoreEl = document.getElementById('gameScore');
    var btn     = document.getElementById('startGameBtn');
    var area    = document.getElementById('gameArea');

    if (scoreEl) scoreEl.textContent = '0';
    if (btn)  { btn.textContent = 'Game Running...'; btn.disabled = true; }
    if (area) area.innerHTML = '';

    starInterval = setInterval(function() { if (gameActive) spawnStar(); }, 600);
    gameTimer    = setTimeout(endGame, 30000);
}

function spawnStar() {
    var area = document.getElementById('gameArea');
    if (!area) return;

    var star = document.createElement('div');
    star.className = 'game-star';
    star.textContent = ['⭐','🌟','✨'][Math.floor(Math.random() * 3)];
    star.style.left     = Math.random() * 88 + '%';
    star.style.top      = '-30px';
    star.style.fontSize = (Math.random() * 1.4 + 1.4) + 'rem';
    star.style.position = 'absolute';

    star.onclick = function(e) {
        e.stopPropagation();
        if (!gameActive) return;
        gameScore++;
        var scoreEl = document.getElementById('gameScore');
        if (scoreEl) scoreEl.textContent = gameScore;
        this.classList.add('collected');
        for (var i = 0; i < 3; i++) {
            setTimeout(function() { createSparkle(star); }, i * 70);
        }
        setTimeout(function() { if (star.parentNode) star.remove(); }, 400);
    };

    area.appendChild(star);

    var startTime = Date.now();
    var duration  = Math.random() * 2.5 + 2;
    var endTop    = area.clientHeight + 30;

    function fall() {
        if (!gameActive || !star.parentNode) return;
        var prog = Math.min((Date.now() - startTime) / 1000 / duration, 1);
        star.style.top = (-30 + (endTop + 30) * prog) + 'px';
        if (prog < 1) requestAnimationFrame(fall);
        else if (star.parentNode) star.remove();
    }
    requestAnimationFrame(fall);
}

function endGame() {
    gameActive = false;
    clearInterval(starInterval);
    clearTimeout(gameTimer);

    var area = document.getElementById('gameArea');
    var btn  = document.getElementById('startGameBtn');

    if (area) {
        area.querySelectorAll('.game-star').forEach(function(s) { s.remove(); });
        var msg = gameScore >= 20 ? 'Amazing! You are a star catcher! 🌟'
                : gameScore >= 10 ? 'Great job! Keep practicing! ⭐'
                : gameScore >= 5  ? 'Nice try! The stars are tricky! 💫'
                : 'Keep trying! The stars are waiting! ✨';

        area.innerHTML = '<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;color:#f5c842;padding:20px;">' +
            '<div style="font-size:3rem;margin-bottom:16px;">🎉</div>' +
            '<div style="font-size:2rem;font-weight:700;">Game Over!</div>' +
            '<div style="font-size:1.4rem;margin-top:10px;">You caught ' + gameScore + ' stars!</div>' +
            '<div style="font-size:0.95rem;color:#8a9fb8;margin-top:10px;">' + msg + '</div>' +
            '</div>';
    }
    if (btn) { btn.textContent = 'Play Again'; btn.disabled = false; }
}

// ============================================
// GAME 2 — SLIDING PHOTO PUZZLE
// (with improved image loading & console logging)
// ============================================
var puzzleState      = [];
var puzzleSolved     = false;
var puzzleMoves      = 0;
var puzzleBestScore  = Infinity;
var puzzleImageFile  = 'gallery-01.jpg';
var puzzleImageBase  = 'assets/images/gallery/';

var PUZZLE_SIZE = 3;

function initPuzzle() {
    puzzleState = [0,1,2,3,4,5,6,7,8];
    puzzleSolved = false;
    puzzleMoves  = 0;
    renderPuzzle();
    logImagePaths(); // debug helper
}

function getPuzzleImgUrl() {
    return puzzleImageBase + puzzleImageFile;
}

function renderPuzzle() {
    var board = document.getElementById('puzzleBoard');
    if (!board) return;
    board.innerHTML = '';

    var boardW = board.offsetWidth || 300;
    var tileW  = Math.floor(boardW / PUZZLE_SIZE);
    var tileH  = tileW;

    var imgUrl = getPuzzleImgUrl();

    puzzleState.forEach(function(val, idx) {
        var tile = document.createElement('div');
        tile.className = 'puzzle-tile' + (val === 8 ? ' empty' : '');
        tile.dataset.idx = idx;

        if (val !== 8) {
            var srcRow = Math.floor(val / PUZZLE_SIZE);
            var srcCol = val % PUZZLE_SIZE;

            // Use a background image with a fallback color if it fails
            tile.style.backgroundImage = 'url("' + imgUrl + '")';
            tile.style.backgroundSize  = (boardW) + 'px ' + (tileH * PUZZLE_SIZE) + 'px';
            tile.style.backgroundPositionX = -(srcCol * tileW) + 'px';
            tile.style.backgroundPositionY = -(srcRow * tileH) + 'px';

            // Fallback: if image doesn't load, show a colored tile
            tile.style.backgroundColor = '#1a2035';

            if (val === idx) tile.classList.add('correct-pos');
            tile.onclick = function() { moveTile(parseInt(this.dataset.idx)); };
        }

        board.appendChild(tile);
    });

    if (!puzzleSolved && isPuzzleSolved()) {
        puzzleSolved = true;
        showPuzzleWin();
    }
}

function moveTile(clickedIdx) {
    if (puzzleSolved) return;
    var emptyIdx = puzzleState.indexOf(8);
    if (!isAdjacent(clickedIdx, emptyIdx)) return;

    var tmp = puzzleState[clickedIdx];
    puzzleState[clickedIdx] = puzzleState[emptyIdx];
    puzzleState[emptyIdx]   = tmp;

    puzzleMoves++;
    document.getElementById('puzzleMoves').textContent = puzzleMoves;

    renderPuzzle();
}

function isAdjacent(a, b) {
    var ar = Math.floor(a / PUZZLE_SIZE), ac = a % PUZZLE_SIZE;
    var br = Math.floor(b / PUZZLE_SIZE), bc = b % PUZZLE_SIZE;
    return (Math.abs(ar - br) + Math.abs(ac - bc)) === 1;
}

function isPuzzleSolved() {
    for (var i = 0; i < puzzleState.length; i++) {
        if (puzzleState[i] !== i) return false;
    }
    return true;
}

function shufflePuzzle() {
    puzzleState = [0,1,2,3,4,5,6,7,8];
    puzzleSolved = false;
    puzzleMoves  = 0;
    document.getElementById('puzzleMoves').textContent = '0';

    for (var i = 0; i < 200; i++) {
        var emptyIdx = puzzleState.indexOf(8);
        var neighbors = getNeighbors(emptyIdx);
        var pick = neighbors[Math.floor(Math.random() * neighbors.length)];
        var tmp = puzzleState[pick];
        puzzleState[pick] = 8;
        puzzleState[emptyIdx] = tmp;
    }

    var board = document.getElementById('puzzleBoard');
    var banner = board && board.querySelector('.puzzle-solved-banner');
    if (banner) banner.remove();

    renderPuzzle();
}

function getNeighbors(idx) {
    var row = Math.floor(idx / PUZZLE_SIZE);
    var col = idx % PUZZLE_SIZE;
    var n = [];
    if (row > 0) n.push(idx - PUZZLE_SIZE);
    if (row < PUZZLE_SIZE - 1) n.push(idx + PUZZLE_SIZE);
    if (col > 0) n.push(idx - 1);
    if (col < PUZZLE_SIZE - 1) n.push(idx + 1);
    return n;
}

function solvePuzzle() {
    puzzleState = [0,1,2,3,4,5,6,7,8];
    puzzleSolved = true;
    renderPuzzle();
    showPuzzleWin();
}

function showPuzzleWin() {
    if (puzzleMoves < puzzleBestScore && puzzleMoves > 0) {
        puzzleBestScore = puzzleMoves;
        document.getElementById('puzzleBest').textContent = puzzleBestScore;
    }

    var board = document.getElementById('puzzleBoard');
    if (!board) return;

    var old = board.querySelector('.puzzle-solved-banner');
    if (old) old.remove();

    var banner = document.createElement('div');
    banner.className = 'puzzle-solved-banner';
    banner.innerHTML =
        '<h3>🎉 Puzzle Complete!</h3>' +
        '<p style="color:#9ab0cc;font-size:0.9rem;margin-bottom:18px;">' +
            (puzzleMoves > 0 ? 'Solved in ' + puzzleMoves + ' moves!' : 'Full photo unlocked!') +
        '</p>' +
        '<button class="game-btn" onclick="shufflePuzzle()">Play Again</button>';

    board.style.position = 'relative';
    board.appendChild(banner);

    triggerConfetti();
}

function changePuzzleImage() {
    var sel = document.getElementById('puzzleImageSelect');
    if (sel) {
        puzzleImageFile = sel.value;
        puzzleState = [0,1,2,3,4,5,6,7,8];
        puzzleSolved = false;
        puzzleMoves  = 0;
        document.getElementById('puzzleMoves').textContent = '0';

        var board = document.getElementById('puzzleBoard');
        var banner = board && board.querySelector('.puzzle-solved-banner');
        if (banner) banner.remove();

        shufflePuzzle();
    }
}

// --- Helper: log image paths for debugging ---
function logImagePaths() {
    console.log('🔍 Hero image path: assets/images/hero/boo-main.jpg');
    var galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(function(img, i) {
        console.log('📸 Gallery image ' + (i+1) + ': ' + img.src);
    });
    console.log('🧩 Puzzle image base: ' + puzzleImageBase + puzzleImageFile);
}

// ============================================
// CANDY RAIN (FIXED — no orphaned code)
// ============================================
window.triggerCandyRain = function() {
    var container = document.getElementById('candyContainer');
    if (!container) { console.warn('candyContainer not found'); return; }
    var candies = ['🍭','🍬','🍡','🧁','🍰','🎂','🍫','🍩'];
    for (var i = 0; i < 60; i++) {
        setTimeout(function() {
            var candy = document.createElement('div');
            candy.className = 'candy';
            candy.textContent = candies[Math.floor(Math.random() * candies.length)];
            candy.style.left = Math.random() * 100 + '%';
            candy.style.top = '-60px';
            candy.style.position = 'absolute';
            candy.style.animationDuration = (Math.random() * 2 + 2) + 's';
            candy.style.fontSize = (Math.random() * 2 + 1.5) + 'rem';
            candy.style.zIndex = '9999';
            container.appendChild(candy);
            setTimeout(function() { if(candy.parentNode) candy.remove(); }, 4500);
        }, i * 80);
    }
};

// ============================================
// CONFETTI (FIXED — no orphaned code)
// ============================================
window.triggerConfetti = function() {
    var container = document.getElementById('confettiContainer');
    if (!container) { console.warn('confettiContainer not found'); return; }
    var colors = ['#f5c842','#ff6b6b','#4ecdc4','#45b7d1','#96ceb4','#ffeaa7','#fd79a8','#ffffff'];
    for (var i = 0; i < 120; i++) {
        setTimeout(function() {
            var c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + '%';
            c.style.top = '-20px';
            c.style.position = 'absolute';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.animationDuration = (Math.random() * 2 + 2) + 's';
            c.style.width = (Math.random() * 10 + 6) + 'px';
            c.style.height = (Math.random() * 10 + 6) + 'px';
            c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            c.style.zIndex = '9999';
            container.appendChild(c);
            setTimeout(function() { if(c.parentNode) c.remove(); }, 4500);
        }, i * 40);
    }
};

// ============================================
// MUSIC PLAYER
// ============================================
var musicPlaying = false;
var audioEl = null;

function toggleMusic() {
    if (!audioEl) audioEl = document.getElementById('bgMusic');
    var icon = document.getElementById('musicIcon');
    var text = document.getElementById('musicText');
    if (!icon || !text) return;

    musicPlaying = !musicPlaying;
    if (musicPlaying) {
        audioEl.play().catch(function() {
            musicPlaying = false;
            icon.textContent = '🎵';
            text.textContent = 'Click to Play';
        });
        icon.textContent = '🎶';
        text.textContent = 'Playing...';
        icon.style.animation = 'musicPulse 0.5s ease-in-out infinite';
    } else {
        audioEl.pause();
        icon.textContent = '🎵';
        text.textContent = 'Our Song';
        icon.style.animation = 'musicPulse 2s ease-in-out infinite';
    }
}

// ============================================
// COUNTERS
// ============================================
function initCounters() {
    var ageEl  = document.getElementById('ageCounter');
    var daysEl = document.getElementById('daysCounter');

    if (ageEl) {
        var age = 0, target = 24;
        var iv = setInterval(function() { ageEl.textContent = ++age; if (age >= target) clearInterval(iv); }, 90);
    }
    if (daysEl) {
        var days = 0, tDays = 1460;
        var iv2 = setInterval(function() {
            days += 20;
            if (days >= tDays) { days = tDays; clearInterval(iv2); }
            daysEl.textContent = days.toLocaleString();
        }, 40);
    }
}

// ============================================
// ROTATING QUOTES
// ============================================
var quotes = [
    { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
    { text: "The stars shine brightest in the darkest nights.", author: "Unknown" },
    { text: "Some souls are just meant to be, even if the world tries to keep them apart.", author: "Unknown" },
    { text: "In the end, we only regret the chances we didn't take.", author: "Lewis Carroll" },
    { text: "You are my sun, my moon, and all my stars.", author: "E.E. Cummings" }
];
var currentQuote = 0;

function initQuotes() {
    var qText   = document.getElementById('quoteText');
    var qAuthor = document.getElementById('quoteAuthor');
    if (!qText || !qAuthor) return;

    setInterval(function() {
        currentQuote = (currentQuote + 1) % quotes.length;
        if (typeof gsap !== 'undefined') {
            gsap.to([qText, qAuthor], { opacity: 0, duration: 0.5, onComplete: function() {
                qText.textContent   = quotes[currentQuote].text;
                qAuthor.textContent = '— ' + quotes[currentQuote].author;
                gsap.to([qText, qAuthor], { opacity: 1, duration: 0.5 });
            }});
        } else {
            qText.textContent   = quotes[currentQuote].text;
            qAuthor.textContent = '— ' + quotes[currentQuote].author;
        }
    }, 8000);
}

// ============================================
// GALLERY LIGHTBOX (FIXED — targets .carousel-card)
// ============================================
function initGallery() {
    document.querySelectorAll('.carousel-card').forEach(function(item) {
        item.addEventListener('click', function() {
            var img     = this.querySelector('img');
            var caption = this.querySelector('.gallery-caption');
            var lb      = document.getElementById('lightbox');
            var lbImg   = document.getElementById('lightboxImg');
            var lbCap   = document.getElementById('lightboxCaption');

            if (lb && lbImg && img) {
                lbImg.src = img.src;
                if (lbCap) lbCap.textContent = caption ? caption.textContent : '';
                lb.style.display = 'flex';
            }
        });
    });
}

function closeLightbox() {
    var lb = document.getElementById('lightbox');
    if (lb) lb.style.display = 'none';
}

// ============================================
// HAMBURGER MENU
// ============================================
function initHamburger() {
    var hamburger = document.getElementById('hamburger');
    var navLinks  = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('show');
        var spans = this.querySelectorAll('span');
        if (navLinks.classList.contains('show')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else {
            spans.forEach(function(s) { s.style.transform = 'none'; s.style.opacity = '1'; });
        }
    });
}

// ============================================
// SPARKLE ON CLICK
// ============================================
function initSparkleClick() {
    document.addEventListener('click', function(e) {
        var tag = e.target.tagName.toLowerCase();
        if (tag !== 'button' && tag !== 'a' && !e.target.closest('.quiz-option') && !e.target.closest('.game-star') && !e.target.closest('.puzzle-tile')) {
            var sp = document.createElement('div');
            sp.className  = 'sparkle';
            sp.style.left = e.clientX + 'px';
            sp.style.top  = e.clientY + 'px';
            document.body.appendChild(sp);
            setTimeout(function() { sp.remove(); }, 900);
        }
    });
}

// ============================================
// FOOTER HEART
// ============================================
function initFooterHeart() {
    var h = document.querySelector('.footer-heart');
    if (h) {
        h.addEventListener('click', function() {
            triggerConfetti();
            this.style.animation = 'heartbeat 0.5s ease-in-out infinite';
            var self = this;
            setTimeout(function() { self.style.animation = 'heartbeat 1.5s ease-in-out infinite'; }, 2000);
        });
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function initKeyboard() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'c' || e.key === 'C') triggerConfetti();
        if (e.key === 's' || e.key === 'S') triggerCandyRain();
        if (e.key === 'Escape') closeLightbox();
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ============================================
// CONSOLE MESSAGE
// ============================================
function consoleMessage() {
    console.log('%c🐻 Happy Birthday Boo! 🐻', 'font-size:28px;color:#f5c842;font-weight:bold;');
    console.log('%cPress C for confetti, S for candy rain, Esc to close lightbox!', 'font-size:12px;color:#4ecdc4;');
}

// ============================================
// MAIN INIT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    try { initSkyCanvas(); } catch(e) { console.warn('Sky canvas error:', e.message); }
    try { initAOS(); }       catch(e) { console.warn('AOS error:', e.message); }
    try { initTyped(); }     catch(e) { console.warn('Typed.js error:', e.message); }
    try { initGSAP(); }      catch(e) { console.warn('GSAP error:', e.message); }
    try { initQuiz(); }      catch(e) { console.warn('Quiz error:', e.message); }
    try { initPuzzle(); }    catch(e) { console.warn('Puzzle error:', e.message); }
    try { initCounters(); }  catch(e) { console.warn('Counters error:', e.message); }
    try { initQuotes(); }    catch(e) { console.warn('Quotes error:', e.message); }
    try { initGallery(); }   catch(e) { console.warn('Gallery error:', e.message); }
    try { initSmoothScroll(); } catch(e) { console.warn('SmoothScroll error:', e.message); }
    try { initSparkleClick(); } catch(e) { console.warn('Sparkle error:', e.message); }
    try { initHamburger(); }    catch(e) { console.warn('Hamburger error:', e.message); }
    try { initFooterHeart(); }  catch(e) { console.warn('FooterHeart error:', e.message); }
    try { initKeyboard(); }     catch(e) { console.warn('Keyboard error:', e.message); }
    consoleMessage();
});

// ============================================
// 3D GALLERY CAROUSEL
// ============================================
var galleryAngle = 0;
var galleryTotal = 6;
var galleryStep = 360 / galleryTotal;

function updateGalleryCarousel() {
    var carousel = document.getElementById('galleryCarousel');
    if (!carousel) return;
    var cards = carousel.querySelectorAll('.carousel-card');
    cards.forEach(function(card, i) {
        var angle = galleryAngle + (i * galleryStep);
        var rad = (angle * Math.PI) / 180;
        var x = Math.sin(rad) * 300;
        var z = Math.cos(rad) * 300 - 300;
        var rotateY = -angle;
        card.style.transform = 'translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + rotateY + 'deg)';
        card.style.opacity = z > -100 ? 1 : 0.3;
        card.style.zIndex = Math.round(z + 300);
    });
}

function nextGallery() {
    galleryAngle -= galleryStep;
    updateGalleryCarousel();
}

function prevGallery() {
    galleryAngle += galleryStep;
    updateGalleryCarousel();
}

function rotateGallery(index) {
    galleryAngle = -index * galleryStep;
    updateGalleryCarousel();
}

// Initialize gallery carousel on load
updateGalleryCarousel();