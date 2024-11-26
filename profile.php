<?php
// profile.php
session_start();
if(!isset($_SESSION['user_id'])){
    header("Location: login.php");
    exit();
}
require 'includes/db_connect.php';
$user_id = $_SESSION['user_id'];
// 取得使用者分數紀錄
$stmt = $conn->prepare("SELECT score, created_at FROM scores WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
// 計算最高分和平均分
$stmt_avg = $conn->prepare("SELECT MAX(score) AS max_score, AVG(score) AS avg_score, COUNT(*) AS total_games FROM scores WHERE user_id = ?");
$stmt_avg->bind_param("i", $user_id);
$stmt_avg->execute();
$stats = $stmt_avg->get_result()->fetch_assoc();
$stmt->close();
$stmt_avg->close();
$conn->close();
?>
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>個人資料 - 星際戰士</title>
    <link rel="stylesheet" href="css/styles.css">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-white">
    <div class="container mt-5">
        <h2 class="text-center"><?php echo htmlspecialchars($_SESSION['username']); ?> 的個人資料</h2>
        <div class="mt-4">
            <p>最高分：<?php echo $stats['max_score'] ?? 0; ?></p>
            <p>平均分：<?php echo number_format($stats['avg_score'] ?? 0, 2); ?></p>
            <p>總遊玩次數：<?php echo $stats['total_games'] ?? 0; ?></p>
        </div>
        <h3 class="mt-4">分數紀錄</h3>
        <table class="table table-dark table-striped mt-2">
            <thead>
                <tr>
                    <th>分數</th>
                    <th>日期</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($result->num_rows > 0){
                    while($row = $result->fetch_assoc()){
                        echo "<tr>
                                <td>{$row['score']}</td>
                                <td>{$row['created_at']}</td>
                              </tr>";
                    }
                } else {
                    echo "<tr><td colspan='2'>尚無分數紀錄。</td></tr>";
                }
                ?>
            </tbody>
        </table>
        <div class="text-center mt-3">
            <a href="game.php" class="btn btn-success">回到遊戲</a>
            <a href="scores.php" class="btn btn-outline-light">記分榜</a>
            <a href="logout.php" class="btn btn-outline-danger">登出</a>
        </div>
    </div>
</body>
</html>
