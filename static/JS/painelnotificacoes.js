document.addEventListener('DOMContentLoaded', function() {
    const notificacoesBtn = document.getElementById('notificacoes-btn');
    const notificacoesBar = document.getElementById('notificacoes-bar');
  
    // Abre e fecha a barra de notificações ao clicar no botão
    notificacoesBtn.addEventListener('click', function(event) {
      event.stopPropagation(); // Previne o fechamento imediato
      notificacoesBar.classList.toggle('active');
    });
  
    // Fecha a barra se clicar fora dela
    document.addEventListener('click', function(event) {
      if (!notificacoesBar.contains(event.target) && !notificacoesBtn.contains(event.target)) {
        notificacoesBar.classList.remove('active');
      }
    });
  });
  
  