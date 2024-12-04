from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from validate_docbr import CNPJ, CPF 
from flask_login import UserMixin

class Usuario(db.Model, UserMixin):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    senha_hash = db.Column(db.String(500), nullable=False)
    tipo = db.Column(db.Enum('Pessoa', 'Empresa'), nullable=False, index=True)  # Campo tipo para definir 'Pessoa' ou 'Empresa'
    data_cadastro = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)

    def set_senha(self, senha):
        self.senha_hash = generate_password_hash(senha)

    def check_senha(self, senha):
        return check_password_hash(self.senha_hash, senha)

    def __repr__(self):
        return f"<Usuario {self.email}, tipo={self.tipo}>"

class Pessoa(db.Model):
    __tablename__ = 'pessoas'
    pessoa_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, unique=True, index=True)
    nome = db.Column(db.String(255), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False, index=True)
    telefone = db.Column(db.String(15), nullable=True)
    cep = db.Column(db.String(9), nullable=True)
    endereco = db.Column(db.String(255), nullable=True)
    numero = db.Column(db.String(10), nullable=True)
    complemento = db.Column(db.String(100), nullable=True)
    bairro = db.Column(db.String(100), nullable=True)
    cidade = db.Column(db.String(100), nullable=True)
    estado = db.Column(db.String(2), nullable=True)
    disponibilidade = db.Column(db.String(50), nullable=True)

    usuario = db.relationship('Usuario', backref=db.backref('pessoa', uselist=False))

    def __repr__(self):
        return f"<Pessoa {self.nome}, CPF={self.cpf}>"

    @staticmethod
    def validar_cpf(cpf):
        """Valida o CPF utilizando a biblioteca validate-docbr."""
        validador = CPF()
        return validador.validate(cpf)

class Empresa(db.Model):
    __tablename__ = 'empresas'
    empresa_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, unique=True, index=True)
    razao_social = db.Column(db.String(255), nullable=False, index=True)
    cnpj = db.Column(db.String(18), unique=True, nullable=False, index=True)
    porte = db.Column(db.String(50), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    cep = db.Column(db.String(9), nullable=True)
    endereco = db.Column(db.String(255), nullable=True)
    numero = db.Column(db.String(10), nullable=True)
    complemento = db.Column(db.String(100), nullable=True)
    bairro = db.Column(db.String(100), nullable=True)
    cidade = db.Column(db.String(100), nullable=True)
    estado = db.Column(db.String(2), nullable=True)

    usuario = db.relationship('Usuario', backref=db.backref('empresa', uselist=False))

    def __repr__(self):
        return f"<Empresa {self.razao_social}, CNPJ={self.cnpj}>"

    @staticmethod
    def validar_cnpj(cnpj):
        """Valida o CNPJ utilizando a biblioteca validate-docbr."""
        validador = CNPJ()
        return validador.validate(cnpj)

class Oportunidade(db.Model):
    __tablename__ = 'oportunidades'
    oportunidade_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    valor = db.Column(db.Float, nullable=False)
    local = db.Column(db.String(255), nullable=False)
    categoria = db.Column(db.String(100), nullable=False)
    data_inicio = db.Column(db.Date, nullable=False)
    data_fim = db.Column(db.Date, nullable=False)
    horario_inicio = db.Column(db.Time, nullable=False)
    horario_fim = db.Column(db.Time, nullable=False)
    status = db.Column(db.Boolean, default=True, nullable=False)  # Define se a vaga está visível
    data_criacao = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresas.empresa_id'), nullable=False)

    empresa = db.relationship('Empresa', backref=db.backref('oportunidades', lazy=True))

    def __repr__(self):
        return f"<Oportunidade {self.titulo}, Categoria={self.categoria}, Empresa={self.empresa.razao_social}>"

    @staticmethod
    def validar_datas(data_inicio, data_fim):
        """Valida se a data de início é anterior à data de fim."""
        return data_inicio < data_fim

    @staticmethod
    def validar_horarios(horario_inicio, horario_fim):
        """Valida se o horário de início é anterior ao horário de fim."""
        return horario_inicio < horario_fim

class Inscricao(db.Model):
    __tablename__ = 'inscricoes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    oportunidade_id = db.Column(db.Integer, db.ForeignKey('oportunidades.oportunidade_id'), nullable=False)
    data_inscricao = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)

    usuario = db.relationship('Usuario', backref=db.backref('inscricoes', lazy=True))
    oportunidade = db.relationship('Oportunidade', backref=db.backref('inscricoes', lazy=True))

    def __repr__(self):
        # Exibe o nome do usuário e o título da oportunidade
        return f"<Inscricao usuario={self.usuario.pessoa.nome if self.usuario.tipo == 'Pessoa' else self.usuario.empresa.razao_social}, oportunidade={self.oportunidade.titulo}>"