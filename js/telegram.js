const tg = window.Telegram.WebApp;
const mainButton = tg.MainButton;
const backButton = tg.BackButton;

const buttonsData = {
    'create-mail': 'ОТПРАВИТЬ',
    'accounts': 'УДАЛИТЬ',
};

function showMailPopup() {
	showPopup('Отправить письмо?', 'Будет отправлено со всех активных адресов');
}

function showAccountPopup() {
showPopup('Удалить аккаунты?', 'Будут удалены все выбранные аккаунты');
}

// telegram buttons events
tg.onEvent('mainButtonClicked', function () {
tg.HapticFeedback.impactOccurred('heavy');
if (mainButton.text === buttonsData['create-mail']) {
  showMailPopup();
} else if (mainButton.text === buttonsData['accounts']) {
  showAccountPopup();
}
});

tg.onEvent('backButtonClicked', function () {
if (lastClickedLabel) {
  lastClickedLabel.click();
}
});

function showPopup(title, message) {
tg.showPopup({
  title,
  message,
  buttons: [
    { id: 'ok', type: 'ok', text: 'OK' },
    { type: 'cancel' },
  ]
}, function (buttonId) {
  if (mainButton.text === buttonsData['create-mail'] && buttonId === 'ok') {
    createMail();
  } else if (mainButton.text === buttonsData['accounts'] && buttonId === 'ok') {
    deleteAccounts();
  }
});
};