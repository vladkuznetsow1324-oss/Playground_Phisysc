const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let boxes = []; // Список всех кубиков
let selectedBox = null; // Тот, который мы держим

let mouseX = 0;
let mouseY = 0;

// Функция создания кубика
function createBox(x, y) {
    const colors = ['#ff4757', '#2ed573', '#1e90ff', '#eccc68', '#ffa502'];
    return {
        x: x,
        y: y,
        size: 60 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: 0,
        vy: 0,
        angle: 0, // Угол поворота
        gravity: 0.8,
        bounce: -0.5
    };
}

// Слушаем мышку
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Ищем, на какой кубик нажали (с конца списка, чтобы брать верхний)
    for (let i = boxes.length - 1; i >= 0; i--) {
        let b = boxes[i];
        if (mx > b.x - b.size/2 && mx < b.x + b.size/2 && my > b.y - b.size/2 && my < b.y + b.size/2) {
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
        selectedBox.vx = mouseX - selectedBox.x;
        selectedBox.vy = mouseY - selectedBox.y;
        selectedBox.x = mouseX;
        selectedBox.y = mouseY;
    }
});

window.addEventListener('mouseup', () => {
    selectedBox = null;
});

// Управление клавишами
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE') {
        boxes.push(createBox(mouseX, mouseY));
    }
    if (selectedBox) {
        if (e.code === 'KeyA') selectedBox.angle -= 0.2; // Поворот влево
        if (e.code === 'KeyD') selectedBox.angle += 0.2; // Поворот вправо
    }
});

function update() {
    boxes.forEach(b => {
        if (b !== selectedBox) {
            b.vy += b.gravity;
            b.x += b.vx;
            b.y += b.vy;
            b.vx *= 0.98;

            if (b.y + b.size/2 > canvas.height) {
                b.y = canvas.height - b.size/2;
                b.vy *= b.bounce;
            }
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
        ctx.translate(b.x, b.y); // Переносим центр координат в кубик
        ctx.rotate(b.angle);    // Поворачиваем
        ctx.fillStyle = b.color;
        ctx.fillRect(-b.size / 2, -b.size / 2, b.size, b.size); // Рисуем от центра
        ctx.restore();
    });

    requestAnimationFrame(draw);
}

draw();
