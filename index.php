<?php
// index.php
session_start();
?>
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>星際戰士 - 首頁</title>
    <link rel="stylesheet" href="css/styles.css">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-white">
    <div class="container text-center mt-5">
        <h1>歡迎來到星際戰士</h1>
        <p class="lead">加入我們，成為最強的星際戰士！</p>
        <?php if(isset($_SESSION['username'])): ?>
            <p>你好，<?php echo htmlspecialchars($_SESSION['username']); ?>！</p>
            <a href="game.php" class="btn btn-success btn-lg">開始遊戲</a>
            <div class="mt-3">
                <a href="scores.php" class="btn btn-outline-light">記分榜</a>
                <a href="profile.php" class="btn btn-outline-light">個人資料</a>
                <a href="logout.php" class="btn btn-outline-danger">登出</a>
            </div>
        <?php else: ?>
            <a href="login.php" class="btn btn-primary btn-lg">登入</a>
            <a href="register.php" class="btn btn-warning btn-lg">註冊</a>
        <?php endif; ?>
    </div>
</body>
</html>
