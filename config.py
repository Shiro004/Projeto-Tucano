import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'sua_chave_secreta_aqui'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:SENHA@localhost/NOME_BANCO'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
