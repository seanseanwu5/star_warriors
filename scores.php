<?php
// scores.php
session_start();
require 'includes/db_connect.php';
$sql = "SELECT users.username, MAX(scores.score) AS max_score 
        FROM scores 
        JOIN users ON scores.user_id = users.id 
        GROUP BY users.id 
        ORDER BY max_score DESC 
        LIMIT 100";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>記分榜 - 星際戰士</title>
    <link rel="stylesheet" href="css/styles.css">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-white">
    <div class="container mt-5">
        <h2 class="text-center">記分榜</h2>
        <table class="table table-dark table-striped mt-4">
            <thead>
                <tr>
                    <th>排名</th>
                    <th>使用者名稱</th>
                    <th>最高分</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($result->num_rows > 0){
                    $rank = 1;
                    while($row = $result->fetch_assoc()){
                        echo "<tr>
                                <td>{$rank}</td>
                                <td>".htmlspecialchars($row['username'])."</td>
                                <td>{$row['max_score']}</td>
                              </tr>";
                        $rank++;
                    }
                } else {
                    echo "<tr><td colspan='3'>目前沒有任何分數紀錄。</td></tr>";
                }
                ?>
            </tbody>
        </table>
        <div class="text-center mt-3">
            <a href="game.php" class="btn btn-success">回到遊戲</a>
            <a href="profile.php" class="btn btn-outline-light">個人資料</a>
            <a href="logout.php" class="btn btn-outline-danger">登出</a>
        </div>
    </div>
</body>
</html>
