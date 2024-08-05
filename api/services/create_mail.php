<?php

require_once('../../settings.php');
require_once('../telegram/send_message.php');
require_once('../db/add_mail_to_queue.php');

$data = json_decode(file_get_contents('php://input'), true);

$telegramId = $data['telegramId'];
$author = isset($users[$telegramId]) ? $users[$telegramId] : null;
$site = $data['site'];
$recipient = $data['recipient'];
$subject = $data['subject'];
$body = $data['body'];

if ($author) {
    $id = addMailToQueue($author, $site, $recipient, $subject, $body);
    sendMessage($id, $author, $site, $recipient, $subject, $body, $users, $botToken);
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
}