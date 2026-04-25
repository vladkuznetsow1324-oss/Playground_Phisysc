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
    gravity: 0.8    // Сделал гравитацию чуть сильнее для наглядности
};

function isMouseInBox(mx, my, b) {
    return mx > b.x && mx < b.x + b.size && my > b.y && my < b.y + b.size;
}

canvas.addEventListener('mousedown', (e) => {
    if (isMouseInBox(e.offsetX, e.offsetY, box)) {
        box.isDragging = true;
        box.vy = 0; 
    }
});

window.addEventListener('mousemove', (e) => {
    if (box.isDragging) {
        box.x = e.offsetX - box.size / 2;
        box.y = e.offsetY - box.size / 2;
        box.vy = 0; // Пока держим, скорость не растет
    }
});

window.addEventListener('mouseup', () => {
    box.isDragging = false;
});

// ГЛАВНОЕ: расчет движения
function update() {
    if (!box.isDragging) {
        box.vy += box.gravity; // Гравитация тянет вниз
        box.y += box.vy;       // Применяем скорость к координате

        // Проверка столкновения с полом
        if (box.y + box.size > canvas.height) {
            box.y = canvas.height - box.size;
            box.vy *= -0.5; // Отскок
        }
    }
}

function draw() {
    update(); // <--- ОБЯЗАТЕЛЬНО вызываем расчет физики перед рисованием
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y, box.size, box.size);

    requestAnimationFrame(draw);
}

draw();

