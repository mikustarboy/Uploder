<?php
// Konfigurasi
$uploadDir = 'uploads/';
$allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];
$maxFileSize = 100 * 1024 * 1024; // 100 MB

// Pastikan direktori upload ada
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Inisialisasi respons
$response = [
    'success' => false,
    'message' => '',
    'file_type' => '',
    'original_filename' => '',
    'file_url' => ''
];

// Periksa apakah ada file yang diunggah
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $response['message'] = 'Terjadi kesalahan saat mengunggah file';
    
    if (isset($_FILES['file'])) {
        switch ($_FILES['file']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $response['message'] = 'Ukuran file terlalu besar';
                break;
            case UPLOAD_ERR_PARTIAL:
                $response['message'] = 'File hanya terunggah sebagian';
                break;
            case UPLOAD_ERR_NO_FILE:
                $response['message'] = 'Tidak ada file yang diunggah';
                break;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

$file = $_FILES['file'];
$fileSize = $file['size'];
$fileType = $file['type'];
$fileName = $file['name'];
$fileTmpPath = $file['tmp_name'];

// Periksa ukuran file
if ($fileSize > $maxFileSize) {
    $response['message'] = 'Ukuran file melebihi batas maksimum (100 MB)';
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Periksa tipe file
$isImage = in_array($fileType, $allowedImageTypes);
$isVideo = in_array($fileType, $allowedVideoTypes);

if (!$isImage && !$isVideo) {
    $response['message'] = 'Format file tidak diizinkan. Format yang diizinkan: JPG, PNG, GIF, WEBP, MP4, MOV, AVI, MKV, WEBM';
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Buat nama file unik untuk menghindari konflik
$fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
$uniqueFileName = uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $fileExtension;
$uploadFilePath = $uploadDir . $uniqueFileName;

// Coba unggah file
if (move_uploaded_file($fileTmpPath, $uploadFilePath)) {
    // Berhasil
    $response['success'] = true;
    $response['message'] = ($isImage ? 'Gambar' : 'Video') . ' berhasil diunggah';
    $response['file_type'] = $isImage ? 'image' : 'video';
    $response['original_filename'] = htmlspecialchars($fileName);
    
    // Buat URL file
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
    $host = $_SERVER['HTTP_HOST'];
    $response['file_url'] = $protocol . $host . '/' . $uploadFilePath;
    
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    // Gagal
    $response['message'] = 'Terjadi kesalahan saat menyimpan file';
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
