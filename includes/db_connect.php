<?php
// includes/db_connect.php
$servername = "localhost";
$username = "root";
$password = ""; // 根據您的設定調整
$dbname = "star_warriors";
// 建立連接
$conn = new mysqli($servername, $username, $password, $dbname);
// 檢查連接
if ($conn->connect_error) {
    die("連接失敗: " . $conn->connect_error);
}
?>
