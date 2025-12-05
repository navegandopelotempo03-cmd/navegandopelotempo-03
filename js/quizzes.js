// ==================== CONFIGURAÇÃO ====================
const CONFIG = {
  DARK_MODE_KEY: "museu_dark_mode"
};

// ==================== MODO ESCURO/CLARO ====================
/**
 * Carrega a preferência de modo salva
 */
function carregarPreferenciaModo() {
  const darkModePreference = localStorage.getItem(CONFIG.DARK_MODE_KEY);
  
  if (darkModePreference === 'true') {
    document.body.classList.add('dark-mode');
    const btn = document.querySelector(".btn-toggle");
    const icon = btn?.querySelector(".icon");
    const text = btn?.querySelector(".text");
    
    if (icon) icon.textContent = "☀️";
    if (text) text.textContent = "Modo Claro";
  }
}

/**
 * Alterna entre modo escuro e claro
 */
function toggleMode() {
  const body = document.body;
  const btn = document.querySelector(".btn-toggle");
  const icon = btn?.querySelector(".icon");
  const text = btn?.querySelector(".text");
  
  body.classList.toggle("dark-mode");
  
  const isDarkMode = body.classList.contains("dark-mode");
  
  // Salva preferência no localStorage
  localStorage.setItem(CONFIG.DARK_MODE_KEY, isDarkMode);
  
  // Atualiza texto e ícone do botão
  if (btn) {
    if (isDarkMode) {
      if (icon) icon.textContent = "☀️";
      if (text) text.textContent = "Modo Claro";
    } else {
      if (icon) icon.textContent = "🌙";
      if (text) text.textContent = "Modo Escuro";
    }
  }
  
  // Adiciona feedback visual
  btn?.classList.add('animating');
  setTimeout(() => btn?.classList.remove('animating'), 300);
}

// ==================== NAVEGAÇÃO DA TIMELINE ====================
const timeline = document.getElementById("timeline");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// Botões de navegação
leftBtn.addEventListener("click", () => {
  timeline.scrollBy({ left: -200, behavior: "smooth" });
});

rightBtn.addEventListener("click", () => {
  timeline.scrollBy({ left: 200, behavior: "smooth" });
});

// Arrastar com mouse (drag to scroll)
let isDown = false;
let startX;
let scrollLeft;

timeline.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - timeline.offsetLeft;
  scrollLeft = timeline.scrollLeft;
});

timeline.addEventListener("mouseleave", () => {
  isDown = false;
});

timeline.addEventListener("mouseup", () => {
  isDown = false;
});

timeline.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - timeline.offsetLeft;
  const walk = (x - startX) * 2; // velocidade do arraste
  timeline.scrollLeft = scrollLeft - walk;
});

// Função de busca por ano
function buscarMarco() {
  const anoDigitado = parseInt(document.getElementById("searchYear").value);
  if (isNaN(anoDigitado)) {
    alert("Digite um ano válido.");
    return;
  }

  const cards = document.querySelectorAll(".marco-card div");
  const anos = [];

  // Pega os anos e os converte em número
  cards.forEach((card) => {
    const texto = card.textContent.trim();
    const match = texto.match(/\d{4}/g); // pega o primeiro número de 4 dígitos
    if (match) anos.push({ ano: parseInt(match[0]), el: card.parentElement });
  });

  // Verifica se o ano exato existe
  const exato = anos.find(a => a.ano === anoDigitado);
  if (exato) {
    exato.el.scrollIntoView({ behavior: "smooth", inline: "center" });
    exato.el.style.boxShadow = "0 0 15px 5px rgba(251, 118, 33, 0.6)";
    setTimeout(() => {
      exato.el.style.boxShadow = "";
    }, 2000);
    return;
  }

  // Se não existir, acha os mais próximos
  const todos = anos.map(a => a.ano);
  let menor = Math.max(...todos.filter(a => a < anoDigitado));
  let maior = Math.min(...todos.filter(a => a > anoDigitado));

  if (!isFinite(menor) && !isFinite(maior)) {
    alert("Nenhum marco encontrado!");
    return;
  }

  if (!isFinite(menor)) menor = null;
  if (!isFinite(maior)) maior = null;

  let mensagem = "Ano não encontrado.\n";
  if (menor && maior) mensagem += `Mais próximos: ${menor} e ${maior}`;
  else if (menor) mensagem += `Mais próximo: ${menor}`;
  else if (maior) mensagem += `Mais próximo: ${maior}`;
  alert(mensagem);

  // Centraliza o mais próximo
  const alvo = anos.find(a => a.ano === (menor || maior));
  if (alvo) {
    alvo.el.scrollIntoView({ behavior: "smooth", inline: "center" });
    alvo.el.style.boxShadow = "0 0 15px 5px rgba(251, 118, 33, 0.6)";
    setTimeout(() => {
      alvo.el.style.boxShadow = "";
    }, 2000);
  }
}

// ==================== FUNÇÕES DE ACESSIBILIDADE ====================

// Menu de Acessibilidade
function toggleAccessibilityMenu() {
  const menu = document.getElementById('accessibilityMenu');
  menu.classList.toggle('active');
  if (menu.classList.contains('active')) {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}

// Controle de tamanho de fonte
function changeFontSize(size) {
  const body = document.body;
  body.classList.remove('font-small', 'font-medium', 'font-large');
  body.classList.add('font-' + size);
  
  // Atualizar botão ativo
  document.querySelectorAll('.font-size-controls button').forEach(btn => {
    btn.classList.remove('active');
  });
  // O evento 'event' pode não estar disponível globalmente em todos os navegadores, 
  // mas como o HTML usa onclick, ele deve funcionar.
  if (event && event.target) {
    event.target.classList.add('active');
  }
}

// Alto contraste
let highContrastEnabled = false;
function toggleHighContrast() {
  highContrastEnabled = !highContrastEnabled;
  document.body.classList.toggle('high-contrast', highContrastEnabled);
  
  const btn = event.target.closest('button');
  btn.style.background = highContrastEnabled ? 
    'rgba(255, 255, 255, 0.3)' : 
    'rgba(255, 255, 255, 0.1)';
}

// ========== LEITOR DE TELA ==========
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
    // Conteúdo principal da página de quizzes: Header e cards
    const header = document.querySelector('header');
    const cards = document.querySelectorAll('.marco-card');
    
    let textToRead = '';
    
    // Adicionar conteúdo do header
    if (header) {
      const h1 = header.querySelector('h1')?.textContent.trim();
      const h2 = header.querySelector('h2')?.textContent.trim();
      if (h1) textToRead += `${h1}. `;
      if (h2) textToRead += `${h2}. `;
    }
    
    // Adicionar títulos dos cards
    if (cards.length > 0) {
      textToRead += 'Marcos temporais disponíveis: ';
      cards.forEach(card => {
        const title = card.querySelector('div')?.textContent.trim();
        if (title) textToRead += `${title}. `;
      });
    }
    
    // Criar utterance
    currentUtterance = new SpeechSynthesisUtterance(textToRead);
    currentUtterance.lang = 'pt-BR';
    currentUtterance.rate = 0.9; // Velocidade
    currentUtterance.pitch = 1; // Tom
    currentUtterance.volume = 1; // Volume
    
    // Iniciar leitura
    window.speechSynthesis.speak(currentUtterance);
    
  } else {
    alert('Desculpe, seu navegador não suporta síntese de voz.');
  }
}

function pauseReading() {
  if (window.speechSynthesis.speaking && !isPaused) {
    window.speechSynthesis.pause();
    isPaused = true;
    document.getElementById('pauseBtn').textContent = '▶️'; // Mudar para play
  }
}

function resumeReading() {
  if (isPaused) {
    window.speechSynthesis.resume();
    isPaused = false;
    document.getElementById('pauseBtn').textContent = '⏸️'; // Mudar para pause
  }
}

function stopReading() {
  window.speechSynthesis.cancel();
  isPaused = false;
}

// VLibras
let vlibrasEnabled = false;
function toggleVLibras() {
  vlibrasEnabled = !vlibrasEnabled;
  // O VLibras já está no HTML, mas o botão de acessibilidade o esconde/mostra
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

// Limpar leitura ao sair da página
window.addEventListener('beforeunload', function() {
  if (currentUtterance) {
    window.speechSynthesis.cancel();
  }
});

// ==================== INICIALIZAÇÃO ====================
/**
 * Inicializa a página carregando o modo escuro/claro salvo
 */
function inicializar() {
  console.log('🎯 Página de Quizzes inicializando...');
  
  // PRIMEIRO: Carrega a preferência de modo salva
  carregarPreferenciaModo();
  
  console.log('✅ Página de Quizzes inicializada com sucesso!');
}

// Executa inicialização quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}