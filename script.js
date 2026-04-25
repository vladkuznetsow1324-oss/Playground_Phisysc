const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let box = {
    x: 100,
    y: 100,
    size: 80,
    color: '#ff4757',
    isDragging: false,
    vx: 0,
    vy: 0,
    gravity: 0.8,
    bounce: -0.6
};

// Чтобы кубик не улетал при старте
let lastMouseX = 0;
let lastMouseY = 0;

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (mx > box.x && mx < box.x + box.size && my > box.y && my < box.y + box.size) {
        box.isDragging = true;
        box.color = '#2ed573';
    }
});

window.addEventListener('mousemove', (e) => {
    if (box.isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        box.vx = mx - lastMouseX;
        box.vy = my - lastMouseY;

        box.x = mx - box.size / 2;
        box.y = my - box.size / 2;

        lastMouseX = mx;
        lastMouseY = my;
    }
});

window.addEventListener('mouseup', () => {
    if (box.isDragging) {
        box.isDragging = false;
        box.color = '#ff4757';
    }
});

function update() {
    if (!box.isDragging) {
        box.vy += box.gravity;
        box.x += box.vx;
        box.y += box.vy;

        box.vx *= 0.99; // Трение

        // Пол
        if (box.y + box.size > canvas.height) {
            box.y = canvas.height - box.size;
            box.vy *= box.bounce;
            box.vx *= 0.95; 
        }
        // Стены
        if (box.x < 0 || box.x + box.size > canvas.width) {
            box.vx *= -0.8;
            box.x = box.x < 0 ? 0 : canvas.width - box.size;
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

