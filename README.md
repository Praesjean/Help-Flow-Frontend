# Help Flow | Microfrontend

Interface web do **Help Flow**, um sistema de gerenciamento de chamados desenvolvido como parte do Projeto PJBL de Arquitetura de Soluções Cloud.

O microfrontend foi desenvolvido com React e Vite e se comunica com os serviços do sistema exclusivamente por meio do Backend for Frontend (BFF).

## 1. Tecnologias utilizadas

- React
- Vite
- JavaScript
- React Router
- Axios
- Lucide React
- CSS
- Docker
- Nginx

## 2. Funcionalidades

### Autenticação
- Login com e-mail e senha.
- Autenticação utilizando JWT.
- Proteção de rotas privadas.
- Controle de acesso conforme o perfil do usuário.
- Encerramento de sessão.

### Dashboard
- Visão geral dos chamados cadastrados.
- Indicadores de status e prioridade.
- Informações consolidadas de usuários e chamados.
- Consumo do endpoint `GET /aggregated-data` disponibilizado pelo BFF.

### Gerenciamento de Chamados
- Listagem de chamados.
- Cadastro de novos chamados.
- Edição de chamados existentes.
- Exclusão de chamados.
- Pesquisa e filtros.
- Exibição de status e prioridade.
- Restrições de acesso conforme o perfil autenticado.

### Gerenciamento de Usuários
- Listagem de usuários.
- Cadastro de novos usuários.
- Edição de informações cadastrais.
- Exclusão de usuários.
- Pesquisa de usuários.
- Controle de perfis e status.
- Restrições de operações administrativas.

## 3. Arquitetura

O microfrontend integra a arquitetura distribuída do Help Flow.

```text
Usuário
   |
   v
Microfrontend (React + Vite)
   |
   v
API Gateway (previsto na arquitetura)
   |
   v
BFF (Node.js + Express)
   |
   +--> Microservice Chamados
   |       |
   |       +--> MongoDB Atlas
   |
   +--> Microservice Usuários
   |       |
   |       +--> Azure SQL Database
   |
   +--> Azure Function (HTTP Trigger)
```

O frontend não realiza chamadas diretas aos microserviços. A comunicação ocorre por meio do BFF, responsável por encaminhar requisições, integrar serviços e consolidar informações.

A arquitetura também prevê a utilização de Azure Functions, API Gateway e comunicação orientada a eventos.

## 4. Pré-requisitos

Para executar o projeto localmente:

- Node.js 22 ou compatível.
- npm.
- BFF Help Flow em execução.
- Microserviços necessários em execução.

Para executar utilizando containers, é necessário ter Docker instalado.

## 5. Configuração do ambiente

Na raiz do projeto, crie um arquivo `.env` baseado no `.env.example`.

Exemplo:

```env
VITE_API_URL=http://localhost:3000
```

A variável `VITE_API_URL` define o endereço do BFF utilizado pelo frontend.

O arquivo `.env` não deve ser enviado ao GitHub.

## 6. Executar localmente

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

No Windows PowerShell, caso a política de execução bloqueie o npm, utilize:

```powershell
npm.cmd install
npm.cmd run dev
```

A aplicação estará disponível, por padrão, em:

http://localhost:5173

O BFF deve estar acessível no endereço configurado em `VITE_API_URL`.

## 7. Build de produção

Para compilar o projeto:

```bash
npm run build
```

Os arquivos estáticos serão gerados no diretório `dist`.

## 8. Docker

O projeto utiliza uma imagem Docker multi-stage:

1. Node.js 22 Alpine para instalar dependências e compilar a aplicação.
2. Nginx Alpine para disponibilizar os arquivos estáticos.

### Construir a imagem

```bash
docker build --build-arg VITE_API_URL= -t jeanpraes/help-flow-microfrontend:v1 .
```

### Executar o container

```bash
docker run -d --name help-flow-microfrontend -p 8080:80 jeanpraes/help-flow-microfrontend:v1
```

Acesse:

http://localhost:8080

### Configuração do Nginx

O arquivo `nginx.conf` possui:

- Suporte às rotas do React Router.
- Encaminhamento de `/api/` para o BFF.
- Encaminhamento de `/aggregated-data` para o BFF.
- Disponibilização dos arquivos estáticos compilados.

A configuração atual utiliza `host.docker.internal:3000`, adequada para testes locais com Docker Desktop e o BFF executando no computador.

**Para implantação em nuvem, será necessário configurar o endereço de rede do BFF ou do API Gateway**, conforme o ambiente de hospedagem.

## 9. Docker Hub

Imagem publicada:

https://hub.docker.com/r/jeanpraes/help-flow-microfrontend

Para baixar a imagem:

```bash
docker pull jeanpraes/help-flow-microfrontend:v1
```

## 10. Segurança

O frontend utiliza:

- JWT para autenticação das requisições.
- Rotas protegidas para usuários autenticados.
- Controle de visibilidade de funcionalidades por perfil.
- Interceptador Axios para envio do token.
- Separação entre interface e serviços de backend.

As permissões devem ser verificadas também pelo backend. O controle de acesso no frontend não substitui a autorização dos endpoints.

## 11. Repositórios relacionados

O Help Flow é organizado em repositórios independentes, integrados ao repositório principal por meio de submódulos Git.

Componentes:

- Microfrontend React.
- BFF Node.js.
- Microservice Chamados.
- Microservice Usuários.
- Azure Function.

Repositório principal:

https://github.com/Praesjean/Help-Flow

## 12. Projeto acadêmico

Projeto desenvolvido para a disciplina de Arquitetura de Soluções Cloud, no curso de Engenharia de Software da Pontifícia Universidade Católica do Paraná (PUCPR).

O objetivo é demonstrar a implementação de uma aplicação distribuída utilizando padrões arquiteturais como Microservices, Backend for Frontend, Database per Service, Clean Architecture, Vertical Slice e Serverless.