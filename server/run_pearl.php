<?php
// server/run_pearl.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input', true));

    if (isset($data['code'])) {
        $code = $data['code'];

        include('interpreter.php');
        $result = runPearl($code);

        echo json_encode(['result' => $result]);
    } else {
        echo json_encode(['error' => 'Tidak ada kode yang diterima.']);
    }
} else {
    echo json_encode(['error' => 'Hanya metode POST yang diperbolehkan.'])
}
?>
