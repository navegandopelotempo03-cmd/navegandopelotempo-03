// ==================== CONFIGURAÇÃO ====================
const CONFIG = {
  DARK_MODE_KEY: "museu_dark_mode"
};

// ==================== MODO ESCURO/CLARO ====================
function toggleMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    const modeIcon = document.getElementById('modeIcon');
    const modeText = document.getElementById('modeText');
    
    if (modeIcon) modeIcon.textContent = isDark ? '☀️' : '🌙';
    if (modeText) modeText.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
    
    localStorage.setItem(CONFIG.DARK_MODE_KEY, isDark);
}

function carregarPreferenciaModo() {
    const darkMode = localStorage.getItem(CONFIG.DARK_MODE_KEY) === 'true';
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const modeIcon = document.getElementById('modeIcon');
        const modeText = document.getElementById('modeText');
        
        if (modeIcon) modeIcon.textContent = '☀️';
        if (modeText) modeText.textContent = 'Modo Claro';
    }
}

// ==================== FORMULÁRIOS ====================
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    
    loginForm.classList.toggle('active');
    cadastroForm.classList.toggle('active');
    
    document.getElementById('messageContainer').innerHTML = '';
}

function showMessage(message, type) {
    const container = document.getElementById('messageContainer');
    container.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// ==================== HANDLER DE LOGIN ====================
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('loginNome').value.trim();
    const senha = document.getElementById('loginSenha').value;

    if (!nome || !senha) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return false;
    }

    // Fazer login usando o sistema AUTH
    const resultado = AUTH.login(nome, senha);
    
    if (resultado.sucesso) {
        showMessage('Login realizado com sucesso! Redirecionando...', 'success');
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showMessage(resultado.erro, 'error');
    }
});

// ==================== HANDLER DE CADASTRO ====================
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('cadastroNome').value.trim();
    const email = document.getElementById('cadastroEmail').value.trim();
    const senha = document.getElementById('cadastroSenha').value;
    const confirmSenha = document.getElementById('cadastroConfirmSenha').value;

    // Validações
    if (!nome || !email || !senha || !confirmSenha) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
        showMessage('Por favor, insira um e-mail válido.', 'error');
        return false;
    }

    if (senha.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
        return false;
    }

    if (senha !== confirmSenha) {
        showMessage('As senhas não coincidem!', 'error');
        return false;
    }

    // Cadastrar usando o sistema AUTH
    const resultado = AUTH.cadastrar(nome, email, senha);
    
    if (resultado.sucesso) {
        showMessage('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
        
        // Limpar formulário e trocar para login
        this.reset();
        setTimeout(() => {
            toggleForms();
        }, 1500);
    } else {
        showMessage(resultado.erro, 'error');
    }
});

// ==================== FUNÇÕES DE ACESSIBILIDADE ====================
function toggleAccessibilityMenu() {
  const menu = document.getElementById('accessibilityMenu');
  menu.classList.toggle('active');
  menu.style.display = menu.classList.contains('active') ? 'block' : 'none';
}

function changeFontSize(size) {
  document.body.classList.remove('font-small', 'font-medium', 'font-large');
  document.body.classList.add('font-' + size);
  
  document.querySelectorAll('.font-size-controls button').forEach(btn => {
    btn.classList.remove('active');
  });
  if (event && event.target) {
    event.target.classList.add('active');
  }
}

let highContrastEnabled = false;
function toggleHighContrast() {
  highContrastEnabled = !highContrastEnabled;
  document.body.classList.toggle('high-contrast', highContrastEnabled);
  
  const btn = event.target.closest('button');
  btn.style.background = highContrastEnabled ? 
    'rgba(255, 255, 255, 0.3)' : 
    'rgba(255, 255, 255, 0.1)';
}

let screenReaderEnabled = false;
let currentUtterance = null;
let isPaused = false;

function toggleScreenReader() {
  screenReaderEnabled = !screenReaderEnabled;
  const btn = event.target.closest('button');
  const text = document.getElementById('screenReaderText');
  const controls = document.getElementById('readerControls');
  
  if (screenReaderEnabled) {
    text.textContent = 'Desativar Leitor';
    btn.style.background = 'rgba(255, 255, 255, 0.3)';
    controls.style.display = 'flex';
    startReading();
  } else {
    text.textContent = 'Ativar Leitor';
    btn.style.background = 'rgba(255, 255, 255, 0.1)';
    controls.style.display = 'none';
    stopReading();
  }
}

function startReading() {
  if ('speechSynthesis' in window) {
    const leftPanel = document.querySelector('.left-panel');
    const formHeader = document.querySelector('.form-container form.active .form-header');
    
    let textToRead = '';
    
    if (leftPanel) {
      const h1 = leftPanel.querySelector('h1')?.textContent.trim();
      const p = leftPanel.querySelector('p')?.textContent.trim();
      if (h1) textToRead += `${h1}. `;
      if (p) textToRead += `${p}. `;
    }
    
    if (formHeader) {
      const h2 = formHeader.querySelector('h2')?.textContent.trim();
      const p = formHeader.querySelector('p')?.textContent.trim();
      if (h2) textToRead += `${h2}. `;
      if (p) textToRead += `${p}. `;
    }
    
    currentUtterance = new SpeechSynthesisUtterance(textToRead);
    currentUtterance.lang = 'pt-BR';
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1;
    currentUtterance.volume = 1;
    
    window.speechSynthesis.speak(currentUtterance);
  } else {
    alert('Desculpe, seu navegador não suporta síntese de voz.');
  }
}

function pauseReading() {
  if (window.speechSynthesis.speaking && !isPaused) {
    window.speechSynthesis.pause();
    isPaused = true;
    document.getElementById('pauseBtn').textContent = '▶️';
  }
}

function resumeReading() {
  if (isPaused) {
    window.speechSynthesis.resume();
    isPaused = false;
    document.getElementById('pauseBtn').textContent = '⸸️';
  }
}

function stopReading() {
  window.speechSynthesis.cancel();
  isPaused = false;
}

let vlibrasEnabled = false;
function toggleVLibras() {
  vlibrasEnabled = !vlibrasEnabled;
  const widget = document.querySelector('div[vw]');
  if (widget) {
    widget.style.display = vlibrasEnabled ? 'block' : 'none';
  }
  
  const btn = event.target.closest('button');
  btn.style.background = vlibrasEnabled ? 
    'rgba(255, 255, 255, 0.3)' : 
    'rgba(255, 255, 255, 0.1)';
}

// Fechar menu ao clicar fora
document.addEventListener('click', function(event) {
  const menu = document.getElementById('accessibilityMenu');
  const button = document.querySelector('.accessibility-button');
  
  if (menu && button && !menu.contains(event.target) && !button.contains(event.target)) {
    menu.classList.remove('active');
    menu.style.display = 'none';
  }
});

window.addEventListener('beforeunload', function() {
  if (currentUtterance) {
    window.speechSynthesis.cancel();
  }
});

// ==================== INICIALIZAÇÃO ====================
function inicializar() {
    console.log('🔐 Página de Login inicializando...');
    
    carregarPreferenciaModo();
    
    console.log('✅ Página de Login inicializada com sucesso!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}