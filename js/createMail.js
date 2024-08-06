function createMail() {
    const recipient = document.querySelector('#createMail input[placeholder="Получатель"]').value.trim();
    const subject = document.querySelector('#createMail input[placeholder="Тема"]').value.trim();
    const site = document.querySelector('#createMail input[placeholder="Жертва (домен)"]').value.trim();
    let body = document.querySelector('#createMail textarea[placeholder="Текст письма"]').value.trim();
    const telegramId = window.Telegram.WebApp.initDataUnsafe.user.id;

    // Преобразуем текст в HTML
    body = textToHTML(body);

    const data = {
        telegramId: telegramId,
        recipient: recipient,
        subject: subject,
        site: site,
        body: body
    };

    fetch('api/services/create_mail.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            alert('Письмо успешно создано и отправлено.');
        } else {
            alert('Ошибка при создании письма.');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Ошибка при отправке запроса.');
    });
}

function textToHTML(text) {
    let lines = text.split('\n');
    lines = lines.map(line => `<p>${line.trim()}</p>`);
    return lines.join('');
}
