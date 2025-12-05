// ==================== CONFIGURAÇÃO ====================
const CONFIG = {
  DARK_MODE_KEY: "museu_dark_mode"
};

// ==================== MODO ESCURO/CLARO ====================
/**
 * Carrega a preferência de modo salva
 * DEVE SER EXECUTADO PRIMEIRO!
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

// ==================== LINHA DO TEMPO ====================
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

function buscarAno() {
  const input = document.getElementById("searchYear");
  const valor = parseInt(input.value.trim());
  if (isNaN(valor)) {
    alert("Digite um ano válido (ex: 1991)");
    return;
  }

  // Coletar todos os anos da timeline
  const eventos = Array.from(document.querySelectorAll(".event .dot h2"));
  const anosDisponiveis = [];

  eventos.forEach(el => {
    const texto = el.textContent.trim();

    // extrair anos, inclusive faixas (ex: 1940 - 1950)
    const match = texto.match(/\d{4}/g);
    if (match) {
      match.forEach(ano => anosDisponiveis.push({
        ano: parseInt(ano),
        elemento: el.closest(".event")
      }));
    }
  });

  // Procurar se o ano existe exato
  const exato = anosDisponiveis.find(a => a.ano === valor);
  if (exato) {
    exato.elemento.scrollIntoView({ behavior: "smooth", inline: "center" });
    exato.elemento.querySelector(".dot").style.transform = "scale(1.3)";
    setTimeout(() => {
      exato.elemento.querySelector(".dot").style.transform = "scale(1)";
    }, 1500);
    return;
  }

  // Caso não exista exato, procurar os mais próximos
  const todosAnos = anosDisponiveis.map(a => a.ano).sort((a, b) => a - b);
  const menor = Math.max(...todosAnos.filter(a => a < valor));
  const maior = Math.min(...todosAnos.filter(a => a > valor));

  if (!isFinite(menor) && !isFinite(maior)) {
    alert("Nenhum marco disponível na linha do tempo.");
    return;
  }

  let msg = "";
  if (isFinite(menor)) msg += `Ano anterior mais próximo: ${menor}. `;
  if (isFinite(maior)) msg += `Ano posterior mais próximo: ${maior}.`;
  alert(`Não há o ano ${valor} na linha do tempo.\n${msg}`);

  // Focar no marco mais próximo
  const alvo = anosDisponiveis.find(a => a.ano === (maior || menor) || a.ano === (menor || maior));
  if (alvo) alvo.elemento.scrollIntoView({ behavior: "smooth", inline: "center" });
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
    // Pegar todo o conteúdo principal
    const mainContent = document.querySelector('.timeline-container'); // Alterado para o container principal da linha do tempo
    const header = document.querySelector('header');
    
    let textToRead = '';
    
    // Adicionar título
    if (header) {
      const logo = header.querySelector('.logo');
      if (logo) textToRead += logo.alt + '. ';
    }
    
    // Adicionar conteúdo principal (eventos da linha do tempo)
    if (mainContent) {
      const events = mainContent.querySelectorAll('.event');
      events.forEach(event => {
        const title = event.querySelector('h2')?.textContent.trim();
        const resumo = event.querySelector('.resumo')?.textContent.trim();
        const desc = event.querySelector('.desc')?.textContent.trim();
        
        if (title) textToRead += `Evento: ${title}. `;
        if (resumo) textToRead += `Resumo: ${resumo}. `;
        if (desc) textToRead += `Descrição: ${desc}. `;
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
  console.log('🕒 Linha do Tempo inicializando...');
  
  // PRIMEIRO: Carrega a preferência de modo salva
  carregarPreferenciaModo();
  
  console.log('✅ Linha do Tempo inicializada com sucesso!');
}

// Executa inicialização quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}