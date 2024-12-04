document.addEventListener("DOMContentLoaded", function() {
    const tipoSwitch = document.getElementById("tipo-switch");
    const pessoaTexto = document.getElementById("pessoa-texto");
    const empresaTexto = document.getElementById("empresa-texto");

    const formPessoa = document.getElementById("form-pessoa");
    const formEmpresa = document.getElementById("form-empresa");

    // Alterna entre os formulários de Pessoa e Empresa
    function alternarFormulario() {
        if (tipoSwitch.checked) {
            // Exibe formulário de Empresa
            formPessoa.style.display = "none";
            formEmpresa.style.display = "block";
            pessoaTexto.classList.remove("selected");
            empresaTexto.classList.add("selected");
        } else {
            // Exibe formulário de Pessoa
            formPessoa.style.display = "block";
            formEmpresa.style.display = "none";
            pessoaTexto.classList.add("selected");
            empresaTexto.classList.remove("selected");
        }
    }

    // Evento para alternar o formulário ao mudar o switch
    tipoSwitch.addEventListener("change", alternarFormulario);

    // Inicializa exibindo o formulário de Pessoa
    alternarFormulario();

    // -------------------------------------------------------------------------
    // Código relacionado ao formulário de Pessoa
    // -------------------------------------------------------------------------

    const barraProgressoPessoa = document.getElementById("barra-progresso-pessoa");
    const etapasPessoa = document.querySelectorAll(".etapa-pessoa");
    let etapaAtualPessoa = 0;

    const cadastroFormPessoa = document.getElementById("cadastroFormPessoa");
    const resumoCadastroPessoa = document.getElementById("resumo-cadastro-pessoa");

    const emailInputPessoa = document.getElementById("email-pessoa");
    const emailFeedbackPessoa = document.getElementById("email-feedback-pessoa");
    const cpfInput = document.getElementById("cpf");
    const cpfFeedback = document.getElementById("cpf-feedback");
    const telefoneInputPessoa = document.getElementById("telefone-pessoa");
    const telefoneFeedbackPessoa = document.getElementById("telefone-feedback-pessoa");

    // Campos de endereço da pessoa
    const cepPessoaInput = document.getElementById("cep-pessoa");
    const enderecoPessoaInput = document.getElementById("endereco-pessoa");
    const numeroPessoaInput = document.getElementById("numero-pessoa");
    const complementoPessoaInput = document.getElementById("complemento-pessoa");
    const bairroPessoaInput = document.getElementById("bairro-pessoa");
    const cidadePessoaInput = document.getElementById("cidade-pessoa");
    const estadoPessoaInput = document.getElementById("estado-pessoa");
    const cepFeedbackPessoa = document.getElementById("cep-feedback-pessoa");

    // Funções para avançar e retroceder nas etapas do formulário de Pessoa
    document.getElementById("proximoBtnPessoa").addEventListener("click", function() {
        if (validarEtapaPessoa(etapaAtualPessoa)) {
            etapaAtualPessoa++;
            mostrarEtapaPessoa(etapaAtualPessoa);
        } else {
            alert("Por favor, preencha todos os campos obrigatórios corretamente antes de prosseguir.");
        }
    });

    document.getElementById("proximoBtn2Pessoa").addEventListener("click", function() {
        if (validarEtapaPessoa(etapaAtualPessoa)) {
            etapaAtualPessoa++;
            mostrarEtapaPessoa(etapaAtualPessoa);
            exibirResumoPessoa();
        } else {
            alert("Por favor, preencha todos os campos obrigatórios corretamente antes de prosseguir.");
        }
    });

    document.getElementById("anteriorBtnPessoa").addEventListener("click", function() {
        etapaAtualPessoa--;
        mostrarEtapaPessoa(etapaAtualPessoa);
    });

    document.getElementById("anteriorBtn2Pessoa").addEventListener("click", function() {
        etapaAtualPessoa--;
        mostrarEtapaPessoa(etapaAtualPessoa);
    });

    function mostrarEtapaPessoa(n) {
        etapasPessoa.forEach((etapa, index) => {
            etapa.style.display = index === n ? 'block' : 'none';
        });
        atualizarBarraProgressoPessoa(n);
    }

    function atualizarBarraProgressoPessoa(n) {
        const porcentagens = ['33%', '66%', '100%'];
        barraProgressoPessoa.style.width = porcentagens[n];
    }

    mostrarEtapaPessoa(etapaAtualPessoa);

    // Validação das etapas do formulário de Pessoa
    function validarEtapaPessoa(n) {
        let valid = true;
        const etapa = etapasPessoa[n];
        const campos = etapa.querySelectorAll('input[required], select[required]');

        campos.forEach(campo => {
            if (!campo.value.trim()) {
                campo.classList.add('invalid');
                valid = false;
            } else {
                campo.classList.remove('invalid');
            }
        });

        // Validações específicas
        if (n === 0) {
            const emailValido = validarEmail(emailInputPessoa.value);
            if (!emailValido) {
                emailFeedbackPessoa.textContent = "Email inválido";
                emailFeedbackPessoa.style.color = "red";
                emailInputPessoa.classList.add('invalid');
                valid = false;
            } else {
                emailFeedbackPessoa.textContent = "";
                emailInputPessoa.classList.remove('invalid');
            }
        } else if (n === 1) {
            const cpfValido = validarCPF(cpfInput.value);
            if (!cpfValido) {
                cpfFeedback.textContent = "CPF inválido";
                cpfFeedback.style.color = "red";
                cpfInput.classList.add('invalid');
                valid = false;
            } else {
                cpfFeedback.textContent = "";
                cpfInput.classList.remove('invalid');
            }

            const telefoneValido = validarTelefone(telefoneInputPessoa.value);
            if (!telefoneValido) {
                telefoneFeedbackPessoa.textContent = "Telefone inválido";
                telefoneFeedbackPessoa.style.color = "red";
                telefoneInputPessoa.classList.add('invalid');
                valid = false;
            } else {
                telefoneFeedbackPessoa.textContent = "";
                telefoneInputPessoa.classList.remove('invalid');
            }

            const cepValidoPessoa = validarCEP(cepPessoaInput.value);
            if (!cepValidoPessoa) {
                cepFeedbackPessoa.textContent = "CEP inválido.";
                cepFeedbackPessoa.style.color = "red";
                cepPessoaInput.classList.add('invalid');
                valid = false;
            } else {
                cepFeedbackPessoa.textContent = "";
                cepPessoaInput.classList.remove('invalid');
            }
        }

        return valid;
    }

    // Exibe o resumo antes da submissão (Pessoa)
    function exibirResumoPessoa() {
        resumoCadastroPessoa.innerHTML = `
            <p><strong>Nome:</strong> ${document.getElementById("nome-pessoa").value}</p>
            <p><strong>Email:</strong> ${emailInputPessoa.value}</p>
            <p><strong>CPF:</strong> ${cpfInput.value}</p>
            <p><strong>Telefone:</strong> ${telefoneInputPessoa.value}</p>
            <p><strong>Endereço:</strong> ${enderecoPessoaInput.value}, ${numeroPessoaInput.value} ${complementoPessoaInput.value ? '- ' + complementoPessoaInput.value : ''}</p>
            <p><strong>Bairro:</strong> ${bairroPessoaInput.value}</p>
            <p><strong>Cidade/Estado:</strong> ${cidadePessoaInput.value} - ${estadoPessoaInput.value}</p>
            <p><strong>Disponibilidade de Horário:</strong> ${document.getElementById("disponibilidade").value}</p>
        `;
    }

    // Submissão do formulário de Pessoa
    cadastroFormPessoa.addEventListener("submit", function(event) {
        // Validação final antes do envio
        if (document.getElementById("aceitar-termos-pessoa").checked) {
            // Remove o event.preventDefault() para permitir o envio do formulário
            console.log("Formulário de Pessoa enviado.");
        } else {
            // Bloqueia o envio apenas se os termos não forem aceitos
            event.preventDefault();
            alert("Você deve concordar com os termos para prosseguir.");
        }
    });
    

    // Validações em tempo real (Pessoa)
    emailInputPessoa.addEventListener("input", function() {
        const emailValido = validarEmail(emailInputPessoa.value);
        emailFeedbackPessoa.textContent = emailValido ? "" : "Email inválido";
        emailFeedbackPessoa.style.color = emailValido ? "green" : "red";
        if (emailValido) {
            emailInputPessoa.classList.remove('invalid');
        } else {
            emailInputPessoa.classList.add('invalid');
        }
    });

    cpfInput.addEventListener("input", function() {
        const cpfValido = validarCPF(cpfInput.value);
        cpfFeedback.textContent = cpfValido ? "" : "CPF inválido";
        cpfFeedback.style.color = cpfValido ? "green" : "red";
        if (cpfValido) {
            cpfInput.classList.remove('invalid');
        } else {
            cpfInput.classList.add('invalid');
        }
    });

    telefoneInputPessoa.addEventListener("input", function() {
        const telefoneValido = validarTelefone(telefoneInputPessoa.value);
        telefoneFeedbackPessoa.textContent = telefoneValido ? "" : "Telefone inválido";
        telefoneFeedbackPessoa.style.color = telefoneValido ? "green" : "red";
        if (telefoneValido) {
            telefoneInputPessoa.classList.remove('invalid');
        } else {
            telefoneInputPessoa.classList.add('invalid');
        }
    });

    // Evento de saída do campo CEP da pessoa
    cepPessoaInput.addEventListener("blur", function() {
        const cepValido = validarCEP(cepPessoaInput.value);
        if (cepValido) {
            buscarEnderecoPorCEP(cepPessoaInput.value, "pessoa");
            cepPessoaInput.classList.remove('invalid');
            cepFeedbackPessoa.textContent = "";
        } else {
            cepPessoaInput.classList.add('invalid');
            cepFeedbackPessoa.textContent = "CEP inválido.";
            cepFeedbackPessoa.style.color = "red";
        }
    });

    // -------------------------------------------------------------------------
    // Código relacionado ao formulário de Empresa
    // -------------------------------------------------------------------------

    const barraProgressoEmpresa = document.getElementById("barra-progresso-empresa");
    const etapasEmpresa = document.querySelectorAll(".etapa-empresa");
    let etapaAtualEmpresa = 0;

    const cadastroFormEmpresa = document.getElementById("cadastroFormEmpresa");
    const resumoCadastroEmpresa = document.getElementById("resumo-cadastro-empresa");

    const emailInputEmpresa = document.getElementById("email-empresa");
    const emailFeedbackEmpresa = document.getElementById("email-feedback-empresa");
    const cnpjInput = document.getElementById("cnpj");
    const cnpjFeedback = document.getElementById("cnpj-feedback");

    // Campos de endereço da empresa
    const cepEmpresaInput = document.getElementById("cep-empresa");
    const enderecoEmpresaInput = document.getElementById("endereco-empresa");
    const numeroEmpresaInput = document.getElementById("numero-empresa");
    const complementoEmpresaInput = document.getElementById("complemento-empresa");
    const bairroEmpresaInput = document.getElementById("bairro-empresa");
    const cidadeEmpresaInput = document.getElementById("cidade-empresa");
    const estadoEmpresaInput = document.getElementById("estado-empresa");
    const cepFeedbackEmpresa = document.getElementById("cep-feedback-empresa");

    // Funções para avançar e retroceder nas etapas do formulário de Empresa
    document.getElementById("proximoBtnEmpresa").addEventListener("click", function() {
        if (validarEtapaEmpresa(etapaAtualEmpresa)) {
            etapaAtualEmpresa++;
            mostrarEtapaEmpresa(etapaAtualEmpresa);
        } else {
            alert("Por favor, preencha todos os campos obrigatórios corretamente antes de prosseguir.");
        }
    });

    document.getElementById("proximoBtn2Empresa").addEventListener("click", function() {
        if (validarEtapaEmpresa(etapaAtualEmpresa)) {
            etapaAtualEmpresa++;
            mostrarEtapaEmpresa(etapaAtualEmpresa);
            exibirResumoEmpresa();
        } else {
            alert("Por favor, preencha todos os campos obrigatórios corretamente antes de prosseguir.");
        }
    });

    document.getElementById("anteriorBtnEmpresa").addEventListener("click", function() {
        etapaAtualEmpresa--;
        mostrarEtapaEmpresa(etapaAtualEmpresa);
    });

    document.getElementById("anteriorBtn2Empresa").addEventListener("click", function() {
        etapaAtualEmpresa--;
        mostrarEtapaEmpresa(etapaAtualEmpresa);
    });

    function mostrarEtapaEmpresa(n) {
        etapasEmpresa.forEach((etapa, index) => {
            etapa.style.display = index === n ? 'block' : 'none';
        });
        atualizarBarraProgressoEmpresa(n);
    }

    function atualizarBarraProgressoEmpresa(n) {
        const porcentagens = ['33%', '66%', '100%'];
        barraProgressoEmpresa.style.width = porcentagens[n];
    }

    mostrarEtapaEmpresa(etapaAtualEmpresa);

    // Validação das etapas do formulário de Empresa
    function validarEtapaEmpresa(n) {
        let valid = true;
        const etapa = etapasEmpresa[n];
        const campos = etapa.querySelectorAll('input[required], select[required]');

        campos.forEach(campo => {
            if (!campo.value.trim()) {
                campo.classList.add('invalid');
                valid = false;
            } else {
                campo.classList.remove('invalid');
            }
        });

        // Validações específicas
        if (n === 0) {
            const emailValido = validarEmail(emailInputEmpresa.value);
            if (!emailValido) {
                emailFeedbackEmpresa.textContent = "Email inválido";
                emailFeedbackEmpresa.style.color = "red";
                emailInputEmpresa.classList.add('invalid');
                valid = false;
            } else {
                emailFeedbackEmpresa.textContent = "";
                emailInputEmpresa.classList.remove('invalid');
            }
        } else if (n === 1) {
            const cnpjValido = validarCNPJ(cnpjInput.value);
            if (!cnpjValido) {
                cnpjFeedback.textContent = "CNPJ inválido";
                cnpjFeedback.style.color = "red";
                cnpjInput.classList.add('invalid');
                valid = false;
            } else {
                cnpjFeedback.textContent = "";
                cnpjInput.classList.remove('invalid');
            }

            const cepValidoEmpresa = validarCEP(cepEmpresaInput.value);
            if (!cepValidoEmpresa) {
                cepFeedbackEmpresa.textContent = "CEP inválido.";
                cepFeedbackEmpresa.style.color = "red";
                cepEmpresaInput.classList.add('invalid');
                valid = false;
            } else {
                cepFeedbackEmpresa.textContent = "";
                cepEmpresaInput.classList.remove('invalid');
            }
        }

        return valid;
    }

    // Exibe o resumo antes da submissão (Empresa)
    function exibirResumoEmpresa() {
        resumoCadastroEmpresa.innerHTML = `
            <p><strong>Razão Social:</strong> ${document.getElementById("razao-social").value}</p>
            <p><strong>Email:</strong> ${emailInputEmpresa.value}</p>
            <p><strong>CNPJ:</strong> ${cnpjInput.value}</p>
            <p><strong>Porte da Empresa:</strong> ${document.getElementById("porte").value}</p>
            <p><strong>Endereço:</strong> ${enderecoEmpresaInput.value}, ${numeroEmpresaInput.value} ${complementoEmpresaInput.value ? '- ' + complementoEmpresaInput.value : ''}</p>
            <p><strong>Bairro:</strong> ${bairroEmpresaInput.value}</p>
            <p><strong>Cidade/Estado:</strong> ${cidadeEmpresaInput.value} - ${estadoEmpresaInput.value}</p>
            <p><strong>Website:</strong> ${document.getElementById("website").value}</p>
        `;
    }

    // Submissão do formulário de Empresa
    cadastroFormEmpresa.addEventListener("submit", function(event) {
        // Validação final antes do envio
        if (document.getElementById("aceitar-termos-empresa").checked) {
            // Remove o event.preventDefault() para permitir o envio do formulário
            console.log("Formulário de Empresa enviado.");
        } else {
            // Bloqueia o envio apenas se os termos não forem aceitos
            event.preventDefault();
            alert("Você deve concordar com os termos para prosseguir.");
        }
    });

    // Validações em tempo real (Empresa)
    emailInputEmpresa.addEventListener("input", function() {
        const emailValido = validarEmail(emailInputEmpresa.value);
        emailFeedbackEmpresa.textContent = emailValido ? "" : "Email inválido";
        emailFeedbackEmpresa.style.color = emailValido ? "green" : "red";
        if (emailValido) {
            emailInputEmpresa.classList.remove('invalid');
        } else {
            emailInputEmpresa.classList.add('invalid');
        }
    });

    cnpjInput.addEventListener("input", function() {
        const cnpjValido = validarCNPJ(cnpjInput.value);
        cnpjFeedback.textContent = cnpjValido ? "" : "CNPJ inválido";
        cnpjFeedback.style.color = cnpjValido ? "green" : "red";
        if (cnpjValido) {
            cnpjInput.classList.remove('invalid');
        } else {
            cnpjInput.classList.add('invalid');
        }
    });

    // Evento de saída do campo CEP da empresa
    cepEmpresaInput.addEventListener("blur", function() {
        const cepValido = validarCEP(cepEmpresaInput.value);
        if (cepValido) {
            buscarEnderecoPorCEP(cepEmpresaInput.value, "empresa");
            cepEmpresaInput.classList.remove('invalid');
            cepFeedbackEmpresa.textContent = "";
        } else {
            cepEmpresaInput.classList.add('invalid');
            cepFeedbackEmpresa.textContent = "CEP inválido.";
            cepFeedbackEmpresa.style.color = "red";
        }
    });

    // -------------------------------------------------------------------------
    // Funções de Validação Comuns
    // -------------------------------------------------------------------------

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }
        let soma = 0;
        let resto;
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) {
            return false;
        }
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) {
            return false;
        }
        return true;
    }

    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
            return false;
        }
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) {
            return false;
        }
        tamanho += 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) {
            return false;
        }
        return true;
    }

    function validarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '');
        const regex = /^(\d{10,11})$/;
        return regex.test(telefone);
    }

    function validarCEP(cep) {
        const regex = /^[0-9]{5}-?[0-9]{3}$/;
        return regex.test(cep);
    }

    function buscarEnderecoPorCEP(cep, tipo) {
        const cepLimpo = cep.replace(/\D/g, '');
        const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    if (tipo === "empresa") {
                        enderecoEmpresaInput.value = data.logradouro;
                        bairroEmpresaInput.value = data.bairro;
                        cidadeEmpresaInput.value = data.localidade;
                        estadoEmpresaInput.value = data.uf;
                        cepFeedbackEmpresa.textContent = "";
                    } else {
                        enderecoPessoaInput.value = data.logradouro;
                        bairroPessoaInput.value = data.bairro;
                        cidadePessoaInput.value = data.localidade;
                        estadoPessoaInput.value = data.uf;
                        cepFeedbackPessoa.textContent = "";
                    }
                } else {
                    if (tipo === "empresa") {
                        cepFeedbackEmpresa.textContent = "CEP não encontrado.";
                        cepFeedbackEmpresa.style.color = "red";
                    } else {
                        cepFeedbackPessoa.textContent = "CEP não encontrado.";
                        cepFeedbackPessoa.style.color = "red";
                    }
                }
            })
            .catch(error => {
                console.error("Erro ao buscar CEP:", error);
                if (tipo === "empresa") {
                    cepFeedbackEmpresa.textContent = "Erro ao buscar CEP.";
                    cepFeedbackEmpresa.style.color = "red";
                } else {
                    cepFeedbackPessoa.textContent = "Erro ao buscar CEP.";
                    cepFeedbackPessoa.style.color = "red";
                }
            });
    }
});
