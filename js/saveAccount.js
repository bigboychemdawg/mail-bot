function saveAccount() {
    var accountsText = document.querySelector('#addAccount textarea[placeholder="Аккаунты с новой строки в формате email:password"]').value.trim();
    var accounts = accountsText.split('\n').map(function (line) {
        var [email, key] = line.split(':');
        return { email: email.trim(), key: key.trim() };
    });

    var data = { accounts: accounts };

    fetch('api/services/create_account.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            data.accounts.forEach(account => {
                addAccountToTable(account.email, '💤');
            });
            alert('Аккаунты добавлены');
            document.querySelector('#addAccount textarea[placeholder="Аккаунты с новой строки в формате email:password"]').value = '';
            document.querySelector('#addAccount .btn-secondary[data-bs-dismiss="modal"]').click();
        } else {
            alert('Ошибка: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при добавлении аккаунтов');
    });
}

function addAccountToTable(id, email, statusIcon) {
    var table = document.getElementById('table').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();

    var cell0 = newRow.insertCell(0);
    var cell1 = newRow.insertCell(1);
    var cell2 = newRow.insertCell(2);
    var cell3 = newRow.insertCell(3);

    // Получение текущего количества строк
    var rowCount = table.rows.length;

    cell0.innerText = rowCount + 1; // Нумерация строк
    cell1.innerHTML = `<input class="form-check-input" type="checkbox" value="${id}" id="flexCheckDefault${id}" />`;
    cell2.innerText = email;
    cell3.innerText = statusIcon;
}

document.getElementById('saveAccount').addEventListener('click', saveAccount);
