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

        // Получить доступный аккаунт
        $account = R::findOne('accounts', 'status IS NULL OR status != 0');
        if ($account) {
            sendMail($account, $mail->recipient, $mail->subject, $mail->body,  $mail->id);

            // Обновить статус задачи
            $task->status = 'sent';
            R::store($task);
            error_log('Scheduler: '.$task);
        } else {
            error_log('Scheduler: No available accounts');
        }
    } else {
        error_log('Scheduler: No pending tasks');
    }   
}

processQueue();
die();