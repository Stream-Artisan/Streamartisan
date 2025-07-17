<?php
session_start();
require 'vendor/autoload.php'; // Include PHPMailer (install via Composer)

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get form data safely
$name    = isset($_POST['name'])    ? strip_tags(trim($_POST['name']))    : '';
$email   = isset($_POST['email'])   ? trim($_POST['email'])               : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';
$phone   = isset($_POST['phone'])   ? strip_tags(trim($_POST['phone']))   : '';
$package = isset($_POST['package']) ? strip_tags(trim($_POST['package'])) : '';

// Validate email format
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Invalid email format.';
    header('Location: /index.php');
    exit;
}

// Prevent header injection
if (preg_match("/[\r\n]/", $name) || preg_match("/[\r\n]/", $email)) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Invalid input detected.';
    header('Location: /index.php');
    exit;
}

// Validate required fields
if (!$name || !$email || !$message) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Please fill in all required fields.';
    header('Location: /index.php');
    exit;
}

// Build the email content
$email_subject = $subject ? $subject : 'New Website Inquiry';
$email_body = "You have received a new message from your website form.\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
if ($phone)   $email_body .= "Phone: $phone\n";
if ($package) $email_body .= "Package: $package\n";
$email_body .= "Message:\n$message\n";

// Initialize PHPMailer
$mail = new PHPMailer(true);
try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com'; // Hostinger SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'services@streamartisan.com'; // Your Hostinger email
    $mail->Password = 'Altis9290@&$..'; // Your email password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Recipients
    $mail->setFrom('noreply@streamartisan.com', 'Website Form');
    $mail->addAddress('services@streamartisan.com');
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(false);
    $mail->Subject = $email_subject;
    $mail->Body = $email_body;

    $mail->send();
    $_SESSION['form_status'] = 'success';
    $_SESSION['form_message'] = 'The form has been submitted successfully.';
} catch (Exception $e) {
    error_log("Failed to send email: {$mail->ErrorInfo} at " . date('Y-m-d H:i:s'), 3, 'email_errors.log');
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Failed to send email. Please try again later.';
}

// Redirect to index page
header('Location: /index.php');
exit;
?>