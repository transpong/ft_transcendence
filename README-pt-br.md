# TransPong (ft_transcendence)

To access a English version of this readme, click [here](
https://github.com/transpong/ft_transcendence/blob/master/README.md)

## Descrição

Este projeto consiste em criar um website para o jogo Pong.
O website permitirá que os usuários joguem Pong com outras pessoas em tempo real, além de fornecer uma interface de usuário e um recurso de bate-papo.

## Tecnologias

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



## Dependências

### Cliente (React)

As dependências do cliente estão listadas no arquivo [package.json](https://github.com/transpong/Transpong/blob/master/client/package.json).

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

The server dependencies are listed in the [package.json](https://github.com/transpong/Transpong/blob/master/server/package.json) file.

Here is the formatted table with the provided data:

| Package                     | Description                                                      |
|-----------------------------|------------------------------------------------------------------|
| @nestjs/class-transformer   | Library for class transformation                                 |
| @nestjs/class-validator     | Library for class validation                                     |
| @nestjs/common              | Main module of the NestJS framework                              |
| @nestjs/config              | Configuration library for NestJS                                 |
| @nestjs/core                | Core module of the NestJS framework                              |
| @nestjs/jwt                 | JWT authentication library for NestJS                            |
| @nestjs/passport            | Authentication library for NestJS                                |
| @nestjs/platform-express    | Express-based HTTP adapter for NestJS                            |
| @nestjs/platform-socket.io  | Socket.io adapter for NestJS                                    |
| @nestjs/typeorm             | TypeORM integration for NestJS                                   |
| @nestjs/websockets          | Library for real-time communication                              |
| 2fa-util                    | Utility for two-factor authentication                           |
| bcrypt                      | Library for password hashing                                    |
| better-sqlite3              | SQLite wrapper with performance improvements                     |
| class-transformer           | Library for class transformation                                 |
| class-validator             | Library for class validation                                     |
| http-proxy-middleware       | HTTP proxy middleware                                            |
| passport-42                 | Authentication strategy for login using 42's intra              |
| passport-jwt                | JWT authentication strategy for Passport                         |
| pg                          | PostgreSQL driver for Node.js                                    |
| reflect-metadata            | Library for reflected metadata                                   |
| rxjs                        | Library for reactive programming                                |
| typeorm                     | ORM for relational databases                                     |




#### Authors

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
