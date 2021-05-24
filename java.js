let canvas;
let ctx;
window.onload = function () {
  canvas = document.getElementById("canvas");
  canvas.style.width = "1000px";
  canvas.style.height = "500px";
  ctx = canvas.getContext("2d");
  let snake = new Snake(3, 50, 50);
  snake.start();
  snake.listenKeys();
};
let snakeObject;
class Snake {
  SIZE = 7;
  head_pos_x;
  head_pos_y;
  running = true;
  positions_x = [];
  positions_y = [];
  direction;
  score;
  appleObject;
  speed;
  constructor(length, posx, posy) {
    this.appleObject = new Apple();
    this.appleObject.spawnApple();
    this.head_pos_x = posx;
    this.head_pos_y = posy;
    let pos_x = posx;
    let pos_y = posy;
    this.speed = 120;
    this.direction = "right";
    snakeObject = this;
    this.drawRect(this.head_pos_x, this.head_pos_y);
    this.score = 0;
    for (let i = 0; i < length - 1; i++) {
      pos_x = pos_x + this.SIZE - 17;
      this.positions_x.push(pos_x);
      this.positions_y.push(pos_y);
      this.drawRect(pos_x, pos_y);
    }
  }
  start() {
    setInterval(function () {
      if (snakeObject.running) {
        ctx.clearRect(0, 0, 1000, 800);
        ctx.drawImage(
          snakeObject.appleObject.imageObject,
          snakeObject.appleObject.pos_x,
          snakeObject.appleObject.pos_y
        );
        if (snakeObject.direction === "right") {
          snakeObject.moveRight();
        } else if (snakeObject.direction === "down") {
          snakeObject.moveDown();
        } else if (snakeObject.direction === "up") {
          snakeObject.moveUp();
        } else if (snakeObject.direction === "left") {
          snakeObject.moveLeft();
        }
      }
      snakeObject.appleCollided();
      if (snakeObject.tailCollided()) {
        snakeObject.running = false;
      } else if (snakeObject.wallCollided()) {
        snakeObject.running = false;
      }
    }, 120);
  }
  appleCollided() {
    if (
      ((snakeObject.head_pos_x - snakeObject.appleObject.pos_x < 13 &&
        snakeObject.head_pos_x - snakeObject.appleObject.pos_x >= 0) ||
        (snakeObject.head_pos_x - snakeObject.appleObject.pos_x > -13 &&
          snakeObject.head_pos_x - snakeObject.appleObject.pos_x <= 0)) &&
      ((snakeObject.head_pos_y - snakeObject.appleObject.pos_y < 10 &&
        snakeObject.head_pos_y - snakeObject.appleObject.pos_y > 0) ||
        (snakeObject.head_pos_y - snakeObject.appleObject.pos_y > -10 &&
          snakeObject.head_pos_y - snakeObject.appleObject.pos_y <= 0))
    ) {
      snakeObject.drawRect(
        snakeObject.positions_x[snakeObject.positions_x.length - 1],
        snakeObject.positions_y[snakeObject.positions_y.length - 1]
      );
      snakeObject.positions_x.push(
        snakeObject.positions_x[snakeObject.positions_x.length - 1]
      );
      snakeObject.positions_y.push(
        snakeObject.positions_y[snakeObject.positions_y.length - 1]
      );
      snakeObject.score++;
      snakeObject.appleObject.spawnApple();
      document.getElementById("score").textContent = snakeObject.score;
    }
  }
  tailCollided() {
    for (let i = 0; i < snakeObject.positions_x.length; i++) {
      if (
        ((snakeObject.head_pos_x - snakeObject.positions_x[i] < 5 &&
          snakeObject.head_pos_x - snakeObject.positions_x[i] >= 0) ||
          (snakeObject.head_pos_x - snakeObject.positions_x[i] > -5 &&
            snakeObject.head_pos_x - snakeObject.positions_x[i] <= 0)) &&
        ((snakeObject.head_pos_y - snakeObject.positions_y[i] < 5 &&
          snakeObject.head_pos_y - snakeObject.positions_y[i] > 0) ||
          (snakeObject.head_pos_y - snakeObject.positions_y[i] > -5 &&
            snakeObject.head_pos_y - snakeObject.positions_y[i] <= 0))
      ) {
        return true;
      }
    }
    return false;
  }
  wallCollided() {
    if (snakeObject.head_pos_x < 0 || snakeObject.head_pos_x > 292) {
      return true;
    } else if (snakeObject.head_pos_y < 0 || snakeObject.head_pos_y > 140) {
      return true;
    }
    return false;
  }
  listenKeys() {
    document.addEventListener("keydown", function (e) {
      switch (e.code) {
        case "KeyW":
          if (snakeObject.direction !== "down") {
            snakeObject.direction = "up";
          }
          break;

        case "KeyS":
          if (snakeObject.direction !== "up") {
            snakeObject.direction = "down";
          }
          break;

        case "KeyD":
          if (snakeObject.direction !== "left") {
            snakeObject.direction = "right";
          }
          break;

        case "KeyA":
          if (snakeObject.direction !== "right") {
            snakeObject.direction = "left";
          }
          break;

        default:
          break;
      }
    });
  }
  moveUp() {
    snakeObject.moveToPreviousSquares();
    snakeObject.head_pos_y = snakeObject.head_pos_y - 10;
    snakeObject.drawRect(snakeObject.head_pos_x, snakeObject.head_pos_y);
  }
  moveRight() {
    snakeObject.moveToPreviousSquares();
    snakeObject.head_pos_x = snakeObject.head_pos_x + 10;
    snakeObject.drawRect(snakeObject.head_pos_x, snakeObject.head_pos_y);
  }
  moveLeft() {
    snakeObject.moveToPreviousSquares();
    snakeObject.head_pos_x = snakeObject.head_pos_x - 10;
    snakeObject.drawRect(snakeObject.head_pos_x, snakeObject.head_pos_y);
  }

  moveToPreviousSquares() {
    for (let i = snakeObject.positions_x.length - 1; i >= 0; i--) {
      if (i !== 0) {
        snakeObject.positions_x[i] = snakeObject.positions_x[i - 1];
        snakeObject.positions_y[i] = snakeObject.positions_y[i - 1];
      } else {
        snakeObject.positions_x[i] = snakeObject.head_pos_x;
        snakeObject.positions_y[i] = snakeObject.head_pos_y;
      }
      snakeObject.drawRect(
        snakeObject.positions_x[i],
        snakeObject.positions_y[i]
      );
    }
  }
  moveDown() {
    snakeObject.moveToPreviousSquares();
    snakeObject.head_pos_y = snakeObject.head_pos_y + 10;
    snakeObject.drawRect(snakeObject.head_pos_x, snakeObject.head_pos_y);
  }
  drawRect(posx, posy) {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    ctx.rect(posx, posy, snakeObject.SIZE, snakeObject.SIZE);
    ctx.fill();
    ctx.stroke();
  }
}

class Apple {
  pos_x;
  posy_y;
  imageObject;
  spawnApple() {
    let x = Math.floor(Math.random() * 280) + 5;
    let y = Math.floor(Math.random() * 130) + 5;

    let image = document.createElement("img");
    image.setAttribute("src", "apple.png");
    image.setAttribute("height", 50);
    image.setAttribute("width", 50);
    image.onload = function () {
      ctx.drawImage(image, x, y);
    };
    this.imageObject = image;
    this.pos_x = x;
    this.pos_y = y;
  }
}
