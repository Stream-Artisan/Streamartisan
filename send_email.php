<?php
session_start();

// Enhanced error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to users
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CSRF Token functions
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Rate limiting function
function checkRateLimit($ip) {
    $rate_file = 'rate_limit.json';
    $rate_data = file_exists($rate_file) ? json_decode(file_get_contents($rate_file), true) : [];
    
    $current_time = time();
    $window = 3600; // 1 hour
    $max_attempts = 5;
    
    // Clean old entries
    $rate_data = array_filter($rate_data, function($timestamp) use ($current_time, $window) {
        return ($current_time - $timestamp) < $window;
    });
    
    // Check current IP
    $ip_attempts = array_filter($rate_data, function($timestamp, $key) use ($ip) {
        return strpos($key, $ip) === 0;
    }, ARRAY_FILTER_USE_BOTH);
    
    if (count($ip_attempts) >= $max_attempts) {
        return false;
    }
    
    // Add current attempt
    $rate_data[$ip . '_' . $current_time] = $current_time;
    file_put_contents($rate_file, json_encode($rate_data));
    
    return true;
}

// Input validation function
function validateInput($data) {
    $errors = [];
    
    // Required fields
    if (empty(trim($data['name']))) {
        $errors[] = 'Name is required';
    } elseif (strlen(trim($data['name'])) < 2) {
        $errors[] = 'Name must be at least 2 characters';
    }
    
    if (empty(trim($data['email']))) {
        $errors[] = 'Email is required';
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    if (empty(trim($data['message']))) {
        $errors[] = 'Message is required';
    } elseif (strlen(trim($data['message'])) < 10) {
        $errors[] = 'Message must be at least 10 characters';
    }
    
    // Check for header injection
    foreach (['name', 'email'] as $field) {
        if (preg_match("/[\r\n]/", $data[$field])) {
            $errors[] = 'Invalid characters detected';
            break;
        }
    }
    
    return $errors;
}

// Sanitize input function
function sanitizeInput($data) {
    return [
        'name' => htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8'),
        'email' => filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL),
        'message' => htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8'),
        'company' => htmlspecialchars(trim($data['company'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'phone' => htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'service_type' => htmlspecialchars(trim($data['service_type'] ?? ''), ENT_QUOTES, 'UTF-8'),
        'budget' => htmlspecialchars(trim($data['budget'] ?? ''), ENT_QUOTES, 'UTF-8')
    ];
}

// Determine redirect URL based on referer
function getRedirectUrl() {
    $referer = $_SERVER['HTTP_REFERER'] ?? '/index.html';
    $allowed_pages = [
        'index.html', 'about.html', 'contact.html', 'services.html', 
        'portfolio.html', 'packages.html', 'blog.html', 'digital-existence.html'
    ];
    
    foreach ($allowed_pages as $page) {
        if (strpos($referer, $page) !== false) {
            return $referer;
        }
    }
    
    return '/index.html';
}

// Main processing
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ip = $_SERVER['REMOTE_ADDR'];
    
    // Check rate limit
    if (!checkRateLimit($ip)) {
        http_response_code(429);
        $_SESSION['form_status'] = 'error';
        $_SESSION['form_message'] = 'Too many requests. Please try again later.';
        header('Location: ' . getRedirectUrl());
        exit;
    }
    
    // Validate CSRF token (skip for AJAX requests during transition)
    $csrf_token = $_POST['csrf_token'] ?? '';
    if (!empty($csrf_token) && !validateCSRFToken($csrf_token)) {
        http_response_code(403);
        $_SESSION['form_status'] = 'error';
        $_SESSION['form_message'] = 'Security validation failed. Please try again.';
        header('Location: ' . getRedirectUrl());
        exit;
    }
    
    // Collect and validate input
    $input_data = [
        'name' => $_POST['name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'message' => $_POST['message'] ?? '',
        'company' => $_POST['company'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'service_type' => $_POST['service_type'] ?? '',
        'budget' => $_POST['budget'] ?? ''
    ];
    
    $validation_errors = validateInput($input_data);
    
    if (!empty($validation_errors)) {
        $_SESSION['form_status'] = 'error';
        $_SESSION['form_message'] = implode(', ', $validation_errors);
        
        // For AJAX requests, return JSON
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode(['error' => implode(', ', $validation_errors)]);
            exit;
        }
        
        header('Location: ' . getRedirectUrl());
        exit;
    }
    
    // Sanitize input
    $clean_data = sanitizeInput($input_data);
    
    // Email configuration
    $to = 'services@streamartisan.com';
    $subject = 'New Contact Form Submission - StreamArtisan';
    
    // Create email body
    $email_body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>New Contact Form Submission</title>
    </head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
            <h2 style='color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;'>
                New Contact Form Submission
            </h2>
            
            <div style='background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;'>
                <p><strong>Name:</strong> {$clean_data['name']}</p>
                <p><strong>Email:</strong> {$clean_data['email']}</p>";
                
    if (!empty($clean_data['company'])) {
        $email_body .= "<p><strong>Company:</strong> {$clean_data['company']}</p>";
    }
    if (!empty($clean_data['phone'])) {
        $email_body .= "<p><strong>Phone:</strong> {$clean_data['phone']}</p>";
    }
    if (!empty($clean_data['service_type'])) {
        $email_body .= "<p><strong>Service Type:</strong> {$clean_data['service_type']}</p>";
    }
    if (!empty($clean_data['budget'])) {
        $email_body .= "<p><strong>Budget:</strong> {$clean_data['budget']}</p>";
    }
    
    $email_body .= "
                <p><strong>Message:</strong></p>
                <div style='background: white; padding: 15px; border-left: 4px solid #667eea; margin-top: 10px;'>
                    " . nl2br($clean_data['message']) . "
                </div>
            </div>
            
            <div style='background: #667eea; color: white; padding: 15px; border-radius: 5px; text-align: center;'>
                <p style='margin: 0;'><strong>StreamArtisan Contact System</strong></p>
                <p style='margin: 5px 0 0 0; font-size: 12px;'>Submitted on " . date('Y-m-d H:i:s') . "</p>
            </div>
        </div>
    </body>
    </html>";
    
    // Email headers
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: StreamArtisan Website <noreply@streamartisan.com>',
        'Reply-To: ' . $clean_data['email'],
        'X-Mailer: PHP/' . phpversion(),
        'X-Priority: 1',
        'Return-Path: noreply@streamartisan.com'
    ];
    
    // Send email
    if (mail($to, $subject, $email_body, implode("\r\n", $headers))) {
        $_SESSION['form_status'] = 'success';
        $_SESSION['form_message'] = 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.';
        
        // Log successful submission
        error_log("Contact form submitted successfully from {$clean_data['email']} at " . date('Y-m-d H:i:s'), 3, 'contact_success.log');
        
        // Send auto-reply
        $auto_reply_subject = 'Thank you for contacting StreamArtisan';
        $auto_reply_body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Thank you for contacting StreamArtisan</title>
        </head>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px;'>
                <h2 style='color: #667eea;'>Thank you for reaching out!</h2>
                <p>Dear {$clean_data['name']},</p>
                <p>We've received your message and will get back to you within 24 hours.</p>
                <p>In the meantime, feel free to explore our services:</p>
                <ul>
                    <li><a href='https://streamartisan.com/services'>Our Services</a></li>
                    <li><a href='https://streamartisan.com/portfolio'>Our Portfolio</a></li>
                    <li><a href='https://streamartisan.com/packages'>Service Packages</a></li>
                </ul>
                <p>Best regards,<br>The StreamArtisan Team</p>
            </div>
        </body>
        </html>";
        
        $auto_reply_headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: StreamArtisan <noreply@streamartisan.com>',
            'X-Mailer: PHP/' . phpversion()
        ];
        
        mail($clean_data['email'], $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));
        
        // For AJAX requests, return JSON success
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => $_SESSION['form_message']]);
            exit;
        }
        
    } else {
        $_SESSION['form_status'] = 'error';
        $_SESSION['form_message'] = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
        
        // Log error
        error_log("Failed to send contact form email from {$clean_data['email']} at " . date('Y-m-d H:i:s'), 3, 'email_errors.log');
        
        // For AJAX requests, return JSON error
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => $_SESSION['form_message']]);
            exit;
        }
    }
    
    // Redirect for non-AJAX requests
    header('Location: ' . getRedirectUrl());
    exit;
    
} else {
    // Not a POST request
    header('Location: /index.html');
    exit;
}
?>

