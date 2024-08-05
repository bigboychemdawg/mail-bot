<?php

require_once '../../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendMail($account, $recipient, $subject, $body, $id) {
    $mail = new PHPMailer(true);

    try {
        // Настройки сервера
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = $account->email;
        $mail->Password = $account->key;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Получатели
        $mail->setFrom($account->email);
        $mail->addAddress($recipient);

        // Содержание
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
        error_log('Mail id '.$id.' sent');

        if ($account->status !== 1) {
            $account->status = 1;
            R::store($account);
        }
    } catch (Exception $e) {
        error_log('Mail id '.$id.' not sent! Mailer Error: '.$mail->ErrorInfo);
        $account->status = 0;
        R::store($account);
    }
}