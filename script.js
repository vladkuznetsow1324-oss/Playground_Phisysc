const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let boxes = [];
let selectedBox = null;
let mouseX = 0, mouseY = 0;

function createBox(x, y) {
    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#eccc68', '#ffa502'];
    return {
        x: x, y: y,
        size: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: 0, vy: 0,
        angle: 0,
        angleVelocity: 0,
        gravity: 0.6,
        bounce: -0.5,
        friction: 0.97
    };
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
        selectedBox.vx = (mouseX - selectedBox.x) * 0.5;
        selectedBox.vy = (mouseY - selectedBox.y) * 0.5;
        selectedBox.x = mouseX;
        selectedBox.y = mouseY;
        selectedBox.angleVelocity = selectedBox.vx * 0.05;
    }
});

window.addEventListener('mouseup', () => { selectedBox = null; });

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE') boxes.push(createBox(mouseX, mouseY));
});

function checkCollisions() {
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            let b1 = boxes[i];
            let b2 = boxes[j];

            // Дистанция между центрами
            let dx = b2.x - b1.x;
            let dy = b2.y - b1.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let minDistance = (b1.size + b2.size) / 2;

            if (distance < minDistance) {
                // 1. Расталкиваем, чтобы не слипались
                let overlap = minDistance - distance;
                let nx = dx / distance; // Вектор направления удара
                let ny = dy / distance;
                
                if (!b1.isDragging) { b1.x -= nx * overlap / 2; b1.y -= ny * overlap / 2; }
                if (!b2.isDragging) { b2.x += nx * overlap / 2; b2.y += ny * overlap / 2; }

                // 2. Обмен скоростями (упрощенный удар)
                let tempVx = b1.vx;
                let tempVy = b1.vy;
                b1.vx = b2.vx * 0.8;
                b1.vy = b2.vy * 0.8;
                b2.vx = tempVx * 0.8;
                b2.vy = tempVy * 0.8;
                
                // Добавляем вращение от удара
                b1.angleVelocity += (b2.vx - b1.vx) * 0.01;
                b2.angleVelocity += (b1.vx - b2.vx) * 0.01;
            }
        }
    }
}

function update() {
    checkCollisions(); // Проверяем столкновения между кубиками

    boxes.forEach(b => {
        if (b !== selectedBox) {
            b.vy += b.gravity;
            b.x += b.vx;
            b.y += b.vy;
            b.angle += b.angleVelocity;

            b.vx *= b.friction;
            b.vy *= b.friction;
            b.angleVelocity *= 0.96;

            // Пол
            if (b.y + b.size/2 > canvas.height) {
                b.y = canvas.height - b.size/2;
                b.vy *= b.bounce;
                b.vx *= 0.9; // Трение о пол
                b.angleVelocity *= 0.9; // Гасим вращение на полу
            }
            // Стены
            if (b.x - b.size/2 < 0 || b.x + b.size/2 > canvas.width) {
                b.vx *= b.bounce;
                b.x = b.x - b.size/2 < 0 ? b.size/2 : canvas.width - b.size/2;
            }
        }
    });
}

function draw() {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boxes.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(-b.size / 2, -b.size / 2, b.size, b.size); // Обводка
        ctx.restore();
    });
    requestAnimationFrame(draw);
}

draw();

