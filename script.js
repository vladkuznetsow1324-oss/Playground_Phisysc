const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let boxes = [];
let particles = []; // Массив для эффектов (искр)
let selectedBox = null;
let mouseX = 0, mouseY = 0;

function createBox(x, y) {
    const colors = ['#FF4757', '#2ED573', '#1E90FF', '#ECCC68', '#FFA502', '#A29BFE'];
    return {
        x: x, y: y,
        size: 50 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: 0, vy: 0,
        angle: 0,
        angleVelocity: 0,
        gravity: 0.6,
        bounce: -0.5,
        friction: 0.98
    };
}

// Функция для создания искр при ударе
function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1.0,
            color: color
        });
    }
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (let i = boxes.length - 1; i >= 0; i--) {
        let b = boxes[i];
        if (Math.abs(mx - b.x) < b.size/2 && Math.abs(my - b.y) < b.size/2) {
            selectedBox = b;
            return;
        }
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
        selectedBox.angleVelocity = selectedBox.vx * 0.03;
    }
});

window.addEventListener('mouseup', () => { selectedBox = null; });

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE') boxes.push(createBox(mouseX, mouseY));
});

function update() {
    // Коллизии между кубиками
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            let b1 = boxes[i], b2 = boxes[j];
            let dx = b2.x - b1.x, dy = b2.y - b1.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let minD = (b1.size + b2.size) / 2;
            if (dist < minD) {
                let overlap = minD - dist;
                let nx = dx / dist, ny = dy / dist;
                if (!b1.isDragging) { b1.x -= nx * overlap / 2; b1.y -= ny * overlap / 2; }
                if (!b2.isDragging) { b2.x += nx * overlap / 2; b2.y += ny * overlap / 2; }
                [b1.vx, b2.vx] = [b2.vx * 0.7, b1.vx * 0.7];
                [b1.vy, b2.vy] = [b2.vy * 0.7, b1.vy * 0.7];
            }
        }
    }

    boxes.forEach(b => {
        if (b !== selectedBox) {
            b.vy += b.gravity;
            b.x += b.vx; b.y += b.vy;
            b.angle += b.angleVelocity;
            b.vx *= b.friction; b.vy *= b.friction;
            b.angleVelocity *= 0.96;

            if (b.y + b.size/2 > canvas.height) {
                if (Math.abs(b.vy) > 5) createParticles(b.x, b.y + b.size/2, b.color);
                b.y = canvas.height - b.size/2;
                b.vy *= b.bounce;
                b.vx *= 0.9;
                b.angleVelocity *= 0.8;
            }
            if (b.x - b.size/2 < 0 || b.x + b.size/2 > canvas.width) {
                b.vx *= b.bounce;
                b.x = b.x - b.size/2 < 0 ? b.size/2 : canvas.width - b.size/2;
            }
        }
    });

    // Обновление частиц
    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) particles.splice(i, 1);
    });
}

function draw() {
    update();
    // Рисуем красивый фон-градиент
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#1e272e');
    grad.addColorStop(1, '#485460');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем частицы
    particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1.0;

    // Рисуем кубики
    boxes.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        
        // Тень кубика
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size);
        
        // Блик (светлая полоска сверху)
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size / 10);
        
        ctx.restore();
    });

    // Подсказка сверху
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Нажми 'E' - создать кубик | Тяни мышкой | 'A/D' - крутить", 20, 30);

    requestAnimationFrame(draw);
}

draw();
