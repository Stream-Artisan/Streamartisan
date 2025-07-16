<?php
// Set your email address
$to = 'services@streamartisan.com';

// Get form data safely
$name    = isset($_POST['name'])    ? strip_tags(trim($_POST['name']))    : '';
$email   = isset($_POST['email'])   ? trim($_POST['email'])               : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';
$phone   = isset($_POST['phone'])   ? strip_tags(trim($_POST['phone']))   : '';
$package = isset($_POST['package']) ? strip_tags(trim($_POST['package'])) : '';

// Validate email format
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo 'Invalid email format.';
    exit;
}

// Prevent header injection
if (preg_match("/[\r\n]/", $name) || preg_match("/[\r\n]/", $email)) {
    echo 'Invalid input detected.';
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

// Set headers (use a fixed From address to avoid DMARC issues)
$headers = "From: Website Form <noreply@yourdomain.com>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Validate required fields
if ($name && $email && $message) {
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo 'OK';
    } else {
        // Log error for debugging (ensure log file is writable)
        error_log("Failed to send email to $to at " . date('Y-m-d H:i:s'), 3, 'email_errors.log');
        echo 'Failed to send email. Please try again later.';
    }
} else {
    echo 'Please fill in all required fields.';
}
?>