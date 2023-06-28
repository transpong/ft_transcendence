# TransPong (ft_transcendence)

To access a English version of this readme, click [here](
https://github.com/transpong/ft_transcendence/blob/master/README.md)

## Descrição

Este projeto consiste em criar um website para o jogo Pong.
O website permitirá que os usuários joguem Pong com outras pessoas em tempo real, além de fornecer uma interface de
usuário e um recurso de bate-papo.

## 🛠️ Tecnologias

* [Typescript](https://www.typescriptlang.org/) - Linguagem de programação
* [Node.js](https://nodejs.org/en/) - Ambiente de execução Javascript
* [React](https://pt-br.reactjs.org/) - Biblioteca Javascript
* [NestJS](https://nestjs.com/) - Framework Javascript
* [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
* [Docker](https://www.docker.com/) - Plataforma de virtualização

## Requisitos de sistema

* Docker
* Docker-compose

## Instalação

Para executar o projeto, você deve ter o Docker instalado em sua máquina e executar o seguinte comando:

```bash
docker-compose up --build
```

## Banco de dados

O banco de dados é criado automaticamente ao executar o comando `docker-compose up --build`.
Uma representação dos relacionamentos entre as tabelas pode ser vista abaixo:

![postgres - public](https://github.com/transpong/ft_transcendence/assets/47704550/28bc4256-cdf5-42d6-a429-639c33511598)

## Detalhes de Implementação

## Servidor

O servidor é uma API REST que utiliza autenticação JWT para proteger as rotas. O servidor é implementado utilizando o
framework NestJS e utiliza o banco de dados PostgreSQL para armazenar os dados. Este servidor também utiliza a
biblioteca Socket.io para implementar a comunicação em tempo real entre o cliente e o servidor, sendo essa comunicação
utilizada para implementar o jogo de pong e o chat.

### Endpoints

### Auth

As rotas de callback são utilizadas para autenticar usuários utilizando a API 42 e autenticação de convidado. Essas
rotas são utilizadas pelo cliente para autenticar usuários e não são protegidas pela autenticação JWT.

A rota de logout é utilizada para invalidar a sessão do usuário e é protegida pela autenticação JWT.

| Método | Endpoint          | Descrição                               |
|--------|-------------------|-----------------------------------------|
| GET    | /auth/42/callback | Callback para autenticação do 42        |
| GET    | /auth/guest       | Callback para autenticação de convidado |
| PATCH  | /auth/logout      | Invalidar a sessão do usuário           |

### Avatar

Esta rota é utilizada para obter a imagem de avatar do usuário e não é protegida pela autenticação JWT.

| Método | Endpoint          | Descrição                         |
|--------|-------------------|-----------------------------------|
| GET    | /avatar/img/:name | Obter imagem de avatar do usuário |

### Chat

As rotas do chat são utilizadas para criar canais de chat, enviar mensagens e gerenciar usuários nos canais de chat (
todas as rotas são protegidas pela autenticação JWT).

| Método | Endpoint                                               | Descrição                                        |
|--------|--------------------------------------------------------|--------------------------------------------------|
| POST   | /chat                                                  | Criar um novo canal de chat                      |
| GET    | /chat                                                  | Obter todos os canais de chat                    |
| PUT    | /chat/channel/:channelId/user/:nickname                | Adicionar usuário ao canal de chat               |
| POST   | /chat/channel/:channelId/messages                      | Enviar mensagem para o canal de chat             |
| POST   | /chat/channel/direct/:nickname/messages                | Enviar mensagem para o canal de chat direto      |
| PATCH  | /chat/channels/:channelId/type                         | Alterar tipo do canal de chat                    |
| PUT    | /chat/channels/:channelId/password                     | Alterar senha do canal de chat                   |
| POST   | /chat/channels/:channelId/login                        | Entrar no canal de chat                          |
| GET    | /chat/channels/:channelId/users'                       | Obter todos os usuários no canal de chat         |
| DELETE | /chat/channels/:channelId/users/:nickname              | Remover usuário do canal de chat                 |
| PATCH  | /chat/channels/:channelId/users/:nickname/type         | Alterar tipo de acesso do usuário no canal       |
| PATCH  | /chat/channels/:channelId/users/:nickname/restrictions | Alterar restrições do usuário no canal de chat   |
| GET    | /chat/channels/:channelId/messages                     | Obter todas as mensagens no canal de chat        |
| GET    | /chat/channels/direct/:nickname/messages               | Obter todas as mensagens no canal de chat direto |
| DELETE | /chat/channels/:channelId/leave                        | Sair do canal de chat                            |

### Jogo

As rotas de jogo são utilizadas para obter dados de partida e classificação (todas as rotas são protegidas por
autenticação JWT).

| Método | Endpoint                | Descrição                                         |
|--------|-------------------------|---------------------------------------------------|
| GET    | /game/matches-history   | Obter todo o histórico de partidas do usuário     |
| GET    | /game/ranking           | Obter dados de classificação de todos os usuários |
| GET    | /game/ranking/:nickname | Obter dados de classificação do usuário           |

### Usuário

As rotas de usuário são utilizadas para obter dados do usuário (todas as rotas são protegidas por autenticação JWT).

| Método | Endpoint                         | Descrição                                                                                                                           |
|--------|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| GET    | /user/me                         | Obter informações do usuário autenticado.                                                                                           |
| POST   | /user/me/mfa                     | Gerar um segredo de autenticação multifator (MFA) para o usuário autenticado.                                                       |
| POST   | /user/me/mfa/validate            | Validar o segredo de MFA com um código fornecido para o usuário autenticado.                                                        |
| PATCH  | /user/me/mfa/invalidate          | Invalidar o segredo de MFA para o usuário autenticado.                                                                              |
| PATCH  | /user/me/nickname                | Atualizar o apelido do usuário autenticado.                                                                                         |
| PATCH  | /user/me/avatar                  | Atualizar o avatar (foto de perfil) do usuário autenticado.                                                                         |
| POST   | /user/profiles/:nickname/friends | Adicionar um amigo ao perfil do usuário. O parâmetro `:nickname` representa o apelido do amigo a ser adicionado.                    |
| DELETE | /user/profiles/:nickname/friends | Remover um amigo do perfil do usuário. O parâmetro `:nickname` representa o apelido do amigo a ser removido.                        |
| POST   | /user/profiles/:nickname/block   | Bloquear um usuário. O parâmetro `:nickname` representa o apelido do usuário a ser bloqueado.                                       |
| DELETE | /user/profiles/:nickname/block   | Desbloquear um usuário. O parâmetro `:nickname` representa o apelido do usuário a ser desbloqueado.                                 |
| GET    | /user/profiles/:nickname         | Obter informações do perfil de um usuário. O parâmetro `:nickname` representa o apelido do usuário cujo perfil está sendo acessado. |

## Eventos do Socket

A URL do tipo ws (
essa URL é a mesma que a URL do servidor, mas com o protocolo ws em vez do protocolo http
) é utilizada para criar uma conexão de socket com o servidor e é protegida por autenticação JWT (o token é enviado no
cabeçalho da requisição).
O namespace padrão é utilizado para enviar e receber mensagens do servidor e criar partidas entre usuários e
espectadores.

| Nome do Evento | Descrição                                                 |
|----------------|-----------------------------------------------------------|
| joinRoom       | Entrar em uma sala de espera do jogo                      |
| startGame      | Iniciar uma partida após a sala estar cheia (2 jogadores) |
| moveUp         | Mover a raquete do jogador para cima                      |
| moveDown       | Mover a raquete do jogador para baixo                     |
| endGame        | Desistir da partida atual ou sair da sala de espera       |
| enterSpectator | Entrar em um jogo como espectador utilizando o ID da sala |
| spectatorOut   | Sair do jogo como espectador                              |
| invite         | Convidar um amigo para jogar uma partida                  |
| acceptInvite   | Aceitar um convite para jogar uma partida                 |
| declineInvite  | Recusar um convite para jogar uma partida                 |

## Dependências

### Cliente (React)

As dependências do cliente estão listadas no
arquivo [package.json](https://github.com/transpong/Transpong/blob/master/client/package.json).

| Pacote                  | Descrição                                                      |
|-------------------------|----------------------------------------------------------------|
| @chakra-ui/icons        | Conjunto de ícones para uso com o framework Chakra UI          |
| @chakra-ui/react        | Componentes de interface do usuário para o framework Chakra UI |
| @emotion/react          | Biblioteca para estilização com CSS-in-JS usando Emotion       |
| @emotion/styled         | Biblioteca para estilização com CSS-in-JS usando Emotion       |
| @vitejs/plugin-react    | Plugin do Vite para suporte a projetos React                   |
| @types/socket.io-client | Tipos de dados para o cliente Socket.io                        |
| axios                   | Cliente HTTP para fazer requisições                            |
| framer-motion           | Biblioteca para animações e transições de componentes React    |
| pino                    | Biblioteca de logging                                          |
| react                   | Biblioteca JavaScript para construção de interfaces de usuário |
| react-dom               | Renderizador do React para o navegador                         |
| react-icons             | Conjunto de ícones populares para uso com o React              |
| react-p5                | Integração do p5.js com o React para criação de gráficos       |
| react-router-dom        | Biblioteca de roteamento para aplicações React                 |
| socket.io-client        | Biblioteca para comunicação em tempo real com Socket.io        |
| vite                    | Bundler rápido para desenvolvimento de aplicações web          |

### Server (NestJS)

As dependências do servidor estão listadas no
arquivo [package.json](https://github.com/transpong/Transpong/blob/master/server/package.json).

| Pacote                     | Versão  | Descrição                                                            |
|----------------------------|---------|----------------------------------------------------------------------|
| @nestjs/class-transformer  | ^0.4.0  | Biblioteca de transformação de classes para o NestJS                 |
| @nestjs/class-validator    | ^0.13.1 | Biblioteca de validação de classes para o NestJS                     |
| @nestjs/common             | ^9.0.0  | Módulo principal do framework NestJS                                 |
| @nestjs/config             | ^2.3.1  | Biblioteca de configuração para o NestJS                             |
| @nestjs/core               | ^9.0.0  | Módulo principal do framework NestJS                                 |
| @nestjs/jwt                | ^10.0.3 | Biblioteca de autenticação JWT para o NestJS                         |
| @nestjs/passport           | ^9.0.3  | Biblioteca de autenticação para o NestJS                             |
| @nestjs/platform-express   | ^9.0.0  | Adaptador HTTP baseado em Express para o NestJS                      |
| @nestjs/platform-socket.io | ^9.4.0  | Adaptador Socket.io para o NestJS                                    |
| @nestjs/typeorm            | ^9.0.1  | Integração do TypeORM para o NestJS                                  |
| @nestjs/websockets         | ^9.4.0  | Adaptador WebSockets para o NestJS                                   |
| 2fa-util                   | ^1.1.1  | Biblioteca de utilitários para autenticação de dois fatores          |
| bcrypt                     | ^5.1.0  | Biblioteca para gerar hashes de senhas                               |
| class-transformer          | ^0.5.1  | Biblioteca de transformação de classes                               |
| class-validator            | ^0.14.0 | Biblioteca de validação de classes                                   |
| http-proxy-middleware      | ^2.0.6  | Middleware para redirecionamento de requisições HTTP                 |
| passport-42                | ^1.2.6  | Estratégia do Passport para autenticação com o OAuth do 42           |
| passport-jwt               | ^4.0.1  | Estratégia do Passport para autenticação com JSON Web Token (JWT)    |
| pg                         | ^8.10.0 | Driver de banco de dados PostgreSQL para o Node.js                   |
| reflect-metadata           | ^0.1.13 | Biblioteca para adicionar reflexão de metadados a objetos JavaScript |
| rxjs                       | ^7.2.0  | Biblioteca de programação reativa para JavaScript                    |
| typeorm                    | ^0.3.15 | Biblioteca de Mapeamento Objeto-Relacional (ORM) para TypeScript     |

#### Autores

<p align="center">
<table>
  <tr>
    <td>
      <a href="https://github.com/andersonhsporto">
        <img src="https://avatars.githubusercontent.com/u/47704550?v=4" width="140px" alt="Anderson Porto avatar"/><br>
        <sub><b>Anderson Porto</b></sub>
      </a>
    </td>
    <td>
      <a href="https://github.com/DaviPrograme">
        <img src="https://avatars.githubusercontent.com/u/56012877?v=4" width="140px" alt="Davi Moreira avatar"/><br>
        <sub><b>Davi Moreira</b></sub>
      </a>
    </td>
    <td>
      <a href="https://github.com/GitFlaviobc">
        <img src="https://avatars.githubusercontent.com/u/46327033?v=4" width="140px" alt="Flavio Bonini Campos  avatar"/><br>
        <sub><b>Flavio Bonini Campos</b></sub>
      </a>
    </td>
    <td>
      <a href="https://github.com/Luryy">
        <img src="https://avatars.githubusercontent.com/u/59494158?v=4" width="140px" alt="Flavio Bonini Campos  avatar"/><br>
        <sub><b>Lucas Yuri</b></sub>
      </a>
    </td>
  </tr>
</table>
