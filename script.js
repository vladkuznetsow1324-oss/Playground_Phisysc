const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let box = {
    x: 100,
    y: 0, // Начнем с самого верха
    size: 60,
    vy: 2 // Сделаем постоянную скорость падения без гравитации для теста
};

function draw() {
    // Очистка
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Двигаем кубик вниз
    box.y += box.vy;
    
    // Если улетел за экран — возвращаем наверх
    if (box.y > canvas.height) box.y = -box.size;

    // Рисуем
    ctx.fillStyle = 'red';
    ctx.fillRect(box.x, box.y, box.size, box.size);

    console.log("Кубик сейчас на высоте:", box.y); // Это появится в консоли (F12)

    requestAnimationFrame(draw);
}

draw();
