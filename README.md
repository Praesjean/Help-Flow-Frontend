# Help Flow | Microfrontend

Interface web do **Help Flow**, um sistema de gerenciamento de chamados desenvolvido como parte do Projeto PJBL de Arquitetura e Soluções Cloud, do curso de Engenharia de Software da PUCPR.

O microfrontend foi desenvolvido utilizando **React e Vite** e integra uma arquitetura distribuída com Backend for Frontend (BFF), AWS API Gateway, microserviços, bancos de dados independentes, Azure Functions e comunicação orientada a eventos.

A aplicação permite autenticar usuários, gerenciar chamados e usuários e visualizar informações consolidadas por meio de um dashboard.

### Integrantes

- Erick Misturi Machado
- Jean Inácio Praes Moura
- João Gabriel de Lima Coltre
- Stefany Carlos de Oliveira

O microfrontend representa a camada de apresentação do Help Flow, permitindo que os usuários interajam com os serviços distribuídos por meio de uma interface web.

## 1. Tecnologias utilizadas

- React
- Vite
- JavaScript
- React Router
- Axios
- Lucide React
- CSS
- Node.js 22
- Docker
- Nginx
- Docker Hub
- Azure Container Apps
- AWS API Gateway
- Git e GitHub

## 2. Funcionalidades

### Autenticação

- Login com e-mail e senha.
- Autenticação utilizando JWT.
- Proteção de rotas privadas.
- Controle de acesso conforme o perfil do usuário.
- Encerramento de sessão.
- Envio automático do token JWT nas requisições protegidas.

### Dashboard

- Visão geral dos chamados cadastrados.
- Indicadores de status e prioridade.
- Informações consolidadas de usuários e chamados.
- Consumo do endpoint `GET /aggregated-data`.
- Integração com informações provenientes da Azure Function por meio do BFF.

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

## 3. Arquitetura da solução

O microfrontend integra a arquitetura distribuída do Help Flow.

### Componentes

| Componente | Tecnologia | Responsabilidade |
|---|---|---|
| Microfrontend | React + Vite | Interface do usuário |
| Servidor web | Nginx | Hospedagem dos arquivos estáticos e proxy reverso |
| API Gateway | AWS API Gateway | Entrada e roteamento de requisições |
| BFF | Node.js + Express | Intermediação e agregação de dados |
| Microserviço de Chamados | Node.js + Express | Gerenciamento de chamados |
| Microserviço de Usuários | Node.js + Express | Gerenciamento de usuários e autenticação |
| Banco de Chamados | MongoDB Atlas | Persistência de chamados |
| Banco de Usuários | Azure SQL Database | Persistência de usuários |
| Azure Function | HTTP Trigger | Processamento serverless |
| Azure Service Bus | Fila de mensagens | Comunicação assíncrona |
| Consumer | Node.js | Consumo de eventos |

### Fluxo principal

```text
Usuário
   |
   v
Microfrontend (React + Vite)
   |
   v
Nginx (Proxy Reverso)
   |
   v
AWS API Gateway
   |
   v
BFF (Node.js + Express)
   |
   +----> Microserviço de Chamados
   |             |
   |             v
   |        MongoDB Atlas
   |
   +----> Microserviço de Usuários
   |             |
   |             v
   |       Azure SQL Database
   |
   +----> Azure Function
                |
                v
        Processamento de métricas
```

O frontend não acessa diretamente os microserviços.

As requisições são encaminhadas ao BFF por meio do Nginx e do AWS API Gateway.

O BFF é responsável por encaminhar operações, integrar serviços e consolidar informações.

## 4. Integração com o BFF

O frontend utiliza o Backend for Frontend como intermediário para acessar as funcionalidades do sistema.

### Endpoints consumidos

| Endpoint | Finalidade |
|---|---|
| `POST /api/auth/login` | Autenticação |
| `POST /api/auth/register` | Cadastro de usuário |
| `GET /api/chamados` | Listagem de chamados |
| `POST /api/chamados` | Criação de chamado |
| `GET /api/chamados/:id` | Consulta de chamado |
| `PUT /api/chamados/:id` | Atualização de chamado |
| `DELETE /api/chamados/:id` | Exclusão de chamado |
| `GET /api/usuarios` | Listagem de usuários |
| `POST /api/usuarios` | Criação de usuário |
| `GET /api/usuarios/:id` | Consulta de usuário |
| `PUT /api/usuarios/:id` | Atualização de usuário |
| `DELETE /api/usuarios/:id` | Exclusão de usuário |
| `GET /aggregated-data` | Informações consolidadas |

As operações disponíveis dependem do perfil autenticado.

## 5. Dashboard e agregação de dados

O dashboard utiliza o endpoint:

`GET /aggregated-data`

Esse endpoint é disponibilizado pelo BFF e consolida informações de três fontes:

1. Microserviço de Chamados, utilizando MongoDB Atlas.
2. Microserviço de Usuários, utilizando Azure SQL Database.
3. Azure Function HTTP Trigger.

### Fluxo de agregação

```text
Dashboard React
      |
      v
GET /aggregated-data
      |
      v
AWS API Gateway
      |
      v
BFF
      |
      +----> Microserviço de Chamados
      |
      +----> Microserviço de Usuários
      |
      +----> Azure Function
      |
      v
Resposta JSON consolidada
      |
      v
Dashboard
```

O frontend recebe os dados consolidados e os apresenta na interface.

## 6. Autenticação e segurança

O frontend utiliza autenticação JWT.

Após o login, o token recebido é utilizado nas requisições que exigem autenticação.

### Recursos de segurança

- Proteção de rotas privadas.
- Controle de acesso conforme o perfil.
- Interceptador Axios para envio do token.
- Encerramento de sessão.
- Separação entre frontend e serviços de backend.

### Perfis utilizados

- `ADMIN`
- `ATENDENTE`
- `CLIENTE`

As permissões são verificadas pelos serviços de backend.

O controle de visibilidade de funcionalidades no frontend não substitui a autorização dos endpoints.

## 7. Pré-requisitos

Para executar o projeto localmente:

- Node.js 22 ou versão compatível.
- npm.
- BFF Help Flow disponível.
- Microserviços necessários disponíveis.

Para execução em contêiner, é necessário ter Docker instalado.

## 8. Configuração do ambiente

Na raiz do projeto, crie um arquivo `.env` baseado no `.env.example`, conforme a configuração utilizada pelo projeto.

### Exemplo de configuração local

```env
VITE_API_URL=http://localhost:3000
```

A variável `VITE_API_URL` define o endereço-base utilizado pelo frontend para acessar a API.

Em uma configuração com proxy reverso, também é possível utilizar um endereço relativo, desde que as rotas estejam configuradas corretamente no Nginx.

**Não publique arquivos `.env` contendo informações sensíveis no GitHub.**

## 9. Execução local

### Instalar dependências

```bash
npm install
```

### Iniciar servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível, por padrão, em:

http://localhost:5173

O BFF deve estar acessível no endereço configurado.

### Windows PowerShell

Caso a política de execução bloqueie os comandos do npm:

```powershell
npm.cmd install
npm.cmd run dev
```

## 10. Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos estáticos são gerados no diretório:

`dist/`

Esses arquivos são disponibilizados pelo Nginx na imagem Docker de produção.

## 11. Docker

O projeto utiliza uma imagem Docker multi-stage.

### Etapa de build

Utiliza Node.js 22 Alpine para:

- Instalar as dependências.
- Executar o build do Vite.
- Gerar os arquivos estáticos da aplicação.

### Etapa de execução

Utiliza Nginx Alpine para:

- Disponibilizar os arquivos estáticos.
- Encaminhar requisições ao backend.
- Suportar o roteamento do React Router.

### Construir a imagem

```bash
docker build --build-arg VITE_API_URL= -t jeanpraes/help-flow-microfrontend:v2 .
```

### Executar o contêiner

```bash
docker run -d --name help-flow-microfrontend -p 8080:80 jeanpraes/help-flow-microfrontend:v2
```

Acesse:

http://localhost:8080

O funcionamento das chamadas de API depende da configuração do Nginx e da disponibilidade do destino configurado.

## 12. Configuração do Nginx

O Nginx é utilizado como servidor web e proxy reverso.

### Responsabilidades

- Servir os arquivos estáticos gerados pelo Vite.
- Suportar as rotas do React Router.
- Encaminhar requisições `/api/`.
- Encaminhar requisições `/aggregated-data`.
- Integrar o frontend com a entrada pública da arquitetura.

### Ambiente local

O projeto pode utilizar `host.docker.internal:3000` para acessar um BFF executado no computador durante testes com Docker Desktop.

### Ambiente cloud

Na implantação do Help Flow, o Nginx foi configurado para encaminhar as requisições ao AWS API Gateway.

**AWS API Gateway:**

https://op5937r48e.execute-api.us-east-2.amazonaws.com

O gateway encaminha as requisições ao BFF publicado no Azure Container Apps.

Essa configuração permite que o frontend utilize caminhos relativos de API, sem precisar acessar diretamente os microserviços.

## 13. Docker Hub

A imagem Docker do microfrontend está publicada no Docker Hub.

**Repositório público:**

https://hub.docker.com/r/jeanpraes/help-flow-microfrontend

### Versões publicadas

| Tag | Descrição |
|---|---|
| `v1` | Versão inicial |
| `v2` | Versão mais recente publicada |

**Arquitetura da imagem:** `linux/amd64`

### Baixar a imagem mais recente

```bash
docker pull jeanpraes/help-flow-microfrontend:v2
```

### Executar a imagem

```bash
docker run -d --name help-flow-microfrontend -p 8080:80 jeanpraes/help-flow-microfrontend:v2
```

A imagem `v2` foi publicada no Docker Hub e é utilizada como referência para a documentação atual.

## 14. Implantação na Azure

O microfrontend está implantado no **Azure Container Apps**, utilizando Docker e Nginx.

### Microfrontend público

https://helpflow-microfrontend.victoriousground-a72b89ca.centralus.azurecontainerapps.io

### Funcionamento

1. O usuário acessa o endereço público do microfrontend.
2. O Nginx disponibiliza a interface React.
3. As requisições de API são encaminhadas ao AWS API Gateway.
4. O gateway encaminha as chamadas ao BFF.
5. O BFF consulta os microserviços e a Azure Function.
6. O resultado é retornado à interface.

### Serviços integrados

**BFF público:**

https://helpflow-bff.victoriousground-a72b89ca.centralus.azurecontainerapps.io

**Swagger do BFF:**

https://helpflow-bff.victoriousground-a72b89ca.centralus.azurecontainerapps.io/api-docs/

**Microserviço de Chamados:**

https://helpflow-chamados.victoriousground-a72b89ca.centralus.azurecontainerapps.io

**Swagger de Chamados:**

https://helpflow-chamados.victoriousground-a72b89ca.centralus.azurecontainerapps.io/api-docs/

**Microserviço de Usuários:**

https://helpflow-usuarios.victoriousground-a72b89ca.centralus.azurecontainerapps.io

**Swagger de Usuários:**

https://helpflow-usuarios.victoriousground-a72b89ca.centralus.azurecontainerapps.io/api-docs/

**AWS API Gateway:**

https://op5937r48e.execute-api.us-east-2.amazonaws.com

## 15. Event-Driven Architecture

O Help Flow implementa comunicação assíncrona utilizando Azure Service Bus.

O microfrontend não publica mensagens diretamente na fila.

As operações de criação, atualização e exclusão de chamados são enviadas ao BFF, que encaminha as requisições ao microserviço de Chamados.

O microserviço publica eventos no Azure Service Bus.

### Eventos implementados

- `ChamadoCriado`
- `ChamadoAtualizado`
- `ChamadoExcluido`

### Fluxo

```text
Microfrontend React
       |
       v
AWS API Gateway
       |
       v
BFF
       |
       v
Microserviço de Chamados
       |
       +----> MongoDB Atlas
       |
       v
Azure Service Bus
       |
       v
Consumer no Azure Container Apps
       |
       v
Processamento dos eventos
```

### Infraestrutura

| Recurso | Identificação |
|---|---|
| Namespace | `helpflow-servicebus` |
| Fila | `chamados-eventos` |
| Produtor | `helpflow-chamados` |
| Consumidor | `helpflow-eventos-consumer` |

Os eventos foram testados na Azure em 09/11/2026, com confirmação de recebimento pelos logs do consumidor.

## 16. Repositórios relacionados

O Help Flow utiliza repositórios independentes, integrados ao repositório principal por meio de submódulos Git.

### Repositório principal

https://github.com/Praesjean/Help-Flow.git

### Componentes

- Help-Flow-Microfrontend
- Help-Flow-BFF
- Help-Flow-Chamados
- Help-Flow-Usuarios
- Help-Flow-AzureFunction

Os endereços específicos dos sub-repositórios podem ser consultados no arquivo `.gitmodules` do repositório principal.

## 17. Contexto acadêmico

Projeto desenvolvido para a disciplina de **Arquitetura e Soluções Cloud**, do curso de Engenharia de Software da **Pontifícia Universidade Católica do Paraná (PUCPR)**.

O projeto demonstra a implementação de uma aplicação distribuída utilizando:

- Microfrontend.
- Backend for Frontend.
- Microservices.
- Database per Service.
- API Gateway.
- Clean Architecture.
- Vertical Slice Architecture.
- Serverless.
- Event-Driven Architecture.
- Docker e implantação em nuvem.