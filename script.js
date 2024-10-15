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
    const speedIncrement = 0.1; // Cantidad de incremento de velocidad
    const winningScore = 720; // 6 factorial

    // Configuración de los bloques
    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    // Arreglo de los bloques
    let bricks = [];

    // Función para inicializar o regenerar los bloques
    function initializeBricks() {
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 }; // status 1 significa que el bloque está activo
            }
        }
    }

    // Inicializar los bloques al inicio
    initializeBricks();

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

    // Dibujar los bloques
    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) { // Solo dibuja los bloques que están activos
                    let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    // Detectar colisiones con los bloques
    function collisionDetection() {
        let allBricksDestroyed = true; // Bandera para verificar si todos los bloques han sido destruidos

        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let brick = bricks[c][r];
                if (brick.status === 1) {
                    allBricksDestroyed = false; // Si al menos un bloque está activo, no han sido todos destruidos
                    if (
                        x > brick.x && x < brick.x + brickWidth &&
                        y > brick.y && y < brick.y + brickHeight
                    ) {
                        dy = -dy; // Cambiar la dirección de la bola
                        brick.status = 0; // Desactivar el bloque
                        score++; // Aumentar la puntuación
                        dx += dx > 0 ? speedIncrement : -speedIncrement; // Aumentar la velocidad en X
                        dy += dy > 0 ? speedIncrement : -speedIncrement; // Aumentar la velocidad en Y

                        // Verificar si el jugador ha ganado
                        if (score >= winningScore) {
                            alert("¡Ganaste con una puntuación de 6 factorial (720)!");
                            document.location.reload();
                        }
                    }
                }
            }
        }

        // Si todos los bloques han sido destruidos, regenerarlos
        if (allBricksDestroyed && score < winningScore) {
            initializeBricks();
        }
    }

    // Dibujar el juego
    function draw() {
        if (!gameActive) return; // Si el juego no está activo, no hacer nada

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
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
                dx += dx > 0 ? speedIncrement : -speedIncrement; // Aumentar la velocidad en X
                dy += dy > 0 ? speedIncrement : -speedIncrement; // Aumentar la velocidad en Y
            } else {
                // Si la bola cae fuera de la paleta, termina el juego
                gameActive = false;
                alert("Perdiste. Tu puntuación fue: " + score);
                canvas.style.display = 'none'; // Ocultar el canvas cuando el jugador pierda
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
