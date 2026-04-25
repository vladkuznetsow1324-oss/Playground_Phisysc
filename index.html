const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Настройки кубика
let box = {
    x: 100,
    y: 100,
    size: 50,
    color: '#ff4757',
    isDragging: false
};

// Проверка: попал ли курсор в кубик
function isMouseInBox(mx, my, b) {
    return mx > b.x && mx < b.x + b.size && my > b.y && my < b.y + b.size;
}

// Слушатели событий мыши
canvas.addEventListener('mousedown', (e) => {
    if (isMouseInBox(e.offsetX, e.offsetY, box)) {
        box.isDragging = true;
    }
});

window.addEventListener('mousemove', (e) => {
    if (box.isDragging) {
        // Центрируем кубик по мышке при перетаскивании
        box.x = e.offsetX - box.size / 2;
        box.y = e.offsetY - box.size / 2;
    }
});

window.addEventListener('mouseup', () => {
    box.isDragging = false;
});

// Главный цикл отрисовки
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка экрана
    
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y, box.size, box.size); // Рисуем кубик

    requestAnimationFrame(draw);
}

draw();
