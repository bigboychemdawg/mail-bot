<?php

require_once('../../settings.php');
require_once('../db/create_account.php');

$data = json_decode(file_get_contents('php://input'), true);
$accounts = $data['accounts'];

if (!empty($accounts)) {
    $addedAccounts = [];
    foreach ($accounts as $account) {
        $email = $account['email'];
        $key = $account['key'];
        if ($email && $key) {
            $status = createAccount($email, $key);
            if ($status) {
                $addedAccounts[] = $account;
            } else {
                error_log('Error: Unable to create account for ' . $email);
            }
        } else {
            error_log('Error: Invalid data for account ' . json_encode($account));
        }
    }
    echo json_encode(['status' => 'ok', 'accounts' => $addedAccounts]);
} else {
    error_log('Error: No accounts provided.');
    echo json_encode(['status' => 'error', 'message' => 'Нет аккаунтов для добавления']);
}
