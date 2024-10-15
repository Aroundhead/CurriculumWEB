document.addEventListener("DOMContentLoaded", function () {
    // Añadir comportamiento de desplazamiento suave a los enlaces de la navbar
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - 50, // Ajuste para el desplazamiento de la navbar
                behavior: "smooth"
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    let ballRadius = 10;
    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;
    let score = 0;
    let gameActive = false; // Controla si el juego está activo o no

    // Referencias al DOM
    const startGameBtn = document.getElementById('startGameBtn');
    const scoreDisplay = document.getElementById('score');

    // Dibujar la bola
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    // Dibujar la paleta
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    // Dibujar el juego
    function draw() {
        if (!gameActive) return; // Si el juego no está activo, no hacer nada

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        scoreDisplay.textContent = "Puntuación: " + score;

        // Colisión con los bordes
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
                score++; // Aumentar la puntuación cuando la bola rebota en la paleta
            } else {
                // Si la bola cae fuera de la paleta, termina el juego
                gameActive = false;
                alert("Perdiste. Tu puntuación fue: " + score);
                startGameBtn.disabled = true; // Desactivar el botón para que no pueda jugar de nuevo
            }
        }

        // Movimiento de la paleta
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
        requestAnimationFrame(draw);
    }

    // Control con el teclado
    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    // Iniciar el juego
    function startGame() {
        gameActive = true;
        score = 0;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
        startGameBtn.disabled = true; // Desactivar el botón al iniciar el juego
        canvas.style.display = 'block'; // Mostrar el canvas cuando el juego comience
        draw();
    }

    // Eventos de teclado
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // Evento para iniciar el juego al hacer clic en el botón
    startGameBtn.addEventListener('click', startGame);
});
