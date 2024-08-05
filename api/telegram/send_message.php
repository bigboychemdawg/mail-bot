<?php

function sendMessage($id, $author, $site, $recipient, $subject, $body, $users, $botToken) {

  $message = "
  ⚡️ Новая задача:

  ID: $id
  Создал: $author
  Жертва: $site
  Получатель: $recipient
  Тема: $subject
  $body
  ";

  foreach ($users as $telegramId => $username) {
    $getQuery = array(
        "chat_id" 	=> $telegramId,
        "text"  	=> $message,
        "parse_mode" => "html"
    );
    
    $ch = curl_init("https://api.telegram.org/bot". $botToken ."/sendMessage?" . http_build_query($getQuery));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    $resultQuery = curl_exec($ch);
    curl_close($ch);
  }
}