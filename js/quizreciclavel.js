// ==================== CONFIGURAÇÃO ====================
const CONFIG = {
  DARK_MODE_KEY: "museu_dark_mode"
};

// ==================== VARIÁVEIS DO QUIZ ====================
let questoes = [];
let questaoAtual = 0;
let pontuacao = 0;
let acertos = 0;
let erros = 0;

// ==================== MODO ESCURO ====================
function toggleMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    const btn = document.querySelector('.btn-toggle');
    const icon = btn?.querySelector('.icon');
    const text = btn?.querySelector('.text');
    
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (text) text.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
    
    localStorage.setItem(CONFIG.DARK_MODE_KEY, isDark);
}

function carregarPreferenciaModo() {
    const darkMode = localStorage.getItem(CONFIG.DARK_MODE_KEY) === 'true';
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const btn = document.querySelector('.btn-toggle');
        const icon = btn?.querySelector('.icon');
        const text = btn?.querySelector('.text');
        
        if (icon) icon.textContent = '☀️';
        if (text) text.textContent = 'Modo Claro';
    }
}

// ==================== CARREGAR QUESTÕES ====================
function carregarQuestoes() {
    try {
        const scriptData = document.getElementById('quiz-data');
        if (!scriptData) {
            console.error('Elemento quiz-data não encontrado!');
            return false;
        }
        
        const data = JSON.parse(scriptData.textContent);
        questoes = data.questoes;
        
        console.log(`✅ ${questoes.length} questões carregadas!`);
        return true;
    } catch (error) {
        console.error('Erro ao carregar questões:', error);
        return false;
    }
}

// ==================== DETECTAR MARCO DO QUIZ ====================
function detectarMarco() {
  const path = window.location.pathname;
  
  if (path.includes('quiz40-50.html')) return '1940-1950';
  else if (path.includes('quiz1958.html')) return '1958';
  else if (path.includes('quiz1965.html')) return '1965';
  else if (path.includes('quiz1966-70.html')) return '1966-1970';
  else if (path.includes('quiz1974.html')) return '1974';
  else if (path.includes('quiz1980-85.html')) return '1980-1985';
  else if (path.includes('quiz1989-91.html')) return '1989-1991';
  else if (path.includes('quiz1993.html')) return '1993';
  else if (path.includes('quiz1995.html')) return '1995';
  else if (path.includes('quiz-final-90s.html')) return 'Final-90s';
  else if (path.includes('quiz2004-06.html')) return '2004-2006';
  else if (path.includes('quiz2007.html')) return '2007';
  else if (path.includes('quiz2010.html')) return '2010';
  else if (path.includes('quiz2016.html')) return '2016';
  else if (path.includes('quiz2020.html')) return '2020';
  else if (path.includes('quiz2022.html')) return '2022-Diante';
  
  return null;
}

// ==================== INICIAR QUIZ ====================
function iniciarQuiz() {
    if (!carregarQuestoes()) {
        alert('Erro ao carregar o quiz!');
        return;
    }

    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('tela-quiz').style.display = 'block';
    
    questaoAtual = 0;
    pontuacao = 0;
    acertos = 0;
    erros = 0;
    
    mostrarQuestao();
}

// ==================== MOSTRAR QUESTÃO ====================
function mostrarQuestao() {
    if (questaoAtual >= questoes.length) {
        mostrarResultado();
        return;
    }

    const questao = questoes[questaoAtual];
    
    // Atualizar informações
    document.getElementById('numero-questao').textContent = `Questão ${questaoAtual + 1} de ${questoes.length}`;
    document.getElementById('pontuacao-atual').textContent = `Pontos: ${pontuacao}`;
    
    // Atualizar barra de progresso
    const progresso = ((questaoAtual + 1) / questoes.length) * 100;
    document.getElementById('progresso-fill').style.width = progresso + '%';
    
    // Mostrar pergunta
    document.getElementById('texto-questao').textContent = questao.pergunta;
    
    // Mostrar opções
    const container = document.getElementById('opcoes-container');
    container.innerHTML = '';
    
    questao.opcoes.forEach((opcao, index) => {
        const div = document.createElement('div');
        div.className = 'opcao';
        div.textContent = opcao;
        div.onclick = () => verificarResposta(index);
        container.appendChild(div);
    });
    
    // Esconder botão próxima
    document.getElementById('btn-proxima').style.display = 'none';
}

// ==================== VERIFICAR RESPOSTA ====================
function verificarResposta(indexSelecionado) {
    const questao = questoes[questaoAtual];
    const opcoes = document.querySelectorAll('.opcao');
    
    // Desabilitar todas as opções
    opcoes.forEach(opcao => opcao.classList.add('desabilitada'));
    
    if (indexSelecionado === questao.correta) {
        // Resposta correta
        opcoes[indexSelecionado].classList.add('correta');
        pontuacao += 10;
        acertos++;
    } else {
        // Resposta incorreta
        opcoes[indexSelecionado].classList.add('incorreta');
        opcoes[questao.correta].classList.add('correta');
        erros++;
    }
    
    // Mostrar botão próxima
    document.getElementById('btn-proxima').style.display = 'block';
}

// ==================== PRÓXIMA QUESTÃO ====================
function proximaQuestao() {
    questaoAtual++;
    mostrarQuestao();
}

// ==================== MOSTRAR RESULTADO ====================
function mostrarResultado() {
    document.getElementById('tela-quiz').style.display = 'none';
    document.getElementById('tela-resultado').style.display = 'block';
    
    const percentual = Math.round((acertos / questoes.length) * 100);
    
    // Determinar ícone e título
    let icone, titulo, mensagem;
    
    if (percentual >= 90) {
        icone = '🏆';
        titulo = 'Excelente!';
        mensagem = 'Você domina completamente este período histórico!';
    } else if (percentual >= 70) {
        icone = '🎉';
        titulo = 'Muito Bom!';
        mensagem = 'Você tem um ótimo conhecimento sobre o tema!';
    } else if (percentual >= 50) {
        icone = '👍';
        titulo = 'Bom Trabalho!';
        mensagem = 'Você está no caminho certo, continue estudando!';
    } else {
        icone = '📚';
        titulo = 'Continue Estudando!';
        mensagem = 'Revisite o conteúdo e tente novamente!';
    }
    
    // Preencher resultado
    document.getElementById('icone-resultado').textContent = icone;
    document.getElementById('titulo-resultado').textContent = titulo;
    document.getElementById('pontos-final').textContent = pontuacao;
    document.getElementById('total-acertos').textContent = acertos;
    document.getElementById('total-erros').textContent = erros;
    document.getElementById('percentual').textContent = percentual + '%';
    document.getElementById('mensagem-resultado').textContent = mensagem;

    // ==================== SALVAR PONTUAÇÃO ====================
    if (AUTH && AUTH.estaLogado()) {
        const marcoId = detectarMarco();
        if (marcoId) {
            AUTH.salvarQuiz(marcoId, pontuacao);
            console.log(`✅ Pontuação ${pontuacao} salva para ${marcoId}!`);
        }
    }
}

// ==================== REINICIAR QUIZ ====================
function reiniciarQuiz() {
    document.getElementById('tela-resultado').style.display = 'none';
    document.getElementById('tela-inicial').style.display = 'block';
    
    questaoAtual = 0;
    pontuacao = 0;
    acertos = 0;
    erros = 0;
}

// ==================== ACESSIBILIDADE ====================
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
    const header = document.querySelector('header');
    const cardInicio = document.querySelector('.card-inicio');
    
    let textToRead = '';
    
    if (header) {
      const h1 = header.querySelector('h1');
      const h2 = header.querySelector('h2');
      if (h1) textToRead += h1.textContent + '. ';
      if (h2) textToRead += h2.textContent + '. ';
    }
    
    if (cardInicio && cardInicio.style.display !== 'none') {
      const paragraphs = cardInicio.querySelectorAll('p');
      paragraphs.forEach(p => {
        if (p.textContent.trim()) {
          textToRead += p.textContent + '. ';
        }
      });
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
  const widget = document.getElementById('vlibras-widget');
  if (widget) {
    widget.style.display = vlibrasEnabled ? 'block' : 'none';
  }
  
  const btn = event.target.closest('button');
  btn.style.background = vlibrasEnabled ? 
    'rgba(255, 255, 255, 0.3)' : 
    'rgba(255, 255, 255, 0.1)';
}

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
    console.log('🎯 Página de Quiz inicializando...');
    
    carregarPreferenciaModo();
    
    console.log('✅ Página de Quiz inicializada!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}