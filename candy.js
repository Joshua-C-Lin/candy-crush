// 所有花色
const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];

// 更新遊戲版的狀態整列
const board = [];

// 基本數據定義
const rows = 9;
const columns = 9;
let score = 0;
let isFirstTime = true;

// 拖曳時數據
var currTile; // 當下點擊的糖果
var otherTile; // 被替換的糖果

window.onload = function () {
  startGame();

  window.setInterval(() => {
    crushCandy();
    slideCandy();
    generateCandy();
  }, 100);
};

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)]; // 0 - 5.99
}

function startGame() {
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      // e.x: <img id="0-0" src="./images/Red.png">
      let tile = document.createElement("img");
      tile.id = r.toString() + "-" + c.toString();
      tile.src = "./images/" + randomCandy() + ".png";
      tile.setAttribute("class", "cube");

      // 拖曳功能監聽
      tile.addEventListener("dragstart", dragStart);
      tile.addEventListener("dragover", dragOver);
      tile.addEventListener("dragenter", dragEnter);
      tile.addEventListener("dragleave", dragLeave);
      tile.addEventListener("drop", dragDrop);
      tile.addEventListener("dragend", dragEnd);

      // 渲染至元素 board
      document.getElementById("board").append(tile);
      row.push(tile);
    }
    // 更新目前畫面狀況
    board.push(row);
  }
  console.log(board);
}

// 點擊到糖果, 初始化拖曳過程
function dragStart() {
  // 選中要拖曳的糖果
  currTile = this;
}

// 點住糖果, 移動滑鼠拖曳糖果
function dragOver(e) {
  e.preventDefault();
}

// 拖動糖果到觸碰到另一顆糖果
function dragEnter(e) {
  e.preventDefault();
}

// 在另一顆糖果上離開該糖果
function dragLeave() {}

// 在另顆糖果上放下目前拖曳中的糖果
function dragDrop() {
  // 選中要被更換的糖果
  otherTile = this;
}

// 當整個拖曳結束, 交換糖果
function dragEnd() {
  // 判斷當前是否背景為空
  if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
    return;
  }

  // 判斷合理位移
  let currCoords = currTile.id.split("-"); // id="0-0" -> ["0","0"]
  let r = parseInt(currCoords[0]);
  let c = parseInt(currCoords[1]);

  let otherCoords = otherTile.id.split("-");
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);

  let moveLeft = c2 == c - 1 && r == r2;
  let moveRight = c2 == c + 1 && r == r2;
  let moveTop = r2 == r - 1 && c == c2;
  let moveDown = r2 == r + 1 && c == c2;

  let isAdjacent = moveLeft || moveRight || moveTop || moveDown;

  // 更換背景圖片
  if (isAdjacent) {
    let currImg = currTile.src;
    let otherImg = otherTile.src;
    currTile.src = otherImg;
    otherTile.src = currImg;
    isFirstTime = false;

    let validMove = checkValid();
    if (!validMove) {
      let currImg = currTile.src;
      let otherImg = otherTile.src;
      currTile.src = otherImg;
      otherTile.src = currImg;
    }
  }
}

// 消除糖果
function crushCandy() {
  crushFive();
  crushFour();
  crushThree();

  // 更新分數
  if (isFirstTime) {
    document.getElementById("score").innerText = 0;
  } else {
    document.getElementById("score").innerText = score;
  }
}

// 三消
function crushThree() {
  const crushAmount = 2;
  // 檢查 rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - crushAmount; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        if (!isFirstTime) {
          score += 30;
        }
      }
    }
  }

  // 檢查 columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - crushAmount; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        if (!isFirstTime) {
          score += 30;
        }
      }
    }
  }
}

// 四消
function crushFour() {
  const crushAmount = 3;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - crushAmount; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      let candy4 = board[r][c + 3];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        candy4.src = "./images/blank.png";
        if (!isFirstTime) {
          score += 40;
        }
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - crushAmount; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      let candy4 = board[r + 3][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        candy4.src = "./images/blank.png";
        if (!isFirstTime) {
          score += 40;
        }
      }
    }
  }
}

// 五消
function crushFive() {
  const crushAmount = 4;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - crushAmount; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      let candy4 = board[r][c + 3];
      let candy5 = board[r][c + 4];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        candy4.src == candy5.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        candy4.src = "./images/blank.png";
        candy5.src = "./images/blank.png";
        if (!isFirstTime) {
          score += 50;
        }
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - crushAmount; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      let candy4 = board[r + 3][c];
      let candy5 = board[r + 4][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        candy4.src == candy5.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        candy4.src = "./images/blank.png";
        candy5.src = "./images/blank.png";
        if (!isFirstTime) {
          score += 50;
        }
      }
    }
  }
}

// 消除前的檢查
function checkValid() {
  // 檢查 rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  // 檢查 columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      let candy4 = board[r][c + 3];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 3; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      let candy4 = board[r + 3][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 4; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      let candy4 = board[r][c + 3];
      let candy5 = board[r][c + 4];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        candy4.src == candy5.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 4; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      let candy4 = board[r + 3][c];
      let candy5 = board[r + 4][c];
      if (
        candy1.src == candy2.src &&
        candy2.src == candy3.src &&
        candy3.src == candy4.src &&
        candy4.src == candy5.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
    }
  }

  return false;
}

// 更新頁面糖果
function slideCandy() {
  // 讓糖果補下來
  for (let c = 0; c < columns; c++) {
    let index = rows - 1;
    for (let r = columns - 1; r >= 0; r--) {
      if (!board[r][c].src.includes("blank")) {
        board[index][c].src = board[r][c].src;
        index -= 1;
      }
    }

    // 清空滑下來之後上方的糖果
    for (let r = index; r >= 0; r--) {
      board[r][c].src = "./images/blank.png";
    }
  }
}

//更新後補充糖果
function generateCandy() {
  for (let c = 0; c < columns; c++) {
    if (board[0][c].src.includes("blank")) {
      board[0][c].src = "./images/" + randomCandy() + ".png";
    }
  }
}
