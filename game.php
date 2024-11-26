<?php
// game.php
session_start();
if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>遊戲 - 星際戰士</title>
    <link rel="stylesheet" href="css/styles.css">
    <!-- GSAP 動畫庫 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
</head>
<body class="bg-dark">
    <!-- 背景動畫 -->
    <div class="background"></div>
    <!-- 遊戲畫布 -->
    <canvas id="gameCanvas"></canvas>
    <!-- 遊戲介面 -->
    <div id="gameUI">
        <div id="scoreBoard">分數：<span id="score">0</span></div>
        <button id="pauseBtn" class="btn btn-outline-light">⏸</button>
        <button id="muteBtn" class="btn btn-outline-light">🔊</button>
        <!-- 移動設備控制 -->
        <div id="mobileControls">
            <button id="leftBtn" class="control-btn">◀</button>
            <button id="shootBtn" class="control-btn">⎵</button>
            <button id="rightBtn" class="control-btn">▶</button>
        </div>
        <div id="startScreen">
            <h1>星際戰士</h1>
            <button id="startBtn">開始遊戲</button>
            <div class="btn-group">
                <a href="scores.php" class="btn btn-outline-light">記分榜</a>
                <a href="profile.php" class="btn btn-outline-light">個人資料</a>
                <a href="logout.php" class="btn btn-outline-danger">登出</a>
            </div>
        </div>
        <div id="gameOverScreen" style="display:none;">
            <h2>遊戲結束</h2>
            <p>你的分數是：<span id="finalScore">0</span></p>
            <div class="btn-group">
                <button id="restartBtn">再玩一次</button>
                <button id="exitBtn">離開</button>
            </div>
        </div>
    </div>
    <script src="js/game.js"></script>
</body>
</html>
