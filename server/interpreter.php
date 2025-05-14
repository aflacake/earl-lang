<?php
// server/interpreter.php

function runPearl($code) {
    $lines = explode("\n", $code);
    $output = '';

    foreach ($lines as $line) {
        $line = trim($line);

        if (strops($line, 'tampilkan') === 0) {
            $output .= substr($line, 9) . "\n";
        } 
        else if (strpos($line, 'simpanKeDatabase') === 0) {
            $jsonStr = trim(substr($line, strlen('simpanKeDatabase')));
            $data = json_decode($jsonStr, true);
        } 
        else if (strpos($line, 'ambilDariDatabase') === 0) {
            $query = trim(substr($line, strlen('ambilDariDatabase')));
            $query = trim($query, '"');

            $conn = db_connect();
            $result = $conn->query($query);

            while ($row = $result->fetch_assoc()) {
                $output .= json_encode($row). "\n";
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
