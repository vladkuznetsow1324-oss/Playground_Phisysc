const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let boxes = [];
let particles = [];
let selectedBox = null;
let mouseX = 0, mouseY = 0;
let keys = {}; // Для отслеживания зажатых клавиш A и D

function createBox(x, y) {
    const colors = ['#FF4757', '#2ED573', '#1E90FF', '#ECCC68', '#FFA502'];
    return {
        x: x, y: y,
        size: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: 0, vy: 0,
        angle: 0,
        angleVelocity: 0,
        gravity: 0.6,
        bounce: -0.5,
        isFrozen: false
    };
}

function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            life: 1.0,
            color: color
        });
    }
}

// Отключаем стандартное меню правой кнопки мыши
canvas.oncontextmenu = (e) => e.preventDefault();

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (e.button === 0) { // ЛКМ - Взять
        for (let i = boxes.length - 1; i >= 0; i--) {
            let b = boxes[i];
            if (Math.abs(mx - b.x) < b.size/2 && Math.abs(my - b.y) < b.size/2) {
                selectedBox = b;
                b.isFrozen = false; // Размораживаем при взятии
                return;
            }
        }
    } else if (e.button === 2) { // ПКМ - Взрыв
        createParticles(mx, my, '#ff9f43', 20);
        boxes.forEach(b => {
            let dx = b.x - mx;
            let dy = b.y - my;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let force = 1000 / (dist + 50); // Сила взрыва
            b.vx += (dx / dist) * force;
            b.vy += (dy / dist) * force;
            b.angleVelocity += (Math.random() - 0.5) * force * 0.1;
            b.isFrozen = false;
        });
    }
});

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    if (selectedBox) {
        selectedBox.vx = (mouseX - selectedBox.x) * 0.3;
        selectedBox.vy = (mouseY - selectedBox.y) * 0.3;
        selectedBox.x = mouseX;
        selectedBox.y = mouseY;
    }
});

window.addEventListener('mouseup', () => { selectedBox = null; });

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyE') boxes.push(createBox(mouseX, mouseY));
    if (e.code === 'KeyF') { // Заморозка
        boxes.forEach(b => {
            if (Math.abs(mouseX - b.x) < b.size/2 && Math.abs(mouseY - b.y) < b.size/2) {
                b.isFrozen = !b.isFrozen;
                b.vx = 0; b.vy = 0; b.angleVelocity = 0;
            }
        });
    }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

function update() {
    // Плавный поворот A-D
    if (selectedBox) {
        if (keys['KeyA']) selectedBox.angle -= 0.1;
        if (keys['KeyD']) selectedBox.angle += 0.1;
    }

    boxes.forEach(b => {
        if (b !== selectedBox && !b.isFrozen) {
            b.vy += b.gravity;
            b.x += b.vx; b.y += b.vy;
            b.angle += b.angleVelocity;
            b.vx *= 0.98; b.vy *= 0.98;
            b.angleVelocity *= 0.96;

            if (b.y + b.size/2 > canvas.height) {
                b.y = canvas.height - b.size/2;
                b.vy *= b.bounce;
                b.vx *= 0.9;
            }
            if (b.x - b.size/2 < 0 || b.x + b.size/2 > canvas.width) {
                b.vx *= b.bounce;
                b.x = b.x - b.size/2 < 0 ? b.size/2 : canvas.width - b.size/2;
            }
        }
    });

    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.02;
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
        ctx.fillRect(p.x, p.y, 3, 3);
    });
    ctx.globalAlpha = 1.0;

    boxes.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.fillStyle = b.isFrozen ? '#74b9ff' : b.color; // Синий если застыл
        ctx.shadowBlur = b.isFrozen ? 20 : 10;
        ctx.shadowColor = b.isFrozen ? '#0984e3' : 'black';
        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = b.isFrozen ? 3 : 1;
        ctx.strokeRect(-b.size / 2, -b.size / 2, b.size, b.size);
        ctx.restore();
    });

    ctx.fillStyle = "white";
    ctx.fillText("ЛКМ: Тянуть | ПКМ: Взрыв | E: Спавн | F: Заморозка | A/D: Крутить", 20, 30);
    requestAnimationFrame(draw);
}

draw();
