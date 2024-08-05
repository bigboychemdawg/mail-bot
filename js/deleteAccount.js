function deleteAccounts() {
    var checkboxes = document.querySelectorAll('.form-check-input:checked');
    var ids = [];

    checkboxes.forEach(function(checkbox) {
        ids.push(checkbox.value);
    });

    if (ids.length === 0) {
        alert('Нет выбранных аккаунтов для удаления');
        return;
    }

    var data = {
        ids: ids
    };

    fetch('api/services/delete_account.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            removeAccountsFromTable(ids);
            alert('Аккаунты удалены');
        } else {
            alert('Ошибка: ' + data.message);
        }
        mainButton.hide();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при удалении аккаунтов');
    });
}

function removeAccountsFromTable(ids) {
    ids.forEach(function(id) {
        var row = document.querySelector('input[value="' + id + '"]').closest('tr');
        row.remove();
    });
}
