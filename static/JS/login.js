// Validação do formulário de login
document.getElementById('loginForm').addEventListener('submit', function (event) {
});

// Carregar scripts de login social sob demanda
document.querySelector('.facebook-btn').addEventListener('click', loadFacebookScript);
document.querySelector('.google-btn').addEventListener('click', loadGoogleScript);

// Função para carregar o SDK do Facebook
function loadFacebookScript() {
    if (!document.getElementById('facebook-sdk')) {
        const script = document.createElement('script');
        script.id = 'facebook-sdk';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        document.body.appendChild(script);
    }
}

// Função para carregar o SDK do Google
function loadGoogleScript() {
    if (!document.getElementById('google-sdk')) {
        const script = document.createElement('script');
        script.id = 'google-sdk';
        script.src = 'https://accounts.google.com/gsi/client';
        document.body.appendChild(script);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Verifica o botão de cadastro (caso queira manter o redirecionamento)
    document.getElementById('cadastro-btn')?.addEventListener('click', function(event) {
        event.preventDefault(); // Impede o comportamento padrão do link
        window.location.href = 'recuperacao_senha.html'; // Redireciona para a página de recuperação de senha
    });

    // Verifica o botão de login
    var loginButton = document.getElementById("login-btn");
    if (loginButton) {  // Verifica se o botão realmente existe
        loginButton.addEventListener("click", function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário (pode ser necessário para validações antes)
            
            // Exemplo de ação ao clicar no botão de login
            console.log("Botão de login clicado");
            
            // Adicionar a lógica de login aqui (ex: validação, redirecionamento, etc)
            // Aqui pode ser colocado o código para enviar o formulário ou fazer a validação antes de enviar
            document.getElementById("loginForm").submit(); // Submete o formulário manualmente se quiser enviar os dados
        });
    } else {
        console.log("Elemento de login não encontrado");
    }
});


