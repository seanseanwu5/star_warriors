<?php
// submit_score.php
session_start();
if(!isset($_SESSION['user_id'])){
    echo "未登入";
    exit();
}
if($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['score'])){
    require 'includes/db_connect.php';
    $user_id = $_SESSION['user_id'];
    $score = intval($_POST['score']);
    $stmt = $conn->prepare("INSERT INTO scores (user_id, score) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $score);
    if($stmt->execute()){
        echo "分數已儲存";
    } else {
        echo "分數儲存失敗";
    }
    $stmt->close();
    $conn->close();
} else {
    echo "無效的請求";
}
?>
