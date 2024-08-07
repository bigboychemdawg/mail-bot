<?php

require '../../vendor/autoload.php';
require "rb-sqlite.php";
$databasePath = __DIR__ . '/db.db';
R::setup('sqlite:' . $databasePath);

if (!R::testConnection()) die('No DB connection!');

ini_set('log_errors', 1);
ini_set('error_log', '/dev/stderr');

function deleteAccounts($ids) {
    try {
        R::exec('DELETE FROM accounts WHERE id IN (' . R::genSlots($ids) . ')', $ids);
        return true;
    } catch (Exception $e) {
        error_log('Error: ' . $e->getMessage());
        return false;
    }
}
