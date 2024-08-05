<?php

require '../../vendor/autoload.php';
require "rb-sqlite.php";
$databasePath = __DIR__ . '/db.db';
R::setup('sqlite:' . $databasePath);

if(!R::testConnection()) die('No DB connection!');

function addMailToQueue($author, $site, $recipient, $subject, $body) {
    $mail = R::dispense('mails');
    $mail->author = $author;
    $mail->site = $site;
    $mail->recipient = $recipient;
    $mail->subject = $subject;
    $mail->body = $body;
    $mail->create_date = date('Y-m-d H:i:s');
    $mailId = R::store($mail);

    $accounts = R::findAll('accounts', 'status IS NULL OR status != 0');

    foreach ($accounts as $account) {
        $task = R::dispense('tasks');
        $task->mail_id = $mailId;
        $task->account = $account->id;
        $task->status = 'pending';
        $task->create_date = date('Y-m-d H:i:s');
        R::store($task);
    }

    return $mailId;
}