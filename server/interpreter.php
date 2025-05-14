<?php
// server/interpreter.php

function runPearl($code) {
    $lines = explode("\n", $code);
    $output = '';

    foreach ($lines as $line) {
        $line = trim($line);

        if (strops($line, 'tampilkan') === 0) {
            $output .= substr($line, 9) . "\n";
        } else {
            $output .= "Perintah '$line' tidak dikenali.\n";
        }
    }
    return $output;
}
?>
