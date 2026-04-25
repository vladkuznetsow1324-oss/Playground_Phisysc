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
    size: 100, // Сделал еще больше, чтобы точно не промахнуться
    color: '#ff4757',
    isDragging: false,
    vy: 0,
    gravity: 0.8
    vx: 0, // скорость по горизонтали
    lastY: 0
    lastX:, 0
};

// Исправленный расчет координат мыши
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    const mouse = getMousePos(e);
    // Проверка попадания
    if (mouse.x > box.x && mouse.x < box.x + box.size && 
        mouse.y > box.y && mouse.y < box.y + box.size) {
        box.isDragging = true;
        box.vy = 0;
        box.color = '#2ed573'; // Станет зеленым при захвате
    }
});

window.addEventListener('mouseup', () => {
    if (box.isDragging) {
        // Вычисляем скорость броска на основе последнего движения
        box.vx = box.x - box.lastX;
        box.vy = box.y - box.lastY;
        box.isDragging = false;
        box.color = '#ff4757';
    }
});


window.addEventListener('mouseup', () => {
    box.isDragging = false;
    box.color = '#ff4757'; // Снова красный
});

function update() {
    if (!box.isDragging) {
        box.vy += box.gravity;
        box.y += box.vy;

        if (box.y + box.size > canvas.height) {
            box.y = canvas.height - box.size;
            box.vy *= -0.5;
            if (Math.abs(box.vy) < 1) box.vy = 0;
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
