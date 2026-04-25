const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let box = {
    x: 100,
    y: 100,
    size: 80,
    color: '#ff4757',
    isDragging: false,
    vx: 0,         // Скорость по горизонтали
    vy: 0,         // Скорость по вертикали
    gravity: 0.8,
    bounce: -0.6,
    lastX: 100,    // Для расчета силы броска
    lastY: 100
};

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    const mouse = getMousePos(e);
    if (mouse.x > box.x && mouse.x < box.x + box.size && 
        mouse.y > box.y && mouse.y < box.y + box.size) {
        box.isDragging = true;
        box.vx = 0;
        box.vy = 0;
        box.color = '#2ed573';
    }
});

window.addEventListener('mousemove', (e) => {
    if (box.isDragging) {
        const mouse = getMousePos(e);
        // Запоминаем старую позицию перед обновлением
        box.lastX = box.x;
        box.lastY = box.y;
        
        box.x = mouse.x - box.size / 2;
        box.y = mouse.y - box.size / 2;
    }
});

window.addEventListener('mouseup', () => {
    if (box.isDragging) {
        // Рассчитываем инерцию броска
        box.vx = box.x - box.lastX;
        box.vy = box.y - box.lastY;
        box.isDragging = false;
        box.color = '#ff4757';
    }
});

function update() {
    if (!box.isDragging) {
        // Физика падения и движения
        box.vy += box.gravity;
        box.x += box.vx;
        box.y += box.vy;

        // Трение (чтобы он не скользил вечно)
        box.vx *= 0.98;

        // Столкновение с полом
        if (box.y + box.size > canvas.height) {
            box.y = canvas.height - box.size;
            box.vy *= box.bounce;
            if (Math.abs(box.vy) < 1) box.vy = 0;
        }
        
        // Столкновение со стенами
        if (box.x < 0) {
            box.x = 0;
            box.vx *= box.bounce;
        } else if (box.x + box.size > canvas.width) {
            box.x = canvas.width - box.size;
            box.vx *= box.bounce;
        }
    }
}

function draw() {
    update();
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y, box.size, box.size);
    requestAnimationFrame(draw);
}

draw();
