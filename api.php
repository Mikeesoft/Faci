<?php
// إعدادات الملف لاستقبال البيانات
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");

// =================================================
// 1. بيانات الاتصال (تم وضع بياناتك من الصور)
// =================================================
$servername = "sql100.infinityfree.com";
$username   = "if0_40635597";
$dbname     = "if0_40635597_courses_db";

// ⚠️ ضع كلمة سر الاستضافة هنا (vPanel Password)
$password   = "Aljoker012"; 

// الاتصال بقاعدة البيانات
$conn = new mysqli($servername, $username, $password, $dbname);

// التأكد من صحة الاتصال
if ($conn->connect_error) {
    die(json_encode(["error" => "فشل الاتصال بقاعدة البيانات: " . $conn->connect_error]));
}

// دعم الحروف العربية
$conn->set_charset("utf8");

// =================================================
// 2. المنطق البرمجي (استقبال وارسال البيانات)
// =================================================
$method = $_SERVER['REQUEST_METHOD'];

// أ) إذا كان الطلب قراءة البيانات (GET)
if ($method == 'GET') {
    $sql = "SELECT * FROM courses ORDER BY id DESC";
    $result = $conn->query($sql);

    $courses = array();
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }
    }
    echo json_encode($courses);
}

// ب) إذا كان الطلب إضافة كورس جديد (POST)
elseif ($method == 'POST') {
    // قراءة البيانات المرسلة من الجافاسكريبت
    $data = json_decode(file_get_contents("php://input"), true);

    if(isset($data['title']) && isset($data['video_url'])) {
        $title = $data['title'];
        $desc  = $data['description'];
        $video = $data['video_url'];

        // حماية وأمان (Prevent SQL Injection)
        $stmt = $conn->prepare("INSERT INTO courses (title, description, video_url) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $title, $desc, $video);

        if ($stmt->execute()) {
            echo json_encode(["message" => "تم الحفظ بنجاح"]);
        } else {
            echo json_encode(["error" => "خطأ أثناء الحفظ: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["error" => "البيانات ناقصة"]);
    }
}

$conn->close();
?>
