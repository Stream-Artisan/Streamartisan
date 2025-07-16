<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
  $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
  $message = filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING);

  if (empty($name) || empty($email) || empty($message)) {
    echo "<script>alert('Please fill out all fields.'); window.location.href='index.html';</script>";
    exit;
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "<script>alert('Invalid email format.'); window.location.href='index.html';</script>";
    exit;
  }

  $to = "services@streamartisan.com";
  $subject = "Contact Form Submission";
  $body = "Name: $name\nEmail: $email\nMessage:\n$message";
  $headers = "From: $email\r\n";
  $headers .= "Reply-To: $email\r\n";

  if (mail($to, $subject, $body, $headers)) {
    echo "<script>alert('Message sent successfully!'); window.location.href='index.html';</script>";
  } else {
    echo "<script>alert('Failed to send message. Please try again later.'); window.location.href='index.html';</script>";
  }
} else {
  header("Location: index.html");
  exit;
}
?>