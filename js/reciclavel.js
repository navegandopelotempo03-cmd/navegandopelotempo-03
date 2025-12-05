// ==================== CONFIGURAÇÃO ====================
const CONFIG = {
  DARK_MODE_KEY: "museu_dark_mode"
};

// ==================== MODO ESCURO/CLARO ====================
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

function toggleMode() {
  const body = document.body;
  const btn = document.querySelector(".btn-toggle");
  const icon = btn?.querySelector(".icon");
  const text = btn?.querySelector(".text");
  
  body.classList.toggle("dark-mode");
  
  const isDarkMode = body.classList.contains("dark-mode");
  
  localStorage.setItem(CONFIG.DARK_MODE_KEY, isDarkMode);
  
  if (btn) {
    if (isDarkMode) {
      if (icon) icon.textContent = "☀️";
      if (text) text.textContent = "Modo Claro";
    } else {
      if (icon) icon.textContent = "🌙";
      if (text) text.textContent = "Modo Escuro";
    }
  }
  
  btn?.classList.add('animating');
  setTimeout(() => btn?.classList.remove('animating'), 300);
}

// ==================== PAINÉIS EXPANSÍVEIS ====================
(function(){
  const btn = document.getElementById('toggle-arpanet');
  const panel = document.getElementById('more-arpanet');

  if (!btn || !panel) return;

  function openPanel() {
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closePanel() {
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) closePanel(); else openPanel();
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
})();

(function(){
  const btn = document.getElementById('toggle-sources');
  const panel = document.getElementById('sources-collapse');

  if (!btn || !panel) return;

  function openPanel() {
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closePanel() {
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) closePanel(); else openPanel();
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
})();

// ==================== RASTREAMENTO DE MARCOS ====================
/**
 * Detecta automaticamente qual marco está sendo visualizado
 * e marca como lido se o usuário estiver logado
 */
function rastrearMarco() {
  // Verificar se está logado
  if (!AUTH || !AUTH.estaLogado()) return;

  // Detectar qual página de marco está aberta
  const path = window.location.pathname;
  let marcoId = null;

  // Mapear nome do arquivo para ID do marco
  if (path.includes('1940-50.html')) marcoId = '1940-1950';
  else if (path.includes('1958.html')) marcoId = '1958';
  else if (path.includes('1965.html')) marcoId = '1965';
  else if (path.includes('1966-70.html')) marcoId = '1966-1970';
  else if (path.includes('1974.html')) marcoId = '1974';
  else if (path.includes('1980-85.html')) marcoId = '1980-1985';
  else if (path.includes('1989-91.html')) marcoId = '1989-1991';
  else if (path.includes('1993.html')) marcoId = '1993';
  else if (path.includes('1995.html')) marcoId = '1995';
  else if (path.includes('final-90s.html')) marcoId = 'Final-90s';
  else if (path.includes('2004-06.html')) marcoId = '2004-2006';
  else if (path.includes('2007.html')) marcoId = '2007';
  else if (path.includes('2010.html')) marcoId = '2010';
  else if (path.includes('2016.html')) marcoId = '2016';
  else if (path.includes('2020.html')) marcoId = '2020';
  else if (path.includes('2022.html')) marcoId = '2022-Diante';

  // Se detectou um marco, marcar como lido
  if (marcoId) {
    AUTH.marcarMarcoLido(marcoId);
    console.log(`✅ Marco "${marcoId}" marcado como lido!`);
  }
}

// ==================== INICIALIZAÇÃO ====================
function inicializar() {
  console.log('📄 Página Reciclável inicializando...');
  
  // Carregar preferência de modo
  carregarPreferenciaModo();
  
  // Rastrear visualização do marco
  rastrearMarco();
  
  console.log('✅ Página Reciclável inicializada com sucesso!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}