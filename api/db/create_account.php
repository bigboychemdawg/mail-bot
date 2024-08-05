<?php

require '../../vendor/autoload.php';
require "rb-sqlite.php";
$databasePath = __DIR__ . '/db.db';
R::setup('sqlite:' . $databasePath);

if (!R::testConnection()) die('No DB connection!');

// Создание таблицы accounts, если она не существует

function createAccount($email, $key) {
    $account = R::dispense('accounts');
    $account->email = $email;
    $account->key = $key;
    $account->status = 2;
    $account->create_date = date('Y-m-d H:i:s');
    
    $id = R::store($account);

    if ($id) {
        error_log("Account created with ID: $id");
        return $id;
    } else {
        error_log("Failed to create account for email: $email");
        return false;
    }
}
