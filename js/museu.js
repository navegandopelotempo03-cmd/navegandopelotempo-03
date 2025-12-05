const CONFIG = {
  DARK_MODE_KEY: "museu_dark_mode",
  PARTICLES_COUNT: 50
};

// ==================== NAVEGAÇÃO ====================
/**
 * Navega para uma página específica com animação de transição
 * @param {string} pagina - URL da página de destino
 */
function irPara(pagina) {
  if (!pagina) {
    console.error('Página não especificada');
    return;
  }
  
  // Adiciona efeito de fade out antes de navegar
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  
  setTimeout(() => {
    window.location.href = pagina;
  }, 300);
}

// ==================== MODO ESCURO/CLARO ====================
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
  
  // Atualiza partículas
  atualizarParticulas();
}

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

// ==================== PARTÍCULAS ANIMADAS ====================
/**
 * Cria partículas animadas no fundo
 */
function criarParticulas() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  // Limpa partículas existentes
  container.innerHTML = '';
  
  for (let i = 0; i < CONFIG.PARTICLES_COUNT; i++) {
    const particula = document.createElement('div');
    particula.className = 'particula';
    
    // Posição aleatória
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const tamanho = Math.random() * 4 + 2;
    const duracao = Math.random() * 20 + 10;
    const atraso = Math.random() * 5;
    
    particula.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${tamanho}px;
      height: ${tamanho}px;
      background: radial-gradient(circle, rgba(251, 118, 33, 0.6), transparent);
      border-radius: 50%;
      pointer-events: none;
      animation: float ${duracao}s ease-in-out ${atraso}s infinite;
    `;
    
    container.appendChild(particula);
  }
  
  // Adiciona animação CSS se ainda não existir
  if (!document.getElementById('particulas-style')) {
    const style = document.createElement('style');
    style.id = 'particulas-style';
    style.textContent = `
      @keyframes float {
        0%, 100% {
          transform: translate(0, 0) scale(1);
          opacity: 0.3;
        }
        25% {
          transform: translate(20px, -20px) scale(1.2);
          opacity: 0.6;
        }
        50% {
          transform: translate(-15px, 15px) scale(0.8);
          opacity: 0.4;
        }
        75% {
          transform: translate(15px, -10px) scale(1.1);
          opacity: 0.5;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Atualiza as partículas baseado no modo atual
 */
function atualizarParticulas() {
  const particulas = document.querySelectorAll('.particula');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  particulas.forEach(particula => {
    if (isDarkMode) {
      particula.style.background = 'radial-gradient(circle, rgba(251, 118, 33, 0.8), transparent)';
    } else {
      particula.style.background = 'radial-gradient(circle, rgba(251, 118, 33, 0.6), transparent)';
    }
  });
}

// ==================== NOTIFICAÇÕES ====================
/**
 * Mostra uma notificação temporária na tela
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo da notificação ('sucesso', 'erro', 'info')
 */
function mostrarNotificacao(mensagem, tipo = 'info') {
  // Remove notificações existentes
  const notificacoesExistentes = document.querySelectorAll('.notificacao');
  notificacoesExistentes.forEach(n => n.remove());
  
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao notificacao-${tipo}`;
  notificacao.textContent = mensagem;
  
  notificacao.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${tipo === 'erro' ? '#ff4444' : tipo === 'sucesso' ? '#44ff44' : '#4488ff'};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    font-weight: 600;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notificacao);
  
  setTimeout(() => {
    notificacao.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notificacao.remove(), 300);
  }, 3000);
  
  // Adiciona animações se não existirem
  if (!document.getElementById('notificacao-style')) {
    const style = document.createElement('style');
    style.id = 'notificacao-style';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// ==================== INICIALIZAÇÃO ====================
/**
 * Inicializa a aplicação quando o DOM estiver pronto
 */
function inicializar() {
  console.log('🎨 Museu Interativo 3D inicializando...');
  
  // Carrega preferência de modo PRIMEIRO (antes de qualquer coisa)
  carregarPreferenciaModo();
  
  // Cria partículas animadas
  criarParticulas();
  
  // Adiciona suporte a atalhos de teclado
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D para alternar modo escuro
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      toggleMode();
    }
  });
  
  // Adiciona efeito de parallax suave ao scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const museu = document.querySelector('.museu');
        
        if (museu) {
          // Efeito parallax sutil no museu
          museu.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Fade in inicial
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  console.log('✅ Museu Interativo 3D inicializado com sucesso!');
}

// Executa inicialização quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  inicializar();
}

// ==================== EXPORTAÇÕES (para uso em módulos) ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    irPara,
    toggleMode,
    mostrarNotificacao
  };
}