# TransPong (ft_transcendence)

Para acessar uma versão em português desse readme, clique [aqui](
https://github.com/transpong/ft_transcendence/blob/master/README-pt-br.md)

## Description

This project aims to create a website for the game Pong. The website will allow users to play Pong with others in real-time, providing a user interface and a chat feature.

## Technologies

* [Typescript](https://www.typescriptlang.org/) - Programming language
* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
* [React](https://reactjs.org/) - JavaScript library
* [NestJS](https://nestjs.com/) - JavaScript framework
* [PostgreSQL](https://www.postgresql.org/) - Relational database
* [Docker](https://www.docker.com/) - Virtualization platform

## System Requirements

* Docker
* Docker-compose

## Installation

To run the project, you must have Docker installed on your machine and execute the following command:

```bash
docker-compose up --build
```

## Database

The database is automatically created when running the `docker-compose up --build` command.
A representation of the table relationships can be seen below:

![postgres - public](https://github.com/transpong/ft_transcendence/assets/47704550/28bc4256-cdf5-42d6-a429-639c33511598)

## Dependencies

### Client (React)

The client dependencies are listed in the [package.json](https://github.com/transpong/Transpong/blob/master/client/package.json) file.

| Package                 | Description                                                 |
|-------------------------|-------------------------------------------------------------|
| @chakra-ui/icons        | Icon set for use with the Chakra UI framework               |
| @chakra-ui/react        | User interface components for the Chakra UI framework       |
| @emotion/react          | CSS-in-JS styling library using Emotion                     |
| @emotion/styled         | CSS-in-JS styling library using Emotion                     |
| @vitejs/plugin-react    | Vite plugin for React projects                              |
| @types/socket.io-client | Socket.io client data types                                 |
| axios                   | HTTP client for making requests                             |
| framer-motion           | Library for animations and transitions for React components |
| pino                    | Logging library                                             |
| react                   | JavaScript library for building user interfaces             |
| react-dom               | React renderer for the browser                              |
| react-icons             | Popular icon set for use with React                         |
| react-p5                | p5.js integration with React for creating graphics          |
| react-router-dom        | Routing library for React applications                      |
| socket.io-client        | Library for real-time communication with Socket.io          |
| vite                    | Fast development build tool for web applications            |

### Server (NestJS)

The server dependencies are listed in the [package.json](https://github.com/transpong/Transpong/blob/master/server/package.json) file.

Here is the formatted table with the provided data:

| Package                    | Description                                                  |
|----------------------------|--------------------------------------------------------------|
| @nestjs/class-transformer  | Class transformation library                                 |
| @nestjs/class-validator    | Class validation library                                     |
| @nestjs/common             | Main module of the NestJS framework                          |
| @nestjs/config             | Configuration library for NestJS                             |
| @nestjs/core               | Core module of the NestJS framework                          |
| @nestjs/jwt                | JWT authentication library for NestJS                        |
| @nestjs/passport           | Authentication library for NestJS                            |
| @nestjs/platform-express   | Express-based HTTP adapter for NestJS                        |
| @nestjs/platform-socket.io | Socket.io adapter for NestJS                                 |
| @nestjs/typeorm            | TypeORM integration for NestJS                               |
| @nestjs/websockets         |


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
