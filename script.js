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
        size: 50 + Math.random() * 30,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: 0, vy: 0,
        angle: 0,
        angleVelocity: 0, // Скорость вращения
        gravity: 0.8,
        bounce: -0.6,
        friction: 0.98
    };
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (let i = boxes.length - 1; i >= 0; i--) {
        let b = boxes[i];
        // Простая проверка попадания с учетом центра
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
        selectedBox.vx = mouseX - selectedBox.x;
        selectedBox.vy = mouseY - selectedBox.y;
        selectedBox.x = mouseX;
        selectedBox.y = mouseY;
        // При движении мышкой кубик немного закручивается
        selectedBox.angleVelocity = selectedBox.vx * 0.02;
    }
});

window.addEventListener('mouseup', () => { selectedBox = null; });

window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE') boxes.push(createBox(mouseX, mouseY));
});

function update() {
    boxes.forEach(b => {
        if (b !== selectedBox) {
            b.vy += b.gravity;
            b.x += b.vx;
            b.y += b.vy;
            b.angle += b.angleVelocity; // Кубик вращается сам!

            b.vx *= b.friction;
            b.vy *= b.friction;
            b.angleVelocity *= 0.99; // Затухание вращения

            // Отскок от пола
            if (b.y + b.size/2 > canvas.height) {
                b.y = canvas.height - b.size/2;
                b.vy *= b.bounce;
                // При ударе об пол вращение меняется в зависимости от скорости
                b.angleVelocity += b.vx * 0.05; 
            }
            // Отскок от стен
            if (b.x - b.size/2 < 0 || b.x + b.size/2 > canvas.width) {
                b.vx *= b.bounce;
                b.x = b.x - b.size/2 < 0 ? b.size/2 : canvas.width - b.size/2;
                b.angleVelocity += b.vy * 0.05; 
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
        
        // Рисуем маленькую точку, чтобы было видно, где "перед" у кубика
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(b.size/4, -b.size/4, b.size/10, b.size/10);
        
        ctx.restore();
    });

    requestAnimationFrame(draw);
}

draw();
