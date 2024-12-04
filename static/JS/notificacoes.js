document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const extraDetails = e.target.closest('.notification-card').querySelector('.extra-details');
        extraDetails.classList.toggle('expanded');
        button.innerText = extraDetails.classList.contains('expanded') ? 'Fechar Detalhes' : 'Ver Detalhes';
    });
});
document.addEventListener("DOMContentLoaded", () => {
    
    const notifications = document.querySelectorAll('.notification-card');
    
   
    const notificationCount = notifications.length;
    
    
    const countElement = document.querySelector('.notification-count');
    countElement.innerText = `Total de notificações: ${notificationCount}`;
});

