// ==================== SISTEMA DE AUTENTICAÇÃO ====================
// auth.js - Coloque este arquivo na pasta /js/

const AUTH = {
  USERS_KEY: 'museu_usuarios',
  CURRENT_USER_KEY: 'museu_usuario_atual',
  
  // Marcos disponíveis no museu
  MARCOS: [
    '1940-1950', '1958', '1965', '1966-1970', '1974', 
    '1980-1985', '1989-1991', '1993', '1995', 'Final-90s',
    '2004-2006', '2007', '2010', '2016', '2020', '2022-Diante'
  ],

  /**
   * Cadastrar novo usuário
   */
  cadastrar(nome, email, senha) {
    const usuarios = this.getUsuarios();
    
    // Verificar se já existe
    if (usuarios.find(u => u.nome === nome || u.email === email)) {
      return { sucesso: false, erro: 'Nome ou email já cadastrados.' };
    }

    // Criar novo usuário com estrutura completa
    const novoUsuario = {
      id: Date.now(),
      nome,
      email,
      senha, // Em produção, use hash! Aqui é só exemplo
      criadoEm: new Date().toISOString(),
      progresso: {
        marcosLidos: [], // Ex: ['1940-1950', '1958']
        quizzes: {} // Ex: { '1940-1950': { pontuacao: 80, data: '2025-01-01', tentativas: 2 } }
      }
    };

    usuarios.push(novoUsuario);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(usuarios));
    
    return { sucesso: true, usuario: novoUsuario };
  },

  /**
   * Fazer login
   */
  login(nome, senha) {
    const usuarios = this.getUsuarios();
    const usuario = usuarios.find(u => u.nome === nome && u.senha === senha);
    
    if (!usuario) {
      return { sucesso: false, erro: 'Usuário ou senha incorretos.' };
    }

    // Salvar usuário atual
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(usuario));
    return { sucesso: true, usuario };
  },

  /**
   * Fazer logout
   */
  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    window.location.href = 'login.html';
  },

  /**
   * Obter usuário logado
   */
  getUsuarioAtual() {
    const usuario = localStorage.getItem(this.CURRENT_USER_KEY);
    return usuario ? JSON.parse(usuario) : null;
  },

  /**
   * Verificar se está logado
   */
  estaLogado() {
    return this.getUsuarioAtual() !== null;
  },

  /**
   * Obter todos os usuários
   */
  getUsuarios() {
    const usuarios = localStorage.getItem(this.USERS_KEY);
    return usuarios ? JSON.parse(usuarios) : [];
  },

  /**
   * Atualizar dados do usuário atual
   */
  atualizarUsuario(usuario) {
    // Atualizar na lista de usuários
    const usuarios = this.getUsuarios();
    const index = usuarios.findIndex(u => u.id === usuario.id);
    
    if (index !== -1) {
      usuarios[index] = usuario;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(usuarios));
    }

    // Atualizar usuário atual
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(usuario));
  },

  /**
   * Marcar marco como lido
   */
  marcarMarcoLido(marcoId) {
    const usuario = this.getUsuarioAtual();
    if (!usuario) return;

    if (!usuario.progresso.marcosLidos.includes(marcoId)) {
      usuario.progresso.marcosLidos.push(marcoId);
      this.atualizarUsuario(usuario);
    }
  },

  /**
   * Salvar pontuação de quiz
   */
  salvarQuiz(marcoId, pontuacao) {
    const usuario = this.getUsuarioAtual();
    if (!usuario) return;

    const quizAtual = usuario.progresso.quizzes[marcoId];
    
    // Salvar apenas se for a primeira vez ou se a pontuação for maior
    if (!quizAtual || pontuacao > quizAtual.pontuacao) {
      usuario.progresso.quizzes[marcoId] = {
        pontuacao,
        data: new Date().toISOString(),
        tentativas: quizAtual ? quizAtual.tentativas + 1 : 1
      };
      this.atualizarUsuario(usuario);
    } else {
      // Apenas incrementar tentativas
      usuario.progresso.quizzes[marcoId].tentativas++;
      this.atualizarUsuario(usuario);
    }
  },

  /**
   * Obter estatísticas do usuário
   */
  getEstatisticas() {
    const usuario = this.getUsuarioAtual();
    if (!usuario) return null;

    const totalMarcos = this.MARCOS.length;
    const marcosLidos = usuario.progresso.marcosLidos.length;
    const quizzesFeitos = Object.keys(usuario.progresso.quizzes).length;
    
    let pontuacaoTotal = 0;
    Object.values(usuario.progresso.quizzes).forEach(quiz => {
      pontuacaoTotal += quiz.pontuacao;
    });
    
    const mediaQuizzes = quizzesFeitos > 0 ? Math.round(pontuacaoTotal / quizzesFeitos) : 0;
    const progressoTotal = Math.round(((marcosLidos + quizzesFeitos) / (totalMarcos * 2)) * 100);

    return {
      totalMarcos,
      marcosLidos,
      quizzesFeitos,
      pontuacaoTotal,
      mediaQuizzes,
      progressoTotal,
      detalhesQuizzes: usuario.progresso.quizzes
    };
  },

  /**
   * Criar botão de usuário no header (para adicionar em todas as páginas)
   */
  criarBotaoUsuario() {
    const usuario = this.getUsuarioAtual();
    if (!usuario) return;

    // Verificar se já existe
    if (document.getElementById('btn-usuario')) return;

    const btnUsuario = document.createElement('button');
    btnUsuario.id = 'btn-usuario';
    btnUsuario.className = 'btn-usuario';
    btnUsuario.innerHTML = `
      <span class="icon">👤</span>
      <span class="text">${usuario.nome}</span>
    `;
    btnUsuario.onclick = () => window.location.href = 'perfil.html';

    // Adicionar ao body (posição fixa)
    document.body.appendChild(btnUsuario);

    // Adicionar estilos se ainda não existirem
    if (!document.getElementById('auth-styles')) {
      const style = document.createElement('style');
      style.id = 'auth-styles';
      style.textContent = `
        .btn-usuario {
          position: fixed;
          top: 20px;
          right: 200px;
          padding: 20px 32px;
          background: linear-gradient(135deg, #4864ff 0%, #3651db 100%);
          border: none;
          border-radius: 30px;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 99;
        }

        .btn-usuario:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
        }

        @media (max-width: 768px) {
          .btn-usuario {
            top: 12px;
            right: 12px;
            font-size: 0.95rem;
            padding: 12px 20px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

// ==================== AUTO-EXECUTAR ====================
// Criar botão de usuário em todas as páginas (exceto login)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('login.html')) {
      AUTH.criarBotaoUsuario();
    }
  });
} else {
  if (!window.location.pathname.includes('login.html')) {
    AUTH.criarBotaoUsuario();
  }
}