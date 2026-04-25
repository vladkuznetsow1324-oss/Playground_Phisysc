const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Растягиваем на весь экран
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let box = {
    x: 100,
    y: 100,
    size: 80, // Сделаем чуть побольше, чтобы легче попадать
    color: '#ff4757',
    isDragging: false,
    vy: 0,
    gravity: 0.9, // Увеличил гравитацию (было 0.5)
    bounce: -0.6  // Сила отскока
};

// Функция проверки попадания мышки
function isMouseInBox(mx, my, b) {
    return mx > b.x && mx < b.x + b.size && my > b.y && my < b.y + b.size;
}

canvas.addEventListener('mousedown', (e) => {
    // Используем clientX/Y для точности
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isMouseInBox(mouseX, mouseY, box)) {
        box.isDragging = true;
        box.vy = 0; // Останавливаем падение при захвате
    }
});

window.addEventListener('mousemove', (e) => {
    if (box.isDragging) {
        const rect = canvas.getBoundingClientRect();
        box.x = (e.clientX - rect.left) - box.size / 2;
        box.y = (e.clientY - rect.top) - box.size / 2;
        box.vy = 0; 
    }
});

window.addEventListener('mouseup', () => {
    box.isDragging = false;
});

function update() {
    if (!box.isDragging) {
        box.vy += box.gravity;
        box.y += box.vy;

        // Пол
        if (box.y + box.size > canvas.height) {
            box.y = canvas.height - box.size;
            box.vy *= box.bounce; // Отскок
            
            // Остановка мелкого дрожания
            if (Math.abs(box.vy) < 1) box.vy = 0;
        }
    }
}

function draw() {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    // Рисуем кубик с небольшой тенью для красоты
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y, box.size, box.size);

    requestAnimationFrame(draw);
}

draw();
