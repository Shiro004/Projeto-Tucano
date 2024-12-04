from app import app, db
from flask import render_template, redirect, url_for, flash, request
from models import Usuario, Pessoa, Empresa, Inscricao, Oportunidade
from flask_login import login_required, current_user, login_user, logout_user, LoginManager
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError

# Configuração do Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # Nome da rota de login

# Função para carregar o usuário
@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))


# Página inicial (redireciona para login)
@app.route('/')
def index():
    return redirect(url_for('home'))


# Cadastro de usuário
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        try:
            tipo = request.form.get('tipo')  # 'Pessoa' ou 'Empresa'
            email = request.form.get('email-pessoa') if tipo == 'Pessoa' else request.form.get('email-empresa')
            senha = request.form.get('senha-pessoa') if tipo == 'Pessoa' else request.form.get('senha-empresa')

            # Verificar se o email já existe
            usuario_existente = Usuario.query.filter_by(email=email).first()
            if usuario_existente:
                flash('Email já cadastrado.', 'danger')
                return redirect(url_for('cadastro'))

            # Verificações específicas para 'Pessoa' e 'Empresa'
            if tipo == 'Pessoa':
                cpf = request.form.get('cpf')
                cpf_existente = Pessoa.query.filter_by(cpf=cpf).first()
                if cpf_existente:
                    flash('CPF já cadastrado.', 'danger')
                    return redirect(url_for('cadastro'))
            elif tipo == 'Empresa':
                cnpj = request.form.get('cnpj')
                cnpj_existente = Empresa.query.filter_by(cnpj=cnpj).first()
                if cnpj_existente:
                    flash('CNPJ já cadastrado.', 'danger')
                    return redirect(url_for('cadastro'))
            else:
                flash('Tipo de usuário inválido.', 'danger')
                return redirect(url_for('cadastro'))

            # Criar novo usuário
            usuario = Usuario(email=email, tipo=tipo)
            usuario.set_senha(senha)
            db.session.add(usuario)
            db.session.flush()  # Garante que o ID seja gerado

            # Criar 'Pessoa' ou 'Empresa' conforme o tipo
            if tipo == 'Pessoa':
                nome = request.form.get('nome-pessoa')
                telefone = request.form.get('telefone-pessoa')
                disponibilidade = request.form.get('disponibilidade')
                cep = request.form.get('cep-pessoa')
                endereco = request.form.get('endereco-pessoa')
                numero = request.form.get('numero-pessoa')
                complemento = request.form.get('complemento-pessoa')
                bairro = request.form.get('bairro-pessoa')
                cidade = request.form.get('cidade-pessoa')
                estado = request.form.get('estado-pessoa')

                # Verificar campos obrigatórios
                campos_obrigatorios = [nome, cpf, telefone, disponibilidade, cep, endereco, numero, bairro, cidade, estado]
                if not all(campos_obrigatorios):
                    db.session.rollback()
                    flash('Preencha todos os campos obrigatórios para Pessoa.', 'danger')
                    return redirect(url_for('cadastro'))

                pessoa = Pessoa(
                    usuario_id=usuario.id,
                    nome=nome,
                    cpf=cpf,
                    telefone=telefone,
                    disponibilidade=disponibilidade,
                    cep=cep,
                    endereco=endereco,
                    numero=numero,
                    complemento=complemento,
                    bairro=bairro,
                    cidade=cidade,
                    estado=estado
                )
                db.session.add(pessoa)

            elif tipo == 'Empresa':
                razao_social = request.form.get('razao-social')
                cnpj = request.form.get('cnpj')
                porte = request.form.get('porte')
                cep = request.form.get('cep-empresa')
                endereco = request.form.get('endereco-empresa')
                numero = request.form.get('numero-empresa')
                complemento = request.form.get('complemento-empresa')
                bairro = request.form.get('bairro-empresa')
                cidade = request.form.get('cidade-empresa')
                estado = request.form.get('estado-empresa')
                website = request.form.get('website')

                # Verificar campos obrigatórios
                campos_obrigatorios = [razao_social, cnpj, porte, cep, endereco, numero, bairro, cidade, estado]
                if not all(campos_obrigatorios):
                    db.session.rollback()
                    flash('Preencha todos os campos obrigatórios para Empresa.', 'danger')
                    return redirect(url_for('cadastro'))

                empresa = Empresa(
                    usuario_id=usuario.id,
                    razao_social=razao_social,
                    cnpj=cnpj,
                    porte=porte,
                    cep=cep,
                    endereco=endereco,
                    numero=numero,
                    complemento=complemento,
                    bairro=bairro,
                    cidade=cidade,
                    estado=estado,
                    website=website
                )
                db.session.add(empresa)

            # Confirmar alterações no banco de dados
            db.session.commit()
            flash('Cadastro realizado com sucesso! Faça login.', 'success')
            return redirect(url_for('login'))

        except IntegrityError as e:
            db.session.rollback()
            flash('Erro de integridade de dados. Tente novamente.', 'danger')
            print(f"Erro de integridade: {e}")
            return redirect(url_for('cadastro'))
        except Exception as e:
            db.session.rollback()
            flash('Erro ao realizar cadastro. Tente novamente.', 'danger')
            print(f"Erro no cadastro: {e}")
            return redirect(url_for('cadastro'))

    return render_template('cadastro.html')


# Login de usuário
@app.route('/login', methods=['GET', 'POST'])
def login():
    usuario = current_user
    if request.method == 'POST':
        try:
            email = request.form.get('email')
            senha = request.form.get('senha')
            usuario = Usuario.query.filter_by(email=email).first()

            if usuario and usuario.check_senha(senha):
                login_user(usuario)  # Autentica o usuário

                # Verifica se o usuário é uma empresa ou um usuário comum
                if usuario.tipo == 'Pessoa':  # Certifique-se de que o valor é 'Pessoa' (com "P" maiúsculo)
                    return redirect(url_for('home_'))  # Ajuste para a home correta
                    
                elif usuario.tipo == 'Empresa':
                    return redirect(url_for('home_'))  # Ajuste para a home correta

                else:
                    return redirect(url_for('home'))  # Redireciona para a página inicial comum


            else:
                flash('Email ou senha incorretos.', 'danger')
                return redirect(url_for('login'))

        except Exception as e:
            flash('Erro durante o login. Tente novamente.', 'danger')
            print(f"Erro no login: {e}")
            return redirect(url_for('login'))

    return render_template('login.html')


# Logout de usuário
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Você saiu da sua conta.', 'info')
    return redirect(url_for('login'))

# Perfil do usuário
@app.route('/perfil')
@login_required  # Garante que o usuário esteja autenticado
def perfil():
    usuario = current_user  # Obtém o usuário logado via Flask-Login

    if usuario.tipo == 'Pessoa':
        pessoa = usuario.pessoa  # Obtém os dados da pessoa associada ao usuário
        return render_template('perfil.html', usuario=usuario, pessoa=pessoa)

    elif usuario.tipo == 'Empresa':
        empresa = Empresa.query.filter_by(usuario_id=usuario.id).first()  # Obtém os dados da empresa associada
        return render_template('perfil_empresa.html', usuario=usuario, empresa=empresa)

    # Caso o tipo do usuário seja inválido
    flash('Tipo de usuário inválido.', 'danger')
    return redirect(url_for('home'))  # Redireciona para a home caso tipo seja inválido


# Publicação de vagas
@app.route('/publicar_vagas', methods=['GET', 'POST'])
@login_required
def publicar_vagas():
    if current_user.tipo != 'Empresa':
        flash('Somente usuários empresa podem acessar esta página.', 'danger')
        return redirect(url_for('home'))

    if request.method == 'POST':
        try:
            titulo = request.form.get('titulo')
            descricao = request.form.get('descricao')
            valor = request.form.get('valor')
            local = request.form.get('local')
            categoria = request.form.get('categoria')
            data_inicio = request.form.get('dataInicio')
            data_fim = request.form.get('dataFim')
            horario_inicio = request.form.get('horarioInicio')
            horario_fim = request.form.get('horarioFim')

            # Validando se todos os campos obrigatórios foram preenchidos
            campos_obrigatorios = [titulo, descricao, valor, local, categoria, data_inicio, data_fim, horario_inicio, horario_fim]
            if not all(campos_obrigatorios):
                flash('Preencha todos os campos obrigatórios.', 'danger')
                return redirect(url_for('publicar_vagas'))

            # Validar datas e horários
            if not Oportunidade.validar_datas(data_inicio, data_fim):
                flash('A data de início deve ser anterior à data de fim.', 'danger')
                return redirect(url_for('publicar_vagas'))

            if not Oportunidade.validar_horarios(horario_inicio, horario_fim):
                flash('O horário de início deve ser anterior ao horário de fim.', 'danger')
                return redirect(url_for('publicar_vagas'))

            # Criar a nova oportunidade
            oportunidade = Oportunidade(
                titulo=titulo,
                descricao=descricao,
                valor=valor,
                local=local,
                categoria=categoria,
                data_inicio=data_inicio,
                data_fim=data_fim,
                horario_inicio=horario_inicio,
                horario_fim=horario_fim,
                empresa_id=current_user.empresa.empresa_id  # Relacionando à empresa correta
            )

            # Adicionar ao banco de dados
            db.session.add(oportunidade)
            db.session.commit()

            flash('Oportunidade publicada com sucesso!', 'success')
            return redirect(url_for('publicar_vagas'))

        except IntegrityError as e:
            db.session.rollback()
            flash('Erro de integridade de dados. Tente novamente.', 'danger')
            print(f"Erro de integridade na publicação: {e}")
            return redirect(url_for('publicar_vagas'))
        except Exception as e:
            db.session.rollback()
            flash('Erro ao publicar a oportunidade. Tente novamente.', 'danger')
            print(f"Erro na publicação: {e}")
            return redirect(url_for('publicar_vagas'))

    return render_template('publicar_vagas.html')

@app.route('/busca_logado')
@login_required
def busca_logado():
    oportunidades = Oportunidade.query.filter_by(status=True).all()
    return render_template('busca_logado.html', oportunidades=oportunidades)

# Página de busca de oportunidades
@app.route('/busca')
def busca():
    oportunidades = Oportunidade.query.filter_by(status=True).all()
    return render_template('busca.html', oportunidades=oportunidades)


# Notificações
@app.route('/notificacoes')
@login_required
def notificacoes():
    return render_template('notificacoes.html')


# Detalhe de uma vaga
@app.route('/vaga/<int:oportunidade_id>')
def vaga(oportunidade_id):
    oportunidade = Oportunidade.query.get_or_404(oportunidade_id)
    return render_template('vaga.html', oportunidade=oportunidade)


# Inscrição em uma vaga
@app.route('/inscrever/<int:oportunidade_id>', methods=['POST'])
@login_required
def inscrever(oportunidade_id):
    if current_user.tipo != 'Pessoa':
        flash("Somente usuários pessoa podem se inscrever nas vagas!", "danger")
        return redirect(url_for('vaga', oportunidade_id=oportunidade_id))

    # Verifica se o usuário já está inscrito na vaga
    inscricao_existente = Inscricao.query.filter_by(usuario_id=current_user.id, oportunidade_id=oportunidade_id).first()
    if inscricao_existente:
        flash("Você já está inscrito nesta vaga!", "warning")
        return redirect(url_for('vaga', oportunidade_id=oportunidade_id))

    try:
        # Cria a inscrição
        inscricao = Inscricao(usuario_id=current_user.id, oportunidade_id=oportunidade_id)
        db.session.add(inscricao)
        db.session.commit()

        flash("Inscrição realizada com sucesso!", "success")
        return redirect(url_for('vaga', oportunidade_id=oportunidade_id))

    except IntegrityError as e:
        db.session.rollback()
        flash("Erro de integridade ao se inscrever. Tente novamente.", "danger")
        print(f"Erro de integridade na inscrição: {e}")
        return redirect(url_for('vaga', oportunidade_id=oportunidade_id))
    except Exception as e:
        db.session.rollback()
        flash("Erro ao se inscrever. Tente novamente.", "danger")
        print(f"Erro na inscrição: {e}")
        return redirect(url_for('vaga', oportunidade_id=oportunidade_id))

@app.route('/atualizar_status/<int:oportunidade_id>', methods=['POST'])
@login_required
def atualizar_status_oportunidade(oportunidade_id):
    # Verifica se o usuário é uma empresa
    if current_user.tipo != 'Empresa':
        flash('Somente empresas podem alterar o status de oportunidades.', 'danger')
        return redirect(url_for('perfil'))

    try:
        # Busca a oportunidade pelo ID
        oportunidade = Oportunidade.query.get_or_404(oportunidade_id)

        # Verifica se a oportunidade pertence à empresa atual
        if oportunidade.empresa_id != current_user.empresa.empresa_id:
            flash('Você não tem permissão para alterar o status dessa oportunidade.', 'danger')
            return redirect(url_for('perfil'))

        # Alterna o status da oportunidade
        oportunidade.status = not oportunidade.status
        db.session.commit()

        flash('Status da oportunidade atualizado com sucesso!', 'success')
        return redirect(url_for('perfil'))

    except Exception as e:
        db.session.rollback()
        flash('Erro ao atualizar o status da oportunidade.', 'danger')
        print(f"Erro: {e}")
        return redirect(url_for('perfil'))


@app.route('/como_funciona')
def como_funciona():
    return render_template('como_funciona.html')

@app.route('/home_')
@login_required  # Garante que o usuário esteja autenticado
def home_():
    usuario = current_user  # Obtém o usuário logado via Flask-Login

    if usuario.tipo == 'Pessoa':
        pessoa = usuario.pessoa  # Obtém os dados da pessoa associada ao usuário
        return render_template('home_pessoas.html', usuario=usuario, pessoa=pessoa)

    elif usuario.tipo == 'Empresa':
        empresa = Empresa.query.filter_by(usuario_id=usuario.id).first()  # Obtém os dados da empresa associada
        return render_template('home_empresas.html', usuario=usuario, empresa=empresa)

    # Caso o tipo do usuário seja inválido
    flash('Tipo de usuário inválido.', 'danger')
    return redirect(url_for('home'))  # Redireciona para a home caso tipo seja inválido

# Página inicial após login
@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/como_funciona_logado')
def como_funciona_logado():
    return render_template('como_funciona_logado.html')

@app.route('/vaga_logado/<int:oportunidade_id>')
def vaga_logado(oportunidade_id):
    oportunidade = Oportunidade.query.get_or_404(oportunidade_id)
    return render_template('vaga_logado.html', oportunidade=oportunidade)

