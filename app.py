from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_wtf import CSRFProtect
from flask_login import LoginManager

# Inicializando o app
app = Flask(__name__)
app.config.from_object(Config)

# Inicializando o CSRF
csrf = CSRFProtect(app)

# Inicializando o banco de dados e migrações
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Inicializando o LoginManager
login_manager = LoginManager()
login_manager.init_app(app)

# Definindo a rota de login
login_manager.login_view = "login"  # Especifica qual é a rota de login

# Importando os modelos e rotas
from models import *
from routes import *

# Função para carregar o usuário
@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))  # Carregando o usuário pelo ID

if __name__ == '__main__':
    app.run(debug=True)
