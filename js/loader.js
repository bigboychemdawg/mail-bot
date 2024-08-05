const user = window.Telegram.WebApp.initDataUnsafe.user;
const body = document.body;
const originalContent = body.innerHTML;

const loadingSpinner = document.createElement('div');
loadingSpinner.className = 'spinner-border text-success';
loadingSpinner.setAttribute('role', 'status');
loadingSpinner.style.width = '30px';
loadingSpinner.style.margin = 'auto';
loadingSpinner.style.display = 'block';
loadingSpinner.style.color = 'var(--link-color) !important';
loadingSpinner.innerHTML = '<span class="visually-hidden">Загрузка...</span>';
body.innerHTML = ''; // Очищаем body
body.appendChild(loadingSpinner);

hidden = false;
lastClickedLabel = null;

if (user && user.id) {
    const telegramId = user.id;

    fetch('api/users/access.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ telegramId: telegramId })
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status == 'ok') {
            body.innerHTML = originalContent;
            const divs = document.querySelectorAll('.btn-group-vertical.menu > div');
            const tasks = document.querySelectorAll('.task > div');
            const checkboxes = document.querySelectorAll('.accounts input[type="checkbox"]');
            const textInputs = document.querySelectorAll('.create-mail input[type="text"], .create-mail textarea');

             // Устанавливаем обработчики событий для верхнего уровня
            divs.forEach((div) => {
                const radio = div.querySelector('input[type="radio"]');
                if (radio) {
                    radio.addEventListener('click', () => {
                        tg.HapticFeedback.impactOccurred('heavy');
                        toggleVisibility(div, radio, divs);
                    });
                }
            });

            // Устанавливаем обработчики событий для элементов tasks
            tasks.forEach((task) => {
                const radio = task.querySelector('input[type="radio"]');
                if (radio) {
                    radio.addEventListener('click', () => {
                        tg.HapticFeedback.impactOccurred('heavy');
                        toggleTaskVisibility(task, radio, tasks);
                    });
                }
            });

            // Добавляем слушатели для чекбоксов
            checkboxes.forEach((checkbox) => {
                checkbox.addEventListener('change', () => {
                    toggleMainButton();
                });
            });

            // Добавляем слушатели для текстовых полей
            textInputs.forEach((input) => {
                input.addEventListener('input', () => {
                    toggleMainButton();
                });
            });

            // Слушатель для сохранения аккаунта
            document.addEventListener('DOMContentLoaded', function() {
                document.getElementById('saveAccount').addEventListener('click', saveAccount);
            });
        }
    });

    function toggleVisibility(div, radio, divs) {
        const ariaExpanded = radio.getAttribute('aria-expanded');
        if (!hidden) {
            divs.forEach((otherDiv) => {
                if (otherDiv !== div) {
                    otherDiv.classList.add('d-none');
                }
            });
            lastClickedLabel = radio.labels[0]; // Обновляем ссылку на label
            div.querySelector('.arrow').style.transform = 'rotate(90deg)';
            radio.setAttribute('aria-expanded', 'true');
            backButton.show();
            mainButton.text = buttonsData[div.classList[0]] || 'MAIN'; // Добавлено || 'MAIN' для установки текста по умолчанию
            hidden = true;
        } else if (hidden && ariaExpanded !== 'true') {
            divs.forEach((otherDiv) => {
                if (otherDiv !== div) {
                    otherDiv.classList.remove('d-none');
                }
            });
            div.querySelector('.arrow').style.transform = 'rotate(0deg)';
            radio.setAttribute('aria-expanded', 'false');
            const allInputs = document.querySelectorAll('.btn-group-vertical.menu input[type="radio"]');
            allInputs.forEach((input) => {
                input.classList.remove('collapsed');
            });
            mainButton.hide();
            backButton.hide();
            hidden = false;
        }
    }

    function toggleMainButton() {
        const isCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        const areTextInputsFilled = Array.from(textInputs).every(input => input.value.trim() !== '');

        if (isCheckboxChecked || areTextInputsFilled) {
            mainButton.show();
        } else {
            mainButton.hide();
        }
    }
} else {
    console.error('telegramId отсутствует');
}
