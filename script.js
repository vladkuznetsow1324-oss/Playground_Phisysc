const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let box = {
    x: 100,
    y: 100,
    size: 60,
    color: '#ff4757',
    isDragging: false,
    vy: 0,          // Скорость по вертикали
    gravity: 0.5    // Сила гравитации
};

function isMouseInBox(mx, my, b) {
    return mx > b.x && mx < b.x + b.size && my > b.y && my < b.y + b.size;
}

canvas.addEventListener('mousedown', (e) => {
    if (isMouseInBox(e.offsetX, e.offsetY, box)) {
        box.isDragging = true;
        box.vy = 0; // Обнуляем скорость при захвате
    }
});

window.addEventListener('mousemove', (e) => {
    if (box.isDragging) {
        box.x = e.offsetX - box.size / 2;
        box.y = e.offsetY - box.size / 2;
    }
});

window.addEventListener('mouseup', () => {
    box.isDragging = false;
});

function update() {
    if (!box.isDragging) {
        // 1. Применяем гравитацию к скорости
        box.vy += box.gravity;
        // 2. Двигаем кубик вниз
        box.y += box.vy;

        // 3. Проверка пола (чтобы не улетел вниз)
        if (box.y + box.size > canvas.height) {
            box.y = canvas.height - box.size;
            box.vy *= -0.6; // Отскок (минус меняет направление, 0.6 — гасит энергию)
        }
    }
}

function draw() {
    update(); // Сначала считаем физику
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y, box.size, box.size);

    requestAnimationFrame(draw);
}

draw();
