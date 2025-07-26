<?php
session_start();

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// CSRF Protection
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Rate limiting
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

// Input validation and sanitization
function validateInput($data) {
    $errors = [];
    
    if (empty($data['name']) || strlen($data['name']) < 2) {
        $errors[] = 'Name must be at least 2 characters long';
    }
    
    if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Valid email address is required';
    }
    
    if (empty($data['message']) || strlen($data['message']) < 10) {
        $errors[] = 'Message must be at least 10 characters long';
    }
    
    return $errors;
}

function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Main processing
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ip = $_SERVER['REMOTE_ADDR'];
    
    // Check rate limit
    if (!checkRateLimit($ip)) {
        http_response_code(429);
        $_SESSION['form_status'] = 'error';
        $_SESSION['form_message'] = 'Too many requests. Please try again later.';
        header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? '/index.html'));
        exit;
    }
    
    // Validate CSRF token
    $csrf_token = $_POST['csrf_token'] ?? '';
    if (!validateCSRFToken($csrf_token)) {
        http_response_code(403);
        $_SESSION['form_status'] = 'error';
        $_SESSION['form_message'] = 'Security validation failed. Please try again.';
        header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? '/index.html'));
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
        header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? '/index.html'));
        exit;
    }
    
    // Sanitize input
    $clean_data = array_map('sanitizeInput', $input_data);
    
    // Prepare email
    $to = 'contact@streamartisan.com'; // Replace with actual email
    $subject = 'New Contact Form Submission - ' . $clean_data['name'];
    
    $email_body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #667eea; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-left: 10px; }
            .footer { background: #f8f9fa; padding: 15px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>New Contact Form Submission</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Name:</span>
                <span class='value'>{$clean_data['name']}</span>
            </div>
            <div class='field'>
                <span class='label'>Email:</span>
                <span class='value'>{$clean_data['email']}</span>
            </div>";
    
    if (!empty($clean_data['company'])) {
        $email_body .= "
            <div class='field'>
                <span class='label'>Company:</span>
                <span class='value'>{$clean_data['company']}</span>
            </div>";
    }
    
    if (!empty($clean_data['phone'])) {
        $email_body .= "
            <div class='field'>
                <span class='label'>Phone:</span>
                <span class='value'>{$clean_data['phone']}</span>
            </div>";
    }
    
    if (!empty($clean_data['service_type'])) {
        $email_body .= "
            <div class='field'>
                <span class='label'>Service Type:</span>
                <span class='value'>{$clean_data['service_type']}</span>
            </div>";
    }
    
    if (!empty($clean_data['budget'])) {
        $email_body .= "
            <div class='field'>
                <span class='label'>Budget:</span>
                <span class='value'>{$clean_data['budget']}</span>
            </div>";
    }
    
    $email_body .= "
            <div class='field'>
                <span class='label'>Message:</span>
                <div style='margin-top: 10px; padding: 15px; background: #f8f9fa; border-left: 4px solid #667eea;'>
                    " . nl2br($clean_data['message']) . "
                </div>
            </div>
        </div>
        <div class='footer'>
            <p><strong>Submission Details:</strong></p>
            <p>IP Address: {$ip}</p>
            <p>User Agent: " . sanitizeInput($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "</p>
            <p>Timestamp: " . date('Y-m-d H:i:s T') . "</p>
            <p>Referrer: " . sanitizeInput($_SERVER['HTTP_REFERER'] ?? 'Direct') . "</p>
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
        
        // Send auto-reply to user
        $auto_reply_subject = 'Thank you for contacting StreamArtisan';
        $auto_reply_body = "
        <html>
        <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
            <div style='background: #667eea; color: white; padding: 20px; text-align: center;'>
                <h2>Thank You for Your Interest!</h2>
            </div>
            <div style='padding: 20px;'>
                <p>Hi {$clean_data['name']},</p>
                <p>Thank you for reaching out to StreamArtisan. We've received your message and will get back to you within 24 hours.</p>
                <p>In the meantime, feel free to:</p>
                <ul>
                    <li><a href='https://streamartisan.com/portfolio'>View our portfolio</a></li>
                    <li><a href='https://streamartisan.com/blog'>Read our latest insights</a></li>
                    <li><a href='https://streamartisan.com/services'>Learn about our services</a></li>
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
        
    } else {
        $_SESSION['form_status'] = 'error';
        $_SESSION['form_message'] = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
        
        // Log error
        error_log("Failed to send contact form email from {$clean_data['email']} at " . date('Y-m-d H:i:s'), 3, 'email_errors.log');
    }
    
    // Redirect back to referring page
    header('Location: ' . ($_SERVER['HTTP_REFERER'] ?? '/index.html'));
    exit;
}

// Generate CSRF token for AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'csrf') {
    header('Content-Type: application/json');
    echo json_encode(['token' => generateCSRFToken()]);
    exit;
}

// If accessed directly, redirect to home
header('Location: /index.html');
exit;
?>
