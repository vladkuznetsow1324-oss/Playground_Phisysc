const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let boxes = [];
let particles = [];
let selectedBox = null;
let mouseX = 0, mouseY = 0;
let keys = {};

// Настройки
const GRAVITY = 0.6;
const BOUNCE = -0.5;
const FRICTION = 0.98;

function createBox(x, y) {
    const colors = ['#FF4757', '#2ED573', '#1E90FF', '#ECCC68', '#FFA502', '#A29BFE'];
    return {
        x: x, y: y,
        size: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: 0, vy: 0,
        angle: 0,
        angleVelocity: 0,
        isFrozen: false
    };
}

function createParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 15,
            vy: (Math.random() - 0.5) * 15,
            life: 1.0,
            color: color
        });
    }
}

canvas.oncontextmenu = (e) => e.preventDefault();

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (e.button === 0) { // ЛКМ
        for (let i = boxes.length - 1; i >= 0; i--) {
            let b = boxes[i];
            if (Math.abs(mx - b.x) < b.size/2 && Math.abs(my - b.y) < b.size/2) {
                selectedBox = b;
                b.isFrozen = false;
                return;
            }
        }
    } else if (e.button === 2) { // ПКМ - Взрыв
        createParticles(mx, my, '#ff9f43', 25);
        boxes.forEach(b => {
            let dx = b.x - mx;
            let dy = b.y - my;
            let dist = Math.sqrt(dx * dx + dy * dy) || 1;
            let force = 1200 / (dist + 50);
            b.vx += (dx / dist) * force;
            b.vy += (dy / dist) * force;
            b.angleVelocity += (Math.random() - 0.5) * force * 0.2;
            b.isFrozen = false;
        });
    }
});

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    if (selectedBox) {
        selectedBox.vx = (mouseX - selectedBox.x) * 0.4;
        selectedBox.vy = (mouseY - selectedBox.y) * 0.4;
        selectedBox.x = mouseX;
        selectedBox.y = mouseY;
    }
});

window.addEventListener('mouseup', () => { selectedBox = null; });

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyE') boxes.push(createBox(mouseX, mouseY));
    if (e.code === 'KeyF') {
        boxes.forEach(b => {
            if (Math.abs(mouseX - b.x) < b.size/2 && Math.abs(mouseY - b.y) < b.size/2) {
                b.isFrozen = !b.isFrozen;
                b.vx = 0; b.vy = 0; b.angleVelocity = 0;
            }
        });
    }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

function solveCollisions() {
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            let b1 = boxes[i], b2 = boxes[j];
            let dx = b2.x - b1.x, dy = b2.y - b1.y;
            let dist = Math.sqrt(dx * dx + dy * dy) || 1;
            let minD = (b1.size + b2.size) / 2;

            if (dist < minD) {
                let overlap = minD - dist;
                let nx = dx / dist, ny = dy / dist;
                // Расталкивание
                if (!b1.isDragging && !b1.isFrozen) { b1.x -= nx * overlap / 2; b1.y -= ny * overlap / 2; }
                if (!b2.isDragging && !b2.isFrozen) { b2.x += nx * overlap / 2; b2.y += ny * overlap / 2; }
                // Передача импульса
                let p = (b1.vx * nx + b1.vy * ny - b2.vx * nx - b2.vy * ny) * 0.5;
                if (!b1.isFrozen) { b1.vx -= p * nx; b1.vy -= p * ny; b1.angleVelocity += p * 0.01; }
                if (!b2.isFrozen) { b2.vx += p * nx; b2.vy += p * ny; b2.angleVelocity -= p * 0.01; }
            }
        }
    }
}

function update() {
    if (selectedBox) {
        if (keys['KeyA']) selectedBox.angle -= 0.15;
        if (keys['KeyD']) selectedBox.angle += 0.15;
    }

    solveCollisions();

    boxes.forEach(b => {
        if (b !== selectedBox && !b.isFrozen) {
            b.vy += GRAVITY;
            b.x += b.vx; b.y += b.vy;
            b.angle += b.angleVelocity;
            b.vx *= FRICTION; b.vy *= FRICTION;
            b.angleVelocity *= 0.96;

            if (b.y + b.size/2 > canvas.height) {
                if (Math.abs(b.vy) > 6) createParticles(b.x, b.y + b.size/2, b.color, 5);
                b.y = canvas.height - b.size/2;
                b.vy *= BOUNCE;
                b.vx *= 0.9;
                b.angleVelocity *= 0.9;
            }
            if (b.x - b.size/2 < 0 || b.x + b.size/2 > canvas.width) {
                b.vx *= BOUNCE;
                b.x = b.x - b.size/2 < 0 ? b.size/2 : canvas.width - b.size/2;
            }
        }
    });

    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) particles.splice(i, 1);
    });
}

function draw() {
    update();
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#1e272e'); grad.addColorStop(1, '#2f3640');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1.0;

    boxes.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        
        ctx.shadowBlur = b.isFrozen ? 25 : 15;
        ctx.shadowColor = b.isFrozen ? '#00d2ff' : 'rgba(0,0,0,0.5)';
        
        ctx.fillStyle = b.isFrozen ? '#74b9ff' : b.color;
        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size);
        
        // Полоска сверху для объема
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size / 8);
        
        ctx.strokeStyle = b.isFrozen ? 'white' : 'rgba(0,0,0,0.2)';
        ctx.lineWidth = b.isFrozen ? 3 : 1;
        ctx.strokeRect(-b.size / 2, -b.size / 2, b.size, b.size);
        
        ctx.restore();
    });

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "bold 14px Arial";
    ctx.fillText("ЛКМ: Тянуть | ПКМ: Взрыв | E: Создать | F: Заморозка | A/D: Вращать", 25, 35);
    requestAnimationFrame(draw);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

draw();
