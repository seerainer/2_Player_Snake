class SnakeGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas"), this.ctx = this.canvas.getContext("2d"), this.gridSize = 20, this.tileCount = {x: this.canvas.width / this.gridSize, y: this.canvas.height / this.gridSize}, this.gameRunning = false, this.gamePaused = false, this.gameLoop = null, this.initializeGame(), this.setupEventListeners(), this.setupKeyboardControls(), this.draw();
  }
  initializeGame() {
    this.snake1 = {x: 10, y: 15, dx: 1, dy: 0, tail: [], maxTail: 5, color: "#4CAF50", length: 5}, this.snake2 = {x: 30, y: 15, dx: -1, dy: 0, tail: [], maxTail: 5, color: "#2196F3", length: 5};
    for (let t = 0; t < 4; t++) this.snake1.tail.push({x: this.snake1.x - t - 1, y: this.snake1.y}), this.snake2.tail.push({x: this.snake2.x + t + 1, y: this.snake2.y});
    this.food = {x: 20, y: 20, color: "#FF6B6B"}, this.generateFood(), this.updateLengthDisplay();
  }
  setupEventListeners() {
    document.getElementById("startBtn").addEventListener("click", () => this.startGame()), document.getElementById("pauseBtn").addEventListener("click", () => this.togglePause()), document.getElementById("restartBtn").addEventListener("click", () => this.restartGame()), document.getElementById("playAgainBtn").addEventListener("click", () => this.restartGame());
  }
  setupKeyboardControls() {
    document.addEventListener("keydown", t => {
      if (this.gameRunning && !this.gamePaused) {
        switch (t.key.toLowerCase()) {
          case "w":
            1 !== this.snake1.dy && (this.snake1.dx = 0, this.snake1.dy = -1);
            break;
          case "s":
            -1 !== this.snake1.dy && (this.snake1.dx = 0, this.snake1.dy = 1);
            break;
          case "a":
            1 !== this.snake1.dx && (this.snake1.dx = -1, this.snake1.dy = 0);
            break;
          case "d":
            -1 !== this.snake1.dx && (this.snake1.dx = 1, this.snake1.dy = 0);
        }
        switch (t.key) {
          case "ArrowUp":
            1 !== this.snake2.dy && (this.snake2.dx = 0, this.snake2.dy = -1), t.preventDefault();
            break;
          case "ArrowDown":
            -1 !== this.snake2.dy && (this.snake2.dx = 0, this.snake2.dy = 1), t.preventDefault();
            break;
          case "ArrowLeft":
            1 !== this.snake2.dx && (this.snake2.dx = -1, this.snake2.dy = 0), t.preventDefault();
            break;
          case "ArrowRight":
            -1 !== this.snake2.dx && (this.snake2.dx = 1, this.snake2.dy = 0), t.preventDefault();
        }
      }
    });
  }
  startGame() {
    this.gameRunning = true, this.gamePaused = false, document.getElementById("startBtn").disabled = true, document.getElementById("pauseBtn").disabled = false, document.getElementById("restartBtn").disabled = false, document.getElementById("gameOverScreen").classList.add("hidden"), this.gameLoop = setInterval(() => {
      this.update(), this.draw();
    }, 150);
  }
  togglePause() {
    this.gamePaused = !this.gamePaused, this.gamePaused ? (clearInterval(this.gameLoop), document.getElementById("pauseBtn").textContent = "Resume") : (this.gameLoop = setInterval(() => {
      this.update(), this.draw();
    }, 150), document.getElementById("pauseBtn").textContent = "Pause");
  }
  restartGame() {
    clearInterval(this.gameLoop), this.gameRunning = false, this.gamePaused = false, document.getElementById("startBtn").disabled = false, document.getElementById("pauseBtn").disabled = true, document.getElementById("restartBtn").disabled = true, document.getElementById("pauseBtn").textContent = "Pause", document.getElementById("gameOverScreen").classList.add("hidden"), this.initializeGame(), this.draw();
  }
  wrapPosition(t, e) {
    return t < 0 ? t = this.tileCount.x - 1 : t >= this.tileCount.x && (t = 0), e < 0 ? e = this.tileCount.y - 1 : e >= this.tileCount.y && (e = 0), {x: t, y: e};
  }
  update() {
    if (!this.gameRunning || this.gamePaused) return;
    const t = this.wrapPosition(this.snake1.x + this.snake1.dx, this.snake1.y + this.snake1.dy), e = this.wrapPosition(this.snake2.x + this.snake2.dx, this.snake2.y + this.snake2.dy);
    if (t.x === e.x && t.y === e.y) return void this.gameOver("tie");
    this.moveSnake(this.snake1), this.moveSnake(this.snake2), this.checkFoodCollision(this.snake1), this.checkFoodCollision(this.snake2);
    const s = this.checkBodyCollisions();
    s.collision && this.gameOver(s.type);
  }
  moveSnake(t) {
    if (0 === t.dx && 0 === t.dy) return;
    t.tail.push({x: t.x, y: t.y}), t.x += t.dx, t.y += t.dy;
    const e = this.wrapPosition(t.x, t.y);
    t.x = e.x, t.y = e.y, t.tail.length > t.maxTail && t.tail.shift();
  }
  checkFoodCollision(t) {
    t.x === this.food.x && t.y === this.food.y && (t.maxTail++, t.length++, this.generateFood(), this.updateLengthDisplay());
  }
  checkBodyCollisions() {
    if (0 === this.snake1.dx && 0 === this.snake1.dy || 0 === this.snake2.dx && 0 === this.snake2.dy) return {collision: false};
    for (let t of this.snake2.tail) if (this.snake1.x === t.x && this.snake1.y === t.y) return {collision: true, type: "snake1_loses"};
    for (let t of this.snake1.tail) if (this.snake2.x === t.x && this.snake2.y === t.y) return {collision: true, type: "snake2_loses"};
    return {collision: false};
  }
  generateFood() {
    this.food.x = Math.floor(Math.random() * this.tileCount.x), this.food.y = Math.floor(Math.random() * this.tileCount.y);
    let t = false;
    this.food.x === this.snake1.x && this.food.y === this.snake1.y && (t = true);
    for (let e of this.snake1.tail) if (this.food.x === e.x && this.food.y === e.y) {
      t = true;
      break;
    }
    this.food.x === this.snake2.x && this.food.y === this.snake2.y && (t = true);
    for (let e of this.snake2.tail) if (this.food.x === e.x && this.food.y === e.y) {
      t = true;
      break;
    }
    t && this.generateFood();
  }
  updateLengthDisplay() {
    document.getElementById("length1").textContent = this.snake1.length, document.getElementById("length2").textContent = this.snake2.length;
  }
  gameOver(t) {
    clearInterval(this.gameLoop), this.gameRunning = false, document.getElementById("startBtn").disabled = false, document.getElementById("pauseBtn").disabled = true, document.getElementById("restartBtn").disabled = true, document.getElementById("finalLength1").textContent = this.snake1.length, document.getElementById("finalLength2").textContent = this.snake2.length;
    let e = "";
    switch (t) {
      case "tie":
        e = "Draw!";
        break;
      case "snake1_loses":
        e = "Player 2 Wins!";
        break;
      case "snake2_loses":
        e = "Player 1 Wins!";
        break;
      default:
        e = "Game Over!";
    }
    document.getElementById("gameOverMessage").textContent = e, document.getElementById("gameOverScreen").classList.remove("hidden");
  }
  draw() {
    this.ctx.fillStyle = "#1a1a2e", this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height), this.ctx.strokeStyle = "#333", this.ctx.lineWidth = 1;
    for (let t = 0; t <= this.tileCount.x; t++) this.ctx.beginPath(), this.ctx.moveTo(t * this.gridSize, 0), this.ctx.lineTo(t * this.gridSize, this.canvas.height), this.ctx.stroke();
    for (let t = 0; t <= this.tileCount.y; t++) this.ctx.beginPath(), this.ctx.moveTo(0, t * this.gridSize), this.ctx.lineTo(this.canvas.width, t * this.gridSize), this.ctx.stroke();
    this.ctx.fillStyle = this.food.color, this.ctx.shadowColor = this.food.color, this.ctx.shadowBlur = 10, this.ctx.fillRect(this.food.x * this.gridSize + 2, this.food.y * this.gridSize + 2, this.gridSize - 4, this.gridSize - 4), this.ctx.shadowBlur = 0, this.drawSnake(this.snake1), this.drawSnake(this.snake2);
  }
  drawSnake(t) {
    this.ctx.fillStyle = t.color;
    for (let e of t.tail) this.ctx.fillRect(e.x * this.gridSize + 1, e.y * this.gridSize + 1, this.gridSize - 2, this.gridSize - 2);
    this.ctx.shadowColor = t.color, this.ctx.shadowBlur = 15, this.ctx.fillRect(t.x * this.gridSize + 1, t.y * this.gridSize + 1, this.gridSize - 2, this.gridSize - 2), this.ctx.shadowBlur = 0, this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(t.x * this.gridSize + 5, t.y * this.gridSize + 5, 3, 3), this.ctx.fillRect(t.x * this.gridSize + this.gridSize - 5 - 3, t.y * this.gridSize + 5, 3, 3);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new SnakeGame;
});
