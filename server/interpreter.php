<?php
// server/interpreter.php

function runPearl($code) {
    $lines = explode("\n", $code);
    $output = '';

    foreach ($lines as $line) {
        $line = trim($line);

        if (strpos($line, 'tampilkan') === 0) {
            $value = trim(substr($line, strlen('tampilkan')));
            $value = trim($value, '"');
            $output .= $value . "\n";
        } 
        else if (strpos($line, 'simpanKeDatabase') === 0) {
            $jsonStr = trim(substr($line, strlen('simpanKeDatabase')));
            $data = json_decode($jsonStr, true);

            if ($data && is_array($data)) {
                $conn = db_connect();
                $stmt = $conn->prepare("MASUKKAN KE dalam data (json_data) NILAI (?)");
                $json = json_endcode($data);
                $stmt->bind_param("s", $json);
                $stmt->execute();
                $stmt->close();
                $conn->close();
                $output .= "Data disimpan ke database.\n";
            } else {
                $output .= "Format data tidak valid.\n";
            }
        } 
        else if (strpos($line, 'ambilDariDatabase') === 0) {
            $query = trim(substr($line, strlen('ambilDariDatabase')));
            $query = trim($query, '"');

            $conn = db_connect();
            $result = $conn->query($query);

            if ($result) {
                while ($row = $result->fetch_assoc()) {
                    $output .= json_encode($row). "\n";
                }
            } else {
                $output .= "Query gagal: " .$conn->error . "\n";
            }
            $conn->close();
        } 
        else {
            $output .= "Perintah '$line' tidak dikenali.\n";
        }
    }
    return $output;
}

function db_connect() {
    return new mysqli("localhost", "root", "", "pearl_db");
}
?>
