// game.js
const gameBoard = document.getElementById('game-board');
const levelIndicator = document.getElementById('level');
const timerIndicator = document.getElementById('timer');

let level, timer, player, coins, enemies, obstacles;

function initGame() {
  level = 1;
  timer = 60;
  coins = [];
  enemies = [];
  obstacles = [];

  spawnPlayer();
  spawnCoins();
  spawnEnemies();
  spawnObstacles();

  levelIndicator.textContent = level;
  timerIndicator.textContent = timer;
  

  setInterval(updateGame, 1000 / 30); // Update the game 30 times per second
  setInterval(() => {
    timer -= 1;
    timerIndicator.textContent = timer;
    if (timer <= 0) {
      endGame();
    }
  }, 1000); // Update the timer every second
}

function spawnPlayer() {
    player = document.createElement('div');
    player.className = 'player';
    player.style.width = '20px';
    player.style.height = '20px';
    player.style.backgroundColor = '#0f0';
    player.style.left = `${(gameBoard.clientWidth - parseInt(player.style.width)) / 2}px`;
    player.style.top = `${(gameBoard.clientHeight - parseInt(player.style.height)) / 2}px`;
    gameBoard.appendChild(player);
  }

function spawnCoins() {
  for (let i = 0; i < 4; i++) {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.width = '10px';
    coin.style.height = '10px';
    coin.style.backgroundColor = '#ff0';

    // Set random position for the coin
    coin.style.left = `${Math.floor(Math.random() * (gameBoard.clientWidth - 10))}px`;
    coin.style.top = `${Math.floor(Math.random() * (gameBoard.clientHeight - 10))}px`;

    coins.push(coin);
    gameBoard.appendChild(coin);
  }
}

function spawnEnemies() {
    for (let i = 0; i < level; i++) {
      const enemy = document.createElement('div');
      enemy.className = 'enemy';
      enemy.style.width = '20px';
      enemy.style.height = '20px';
      enemy.style.backgroundColor = '#f00';
  
      // Set random position for the enemy
      const x = Math.floor(Math.random() * (gameBoard.clientWidth - 20));
      const y = Math.floor(Math.random() * (gameBoard.clientHeight - 20));
      enemy.style.left = `${x}px`;
      enemy.style.top = `${y}px`;
  
      // Place enemy against a wall
      const nearLeftWall = x < gameBoard.clientWidth / 2;
      const nearTopWall = y < gameBoard.clientHeight / 2;
      if (nearLeftWall) {
        enemy.style.left = '0px';
      } else {
        enemy.style.left = `${gameBoard.clientWidth - 20}px`;
      }
      if (nearTopWall) {
        enemy.style.top = '0px';
      } else {
        enemy.style.top = `${gameBoard.clientHeight - 20}px`;
      }
  
      enemies.push(enemy);
      gameBoard.appendChild(enemy);
    }
  }
  

function spawnObstacles() {
  // Spawn obstacles with random sizes and positions
}

function updateGame() {
  moveEnemies();
  detectCollisions();
}

function moveEnemies() {
    // Randomly move enemies in the play area
    for (const enemy of enemies) {
      const direction = Math.floor(Math.random() * 4);
      const step = 6;
  
      switch (direction) {
        case 0: // Up
          enemy.style.top = `${Math.max(parseInt(enemy.style.top) - step, 0)}px`;
          break;
        case 1: // Down
          enemy.style.top = `${Math.min(parseInt(enemy.style.top) + step, gameBoard.clientHeight - 20)}px`;
          break;
        case 2: // Left
          enemy.style.left = `${Math.max(parseInt(enemy.style.left) - step, 0)}px`;
          break;
        case 3: // Right
          enemy.style.left = `${Math.min(parseInt(enemy.style.left) + step, gameBoard.clientWidth - 20)}px`;
          break;
        default:
          break;
      }
    }
  }
  
  function detectCollisions() {
    // Check for collisions between the player, coins, enemies, and obstacles
    for (const coin of coins) {
      if (isColliding(player, coin)) {
        gameBoard.removeChild(coin);
        coins.splice(coins.indexOf(coin), 1);
        if (coins.length === 0) {
          advanceLevel();
        }
      }
    }
  
    for (const enemy of enemies) {
      if (isColliding(player, enemy)) {
        endGame();
      }
    }
  }
  
  function isColliding(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
  
    return !(
      aRect.top + aRect.height < bRect.top ||
      aRect.top > bRect.top + bRect.height ||
      aRect.left + aRect.width < bRect.left ||
      aRect.left > bRect.left + bRect.width
    );
  }
  
  function handleInput(e) {
    // Process user input (arrow keys)
    const step = 20;
  
    switch (e.key) {
      case 'ArrowUp':
        player.style.top = `${Math.max(parseInt(player.style.top) - step, 0)}px`;
        break;
      case 'ArrowDown':
        player.style.top = `${Math.min(parseInt(player.style.top) + step, gameBoard.clientHeight - 20)}px`;
        break;
      case 'ArrowLeft':
        player.style.left = `${Math.max(parseInt(player.style.left) - step, 0)}px`;
        break;
      case 'ArrowRight':
        player.style.left = `${Math.min(parseInt(player.style.left) + step, gameBoard.clientWidth - 20)}px`;
        break;
      default:
        break;
    }
  }
  
  function advanceLevel() {
    level++;
    levelIndicator.textContent = level;
    timer = 60;
    timerIndicator.textContent = timer;
  
    removeAll(coins);
    removeAll(enemies);
    removeAll(obstacles);
    removeAll([player]);
  
    spawnPlayer();
    spawnCoins();
    spawnEnemies();
    spawnObstacles();
  }
  
  function removeAll(elements) {
    for (const element of elements) {
      gameBoard.removeChild(element);
    }
    elements.length = 0;
  }
  
  function endGame() {
    alert('Game Over');
    location.reload();
  }



  // Event listener for user input
  document.addEventListener('keydown', handleInput);

  // Touch control buttons
  function setupTouchControls() {
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    if (btnUp) {
      btnUp.addEventListener('click', () => handleInput({ key: 'ArrowUp' }));
      btnUp.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput({ key: 'ArrowUp' });
      });
    }

    if (btnDown) {
      btnDown.addEventListener('click', () => handleInput({ key: 'ArrowDown' }));
      btnDown.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput({ key: 'ArrowDown' });
      });
    }

    if (btnLeft) {
      btnLeft.addEventListener('click', () => handleInput({ key: 'ArrowLeft' }));
      btnLeft.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput({ key: 'ArrowLeft' });
      });
    }

    if (btnRight) {
      btnRight.addEventListener('click', () => handleInput({ key: 'ArrowRight' }));
      btnRight.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput({ key: 'ArrowRight' });
      });
    }
  }

  // Setup touch controls
  setupTouchControls();

  // Start the game
  initGame();
