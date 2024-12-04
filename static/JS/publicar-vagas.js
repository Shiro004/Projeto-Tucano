const apiKey = '3c6379f801d94c6da9e8004e5068503e';

// Função para buscar sugestões de local
document.addEventListener("DOMContentLoaded", function () {
    const localInput = document.querySelector('#local');
    if (localInput) {
        localInput.addEventListener('input', function () {
            const query = this.value;

            if (query.length > 2) {
                fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&language=pt`)
                    .then(response => response.json())
                    .then(data => {
                        const sugestoes = document.querySelector('#sugestoes-local');
                        if (sugestoes) {
                            sugestoes.innerHTML = ''; // Limpar sugestões anteriores

                            data.results.forEach(result => {
                                const li = document.createElement('li');
                                li.textContent = result.formatted;
                                li.addEventListener('click', function () {
                                    localInput.value = result.formatted;
                                    sugestoes.innerHTML = ''; // Limpar sugestões após seleção
                                });
                                sugestoes.appendChild(li);
                            });
                        }
                    })
                    .catch(err => console.error('Erro ao buscar local:', err));
            }
        });
    }
});

// Função para publicar a oportunidade
document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector('#formulario-publicacao');
    if (formulario) {
        formulario.addEventListener('submit', function (evento) {
            // Bloquear o envio padrão para realizar validações
            evento.preventDefault();

            // Coletar os dados do formulário
            const titulo = document.querySelector('#titulo').value;
            const descricao = document.querySelector('#descricao').value;
            const valor = document.querySelector('#valor').value;
            const local = document.querySelector('#local').value;
            const categoria = document.querySelector('#categoria').value;
            const dataInicio = document.querySelector('#dataInicio').value;
            const dataFim = document.querySelector('#dataFim').value;
            const horarioInicio = document.querySelector('#horarioInicio').value;
            const horarioFim = document.querySelector('#horarioFim').value;

            // Aqui a variável status é atribuída como true logo de cara
            const status = true;  // Agora status será sempre verdadeiro

            // Validação dos campos obrigatórios
            if (!titulo || !descricao || !valor || !local || !categoria || !dataInicio || !dataFim || !horarioInicio || !horarioFim) {
                alert('Preencha todos os campos obrigatórios.');
                return;  // Não envia o formulário se faltar algum campo
            }

            // Verificar se a checkbox de status está marcada (não se aplica, pois o status é true)
            if (!status) {
                alert("Você deve concordar com os Termos de Uso para prosseguir.");
                return; // Não envia o formulário se os termos não forem aceitos
            }

            // Exibir os dados da oportunidade para depuração (você pode remover isso depois)
            alert(`Oportunidade Publicada:\\nCategoria: ${categoria}\\nTítulo: ${titulo}\\nDescrição: ${descricao}\\nValor: ${valor}\\nLocal: ${local}\\nData: de ${dataInicio} até ${dataFim}\\nHorário: de ${horarioInicio} até ${horarioFim}\\nStatus: ${status}`);

            // Agora, o formulário é enviado para o servidor
            formulario.submit();  // Enviar o formulário manualmente após as validações
        });
    }
});
