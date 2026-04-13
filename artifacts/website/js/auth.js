!function(){var t=localStorage.getItem("skinz-theme")||"light";document.documentElement.setAttribute("data-theme",t)}();

function togglePass(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon  = document.getElementById(iconId);
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'bi bi-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'bi bi-eye';
    }
  }

  function showError(formType, msg) {
    const errDiv  = document.getElementById(formType + 'Error');
    const errText = document.getElementById(formType + 'ErrorText');
    errDiv.style.display = 'block';
    errText.textContent  = msg;
  }

  function handleLogin(e) {
    e.preventDefault();
    document.getElementById('loginError').style.display = 'none';
    const email = document.getElementById('loginEmail').value;
    const pass  = document.getElementById('loginPassword').value;

    if (!email.includes('@')) { showError('login', 'Введіть коректний email'); return; }
    if (pass.length < 6)      { showError('login', 'Пароль має бути не менше 6 символів'); return; }

    document.getElementById('formLogin').style.display   = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    document.getElementById('successTitle').textContent  = 'Ласкаво просимо!';
    document.getElementById('successDesc').textContent   = 'Ви успішно увійшли до акаунту SKINZ.';
  }