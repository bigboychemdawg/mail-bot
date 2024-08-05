<?php
require_once '../../vendor/autoload.php';
require_once "../db/rb-sqlite.php";
require_once('../mail/send_mail.php');
R::setup('sqlite:../db/db.db');

if(!R::testConnection()) die('No DB connection!');

function processQueue() {
    $task = R::findOne('tasks', 'status = ? ORDER BY create_date ASC', ['pending']);
    if ($task) {
        $mail = R::load('mails', $task->mail_id);

        // Получить связанный аккаунт
        $account = R::load('accounts', $task->account);
        if ($account && ($account->status === null || $account->status != 0)) {
            sendMail($account, $mail->recipient, $mail->subject, $mail->body, $mail->id);

            // Обновить статус задачи
            $task->status = 'sent';
            R::store($task);
            error_log('Scheduler: Mail id ' . $task->mail_id . ' sent using account ' . $task->account);
        } else {
            error_log('Scheduler: No available accounts');
        }
    } else {
        error_log('Scheduler: No pending tasks');
    }
}

processQueue();
die();
