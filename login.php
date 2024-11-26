<?php
// login.php
session_start();
require 'includes/db_connect.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    // 查詢使用者
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->bind_result($id, $hashed_password);
    if ($stmt->fetch()) {
        if (password_verify($password, $hashed_password)) {
            // 登入成功
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            header("Location: game.php");
            exit();
        } else {
            $error = "密碼錯誤。";
        }
    } else {
        $error = "使用者不存在。";
    }
    $stmt->close();
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>登入 - 星際戰士</title>
    <link rel="stylesheet" href="css/styles.css">
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-white">
    <div class="container mt-5">
        <h2 class="text-center">登入</h2>
        <?php if(isset($error)): ?>
            <div class="alert alert-danger"><?php echo $error; ?></div>
        <?php endif; ?>
        <form action="login.php" method="POST" class="mx-auto" style="max-width:400px;">
            <div class="mb-3">
                <label class="form-label">使用者名稱：</label>
                <input type="text" name="username" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">密碼：</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">登入</button>
        </form>
        <p class="text-center mt-3">還沒有帳號？ <a href="register.php" class="text-warning">註冊</a></p>
    </div>
</body>
</html>
