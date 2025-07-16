<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize inputs
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

    // Validate inputs
    if (empty($name) || empty($email) || empty($message)) {
        $_SESSION['form_message'] = 'Please fill out all fields.';
        header("Location: index.html");
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['form_message'] = 'Invalid email format.';
        header("Location: index.html");
        exit;
    }

    // Prevent header injection
    if (preg_match("/[\r\n]/", $name) || preg_match("/[\r\n]/", $email)) {
        $_SESSION['form_message'] = 'Invalid input detected.';
        header("Location: index.html");
        exit;
    }

    // Prepare email
    $to = "services@streamartisan.com";
    $subject = "Contact Form Submission";
    $body = "Name: $name\nEmail: $email\nMessage:\n$message";
    $headers = "From: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        $_SESSION['form_message'] = 'Message sent successfully!';
    } else {
        $_SESSION['form_message'] = 'Failed to send message. Please try again.';
    }

    header("Location: index.html");
    exit;
} else {
    header("Location: index.html");
    exit;
}
?>