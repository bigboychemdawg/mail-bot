<?php

require 'vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

// Настройка подключения к базе данных SQLite
require "api/db/rb-sqlite.php";
R::setup('sqlite:api/db/db.db');

if(!R::testConnection()) die('No DB connection!');

// Загрузка данных из базы данных
$accounts = R::findAll('accounts');
$mails = R::findAll('mails');

// Подготовка данных для шаблона
$data = [
    'accounts' => $accounts,
    'mails' => []
];

// Расчет прогресса выполнения задач
foreach ($mails as $mail) {
    $tasks_total = R::count('tasks', 'mail_id = ?', [$mail->id]);
    $tasks_sent = R::count('tasks', 'mail_id = ? AND status = ?', [$mail->id, 'sent']);
    $mail->tasks_total = $tasks_total;
    $mail->tasks_sent = $tasks_sent;
    $data['mails'][] = $mail;
}

// Проверьте правильность пути к каталогу шаблонов
$templateDir = __DIR__ . '/templates';
if (!is_dir($templateDir)) {
    die('Template directory not found: ' . $templateDir);
}

// Создание экземпляра Twig
$loader = new FilesystemLoader($templateDir);
$twig = new Environment($loader);

// Рендеринг шаблона
echo $twig->render('index.twig', $data);
