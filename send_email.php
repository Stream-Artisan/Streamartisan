<?php
// Set your email address
$to = 'services@streamartisan.com';

// Get form data safely
$name    = isset($_POST['name'])    ? strip_tags(trim($_POST['name']))    : '';
$email   = isset($_POST['email'])   ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';
// $phone   = isset($_POST['phone'])   ? strip_tags(trim($_POST['phone']))   : '';
// $package = isset($_POST['package']) ? strip_tags(trim($_POST['package'])) : '';

// Build the email content
$email_subject = $subject ? $subject : 'New Website Inquiry';
$email_body = "You have received a new message from your website form.\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
// if ($phone)   $email_body .= "Phone: $phone\n";
// if ($package) $email_body .= "Package: $package\n";
$email_body .= "Message:\n$message\n";

$headers = "From: $name <$email>\r\nReply-To: $email\r\n";

// Validate required fields
if ($name && $email && $message) {
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo 'OK';
    } else {
        echo 'Failed to send email. Please try again.';
    }
} else {
    echo 'Please fill in all required fields.';
}
?>