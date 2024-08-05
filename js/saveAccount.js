function saveAccount() {
    var email = document.querySelector('#addAccount input[placeholder="Email"]').value;
    var key = document.querySelector('#addAccount input[placeholder="Ключ"]').value;

    var data = {
        email: email,
        key: key
    };

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
            addAccountToTable(email, '💤');
            alert('Аккаунт добавлен');
            document.querySelector('#addAccount input[placeholder="Email"]').value = '';
            document.querySelector('#addAccount input[placeholder="Ключ"]').value = '';
            document.querySelector('#addAccount .btn-secondary[data-bs-dismiss="modal"]').click();
        } else {
            alert('Ошибка: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при добавлении аккаунта');
    });
}

function addAccountToTable(email, statusIcon) {
    var table = document.getElementById('table').getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);

    cell1.innerHTML = '<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />';
    cell2.innerText = email;
    cell3.innerText = statusIcon;
}
