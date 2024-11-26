// js/game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const exitBtn = document.getElementById('exitBtn'); // 新增的离开按钮
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreEl = document.getElementById('finalScore');
const muteBtn = document.getElementById('muteBtn'); // 静音按钮
const pauseBtn = document.getElementById('pauseBtn'); // 暂停按钮

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const shootBtn = document.getElementById('shootBtn');

let player, projectiles, enemies, particles, stars, powerUps;
let animationId;
let score = 0;
let gameActive = false;
let enemyInterval;
let isPaused = false;
let isMuted = false;

// 输入控制
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let lastShotTime = 0;
const shotInterval = 200; // 射击间隔（毫秒）

// 载入图片
const playerImg = new Image();
playerImg.src = 'images/player.png';
const enemyImg = new Image();
enemyImg.src = 'images/enemy.png';
const bulletImg = new Image();
bulletImg.src = 'images/bullet.png';
const explosionImg = new Image();
explosionImg.src = 'images/explosion.png';
const powerUpImg = new Image();
powerUpImg.src = 'images/powerup.png';

// 载入音效
const shootSound = new Audio('sounds/shoot.mp3');
const explosionSound = new Audio('sounds/explosion.mp3');
const bgMusic = new Audio('sounds/background.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

// 敌人类型
const enemyImgs = {
    basic: enemyImg,
    fast: new Image(),
    tough: new Image()
};
enemyImgs.fast.src = 'images/enemy_fast.png';
enemyImgs.tough.src = 'images/enemy_tough.png';

// 玩家类
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.image = playerImg;
        this.width = 75;
        this.height = 75;
        this.speed = 5;
        this.shielded = false;
        this.doubleShot = false;
    }

    draw() {
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        if (this.shielded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2 + 10, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
}

// 子弹类
class Projectile {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.image = bulletImg;
        this.width = 15;
        this.height = 45;
        this.velocity = velocity;
    }
    draw() {
        ctx.drawImage(this.image, this.x - this.width / 2, this.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.y += this.velocity.y;
    }
}

// 敌人类
class Enemy {
    constructor(x, y, velocity, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.image = enemyImgs[type];
        this.width = 60;
        this.height = 60;
        this.velocity = velocity;
        this.health = type === 'tough' ? 3 : 1;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.y += this.velocity.y;
    }
}

// 粒子类
class Particle {
    constructor(x, y, velocity, alpha) {
        this.x = x;
        this.y = y;
        this.image = explosionImg;
        this.width = 100;
        this.height = 100;
        this.velocity = velocity;
        this.alpha = alpha;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
    update() {
        this.draw();
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

// 道具类
class PowerUp {
    constructor(x, y, velocity, effect) {
        this.x = x;
        this.y = y;
        this.image = powerUpImg;
        this.width = 60;
        this.height = 60;
        this.velocity = velocity;
        this.effect = effect; // 'speed', 'shield', 'doubleShot'
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.y += this.velocity.y;
    }
}

// 初始化星星
function initStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        let speed = Math.random() * 1 + 0.5;
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: speed * 1.2,
            speed: speed
        });
    }
}

// 初始化
function init() {
    player = new Player(canvas.width / 2, canvas.height - 100);
    projectiles = [];
    enemies = [];
    particles = [];
    powerUps = [];
    score = 0;
    scoreEl.innerText = score;
    finalScoreEl.innerText = score;
    initStars();
}

// 生成敌人
function spawnEnemies() {
    enemyInterval = setInterval(() => {
        const x = Math.random() * (canvas.width - 50);
        const y = -50;
        let type = 'basic';
        const rand = Math.random();
        if (rand < 0.1) {
            type = 'tough';
        } else if (rand < 0.3) {
            type = 'fast';
        }

        const velocity = {
            y: type === 'fast' ? (Math.random() * 3 + 3) : (Math.random() * 2 + 1)
        };
        enemies.push(new Enemy(x, y, velocity, type));

        // 生成道具
        if (Math.random() < 0.05) { // 5% 概率生成道具
            const x = Math.random() * (canvas.width - 30);
            const y = -30;
            const velocity = { y: Math.random() * 2 + 1 };
            const effects = ['speed', 'shield', 'doubleShot'];
            const effect = effects[Math.floor(Math.random() * effects.length)];
            powerUps.push(new PowerUp(x, y, velocity, effect));
        }
    }, 1000);
}

// 动画循环
function animate() {
    if (isPaused) return;

    animationId = requestAnimationFrame(animate);

    // 清空画布
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新并绘制星星
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });

    // 更新玩家位置
    if (leftPressed && player.x - player.width / 2 > 0) {
        player.x -= player.speed;
    }
    if (rightPressed && player.x + player.width / 2 < canvas.width) {
        player.x += player.speed;
    }

    player.draw();

    // 处理射击
    if ((spacePressed || spacePressedMobile) && Date.now() - lastShotTime > shotInterval) {
        if (player.doubleShot) {
            // 发射两枚子弹
            projectiles.push(new Projectile(player.x - 10, player.y - 20, { y: -10 }));
            projectiles.push(new Projectile(player.x + 10, player.y - 20, { y: -10 }));
        } else {
            // 发射一枚子弹
            projectiles.push(new Projectile(player.x, player.y - 20, { y: -10 }));
        }
        shootSound.play();
        lastShotTime = Date.now();
    }

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });

    projectiles.forEach((projectile, index) => {
        projectile.update();

        // 超出画面移除
        if (projectile.y + projectile.height <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update();

        // 玩家被击中
        const dist = Math.hypot(player.x - (enemy.x + enemy.width / 2), player.y - (enemy.y + enemy.height / 2));
        if (dist - enemy.width / 2 - player.width / 2 < 1) {
            if (player.shielded) {
                // 消灭敌人并移除护盾
                enemies.splice(index, 1);
                player.shielded = false;
            } else {
                // 结束游戏
                cancelAnimationFrame(animationId);
                clearInterval(enemyInterval);
                gameOver();
            }
        }

        // 敌人超出画面
        if (enemy.y - enemy.height >= canvas.height) {
            setTimeout(() => {
                enemies.splice(index, 1);
            }, 0);
        }

        // 碰撞检测
        projectiles.forEach((projectile, pIndex) => {
            const distX = projectile.x - (enemy.x + enemy.width / 2);
            const distY = projectile.y - (enemy.y + enemy.height / 2);
            const distance = Math.hypot(distX, distY);
            if (distance < enemy.width / 2) {
                // 减少敌人生命值
                enemy.health -= 1;
                // 移除子弹
                projectiles.splice(pIndex, 1);
                // 如果敌人被消灭
                if (enemy.health <= 0) {
                    // 产生粒子
                    for (let i = 0; i < 10; i++) {
                        particles.push(new Particle(enemy.x, enemy.y, { y: Math.random() * -2 }, 1));
                    }
                    explosionSound.play();
                    // 增加分数
                    score += enemy.type === 'tough' ? 30 : (enemy.type === 'fast' ? 15 : 10);
                    scoreEl.innerText = score;
                    // 移除敌人
                    enemies.splice(index, 1);
                } else {
                    // 产生小爆炸
                    particles.push(new Particle(enemy.x, enemy.y, { y: Math.random() * -2 }, 1));
                }
            }
        });
    });

    // 更新道具
    powerUps.forEach((powerUp, index) => {
        powerUp.update();

        // 玩家收集道具
        const dist = Math.hypot(player.x - (powerUp.x + powerUp.width / 2), player.y - (powerUp.y + powerUp.height / 2));
        if (dist - powerUp.width / 2 - player.width / 2 < 1) {
            // 应用道具效果
            applyPowerUp(powerUp.effect);
            // 移除道具
            powerUps.splice(index, 1);
        }

        // 道具超出画面
        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
        }
    });
}

// 应用道具效果
function applyPowerUp(effect) {
    if (effect === 'speed') {
        player.speed += 3;
        setTimeout(() => {
            player.speed -= 3;
        }, 5000); // 加速持续5秒
    } else if (effect === 'shield') {
        player.shielded = true;
        setTimeout(() => {
            player.shielded = false;
        }, 5000); // 护盾持续5秒
    } else if (effect === 'doubleShot') {
        player.doubleShot = true;
        setTimeout(() => {
            player.doubleShot = false;
        }, 5000); // 双重射击持续5秒
    }
}

// 开始游戏
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameActive = true;
    init();
    animate();
    spawnEnemies();
    bgMusic.play();
});

// 再玩一次
restartBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameActive = true;
    init();
    animate();
    spawnEnemies();
    bgMusic.play();
});

// 离开游戏
exitBtn.addEventListener('click', () => {
    location.reload();
});

// 游戏结束
function gameOver() {
    gameActive = false;
    finalScoreEl.innerText = score;
    gameOverScreen.style.display = 'block';
    bgMusic.pause();
    submitScore(score);
}

// 静音按钮
muteBtn.addEventListener('click', () => {
    if (isMuted) {
        bgMusic.volume = 0.5;
        shootSound.volume = 1;
        explosionSound.volume = 1;
        muteBtn.textContent = '🔊';
        isMuted = false;
    } else {
        bgMusic.volume = 0;
        shootSound.volume = 0;
        explosionSound.volume = 0;
        muteBtn.textContent = '🔇';
        isMuted = true;
    }
});

// 暂停按钮
pauseBtn.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        pauseBtn.textContent = '⏸';
        animate();
        bgMusic.play();
    } else {
        isPaused = true;
        pauseBtn.textContent = '▶';
        cancelAnimationFrame(animationId);
        bgMusic.pause();
    }
});

// 键盘事件监听
addEventListener('keydown', (event) => {
    if (gameActive) {
        if (event.key === 'ArrowLeft') {
            leftPressed = true;
        } else if (event.key === 'ArrowRight') {
            rightPressed = true;
        } else if (event.key === ' ') {
            spacePressed = true;
        }
    }
});

addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    } else if (event.key === ' ') {
        spacePressed = false;
    }
});

// 触摸控制
let spacePressedMobile = false;

canvas.addEventListener('touchstart', (e) => {
    if (gameActive) {
        const touchX = e.touches[0].clientX;
        player.x = touchX;
        spacePressedMobile = true;
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (gameActive) {
        const touchX = e.touches[0].clientX;
        player.x = touchX;
    }
});

canvas.addEventListener('touchend', (e) => {
    spacePressedMobile = false;
});

// 移动设备控制按钮
leftBtn.addEventListener('touchstart', () => { leftPressed = true; });
leftBtn.addEventListener('touchend', () => { leftPressed = false; });

rightBtn.addEventListener('touchstart', () => { rightPressed = true; });
rightBtn.addEventListener('touchend', () => { rightPressed = false; });

shootBtn.addEventListener('touchstart', () => { spacePressed = true; });
shootBtn.addEventListener('touchend', () => { spacePressed = false; });

// 提交分数
function submitScore(score) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "submit_score.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            console.log(xhr.responseText);
        }
    };
    xhr.send(`score=${score}`);
}
