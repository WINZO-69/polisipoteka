// ─── ПОПАП ───
const overlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('popupClose');
const phoneInput = document.getElementById('phoneInput');
const phoneError = document.getElementById('phoneError');
const submitBtn = document.getElementById('popupSubmit');
const consentCheckbox = document.getElementById('popupConsent');
const consentError = document.getElementById('consentError');

// Открытие по кнопке "Оформить через брокера"
document.querySelectorAll('.btn--primary').forEach(btn => {
  btn.addEventListener('click', () => {
    overlay.classList.add('active');
    phoneInput.focus();
  });
});

// Скролл до виджета по кнопке "Оформить онлайн"
document.querySelector('.btn--outline').addEventListener('click', () => {
  document.getElementById('widget').scrollIntoView({ behavior: 'smooth' });
});

// Закрытие
closeBtn.addEventListener('click', closePopup);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closePopup();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});

function closePopup() {
  overlay.classList.remove('active');
  phoneInput.value = '';
  phoneInput.classList.remove('error');
  phoneError.classList.remove('visible');
  consentCheckbox.checked = false;
  consentError.classList.remove('visible');
  submitBtn.disabled = false;
  submitBtn.textContent = 'Отправить';
}

// ─── МАСКА ТЕЛЕФОНА ───
phoneInput.addEventListener('input', (e) => {
  let digits = e.target.value.replace(/\D/g, '');

  if (digits.startsWith('8') || digits.startsWith('7')) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  let formatted = '+7';
  if (digits.length > 0) formatted += ' (' + digits.slice(0, 3);
  if (digits.length >= 3) formatted += ') ' + digits.slice(3, 6);
  if (digits.length >= 6) formatted += '-' + digits.slice(6, 8);
  if (digits.length >= 8) formatted += '-' + digits.slice(8, 10);

  e.target.value = formatted;

  phoneInput.classList.remove('error');
  phoneError.classList.remove('visible');
});

// Запрет ввода нецифровых символов (кроме спецклавиш)
phoneInput.addEventListener('keydown', (e) => {
  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
    e.preventDefault();
  }
});

// Скрываем ошибку чекбокса когда ставят галочку обратно
consentCheckbox.addEventListener('change', () => {
  if (consentCheckbox.checked) {
    consentError.classList.remove('visible');
  }
});

// ─── ВАЛИДАЦИЯ И ОТПРАВКА ───
submitBtn.addEventListener('click', () => {
  const digits = phoneInput.value.replace(/\D/g, '').slice(1);

  if (digits.length < 10) {
    phoneInput.classList.add('error');
    phoneError.classList.add('visible');
    return;
  }

  if (!consentCheckbox.checked) {
    consentError.classList.add('visible');
    return;
  }

  consentError.classList.remove('visible');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправляем...';

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: '31420c21-8285-4c7d-b853-a6c003ab0237',
      subject: 'Новая заявка с polisipoteka.ru',
      phone: phoneInput.value
    })
  })
  .then(res => res.json())
  .then(() => {
    //
    ym(107139628, 'reachGoal', 'form_submit');
    
    submitBtn.textContent = 'Заявка отправлена!';
    setTimeout(() => closePopup(), 2000);
  })
  .catch(() => {
    submitBtn.textContent = 'Ошибка, попробуйте снова';
    submitBtn.disabled = false;
  });
});

// ─── ПЛАВАЮЩАЯ КНОПКА СВЯЗИ ───
const contactToggle = document.getElementById('contactWidgetToggle');
const contactIcon = document.getElementById('contactWidgetIcon');
const contactPanel = document.getElementById('contactPanel');
const contactPhoneBtn = document.getElementById('contactPhoneBtn');

contactToggle.addEventListener('click', () => {
  const isOpen = contactPanel.classList.contains('active');
  contactPanel.classList.toggle('active');
  contactIcon.src = isOpen ? 'Photo/Right_icon.svg' : 'Photo/cross.svg';
});

contactPhoneBtn.addEventListener('click', () => {
  contactPanel.classList.remove('active');
  contactIcon.src = 'Photo/Right_icon.svg';
  overlay.classList.add('active');
  phoneInput.focus();
});

document.addEventListener('click', (e) => {
  const widget = document.getElementById('contactWidget');
  if (!widget.contains(e.target) && contactPanel.classList.contains('active')) {
    contactPanel.classList.remove('active');
    contactIcon.src = 'Photo/Right_icon.svg';
  }
});

