# TransPong (ft_transcendence)

Para acessar uma versão em português desse readme, clique [aqui](
https://github.com/transpong/ft_transcendence/blob/master/README-pt-br.md)

## Description

This project aims to create a website for the game Pong. The website will allow users to play Pong with others in
real-time, providing a user interface and a chat feature.

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

## Implementation Details

## Server

The server is a rest api that uses jwt authentication to protect the routes, the server is implemented using the nestjs
framework and uses the postgres database to store the data.
this server also uses the socket.io library to implement the real-time communication between the client and the server
and
this communication is used to implement the pong game and the chat.

### Endpoints

### Auth

The callback routes are used to authenticate users using the 42 API and guest authentication these
routes are used by the client to authenticate users and is not protected by jwt authentication.

The logout route is used to invalidate the user's session and is protected by jwt authentication.

| Method | Endpoint          | Description                       |
|--------|-------------------|-----------------------------------|
| GET    | /auth/42/callback | Callback for 42 authentication    |
| GET    | /auth/guest       | Callback for guest authentication |
| PATCH  | /auth/logout      | Invalidate user session           |

### Avatar

This route is used to get the user's avatar image and is not protected by jwt authentication.

| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| GET    | /avatar/img/:name | Get avatar user image |

### Chat

The chat routes are used to create chat channels, send messages, and manage users in chat channels (all routes are
protected by jwt authentication).

| Method | Endpoint                                               | Description                                    |
|--------|--------------------------------------------------------|------------------------------------------------|
| POST   | /chat                                                  | Create a new chat channel                      |
| GET    | /chat                                                  | Get all chat channel                           |
| PUT    | /chat/channel/:channelId/user/:nickname                | Add user to chat channel                       |
| POST   | /chat/channel/:channelId/messages                      | Send message to chat channel                   |
| POST   | /chat/channel/direct/:nickname/messages                | Send message to direct chat channel            |
| PATCH  | /chat/channels/:channelId/type                         | Change chat channel type                       |
| PUT    | /chat/channels/:channelId/password                     | Change chat channel password                   |
| POST   | /chat/channels/:channelId/login                        | Login to chat channel                          |
| GET    | /chat/channels/:channelId/users'                       | Get all users in chat channel                  |
| DELETE | /chat/channels/:channelId/users/:nickname              | Remove user from chat channel                  |
| PATCH  | /chat/channels/:channelId/users/:nickname/type         | Change change user access type in chat channel |
| PATCH  | /chat/channels/:channelId/users/:nickname/restrictions | Change user restrictions in chat channel       |
| GET    | /chat/channels/:channelId/messages                     | Get all messages in chat channel               |
| GET    | /chat/channels/direct/:nickname/messages               | Get all messages in direct chat channel        |
| DELETE | /chat/channels/:channelId/leave                        | Leave chat channel                             |

### Game

The game routes are used to get game and ranking data (all routes are protected by jwt authentication).

| Method | Endpoint                | Description                       |
|--------|-------------------------|-----------------------------------|
| GET    | /game/matches-history   | Get all matches history from user |
| GET    | /game/ranking           | Get ranking data from all users   |
| GET    | /game/ranking/:nickname | Get ranking data from user        |

### User

The user routes are used to get user data (all routes are protected by jwt authentication).

| Method | Endpoint                         | Description                                                                                                                                  |
|--------|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| GET    | /user/me                         | Retrieves the user information for the authenticated user.                                                                                   |
| POST   | /user/me/mfa                     | Generates a multi-factor authentication (MFA) secret for the authenticated user.                                                             |
| POST   | /user/me/mfa/validate            | Validates the MFA secret with a provided code for the authenticated user.                                                                    |
| PATCH  | /user/me/mfa/invalidate          | Invalidates the MFA secret for the authenticated user.                                                                                       |
| PATCH  | /user/me/nickname                | Updates the nickname for the authenticated user.                                                                                             |
| PATCH  | /user/me/avatar                  | Updates the avatar (profile picture) for the authenticated user.                                                                             |
| POST   | /user/profiles/:nickname/friends | Adds a friend to the user's profile. The `:nickname` parameter represents the nickname of the friend to be added.                            |
| DELETE | /user/profiles/:nickname/friends | Removes a friend from the user's profile. The `:nickname` parameter represents the nickname of the friend to be removed.                     |
| POST   | /user/profiles/:nickname/block   | Blocks a user. The `:nickname` parameter represents the nickname of the user to be blocked.                                                  |
| DELETE | /user/profiles/:nickname/block   | Unblocks a user. The `:nickname` parameter represents the nickname of the user to be unblocked.                                              |
| GET    | /user/profiles/:nickname         | Retrieves the profile information for a user. The `:nickname` parameter represents the nickname of the user whose profile is being accessed. |

## Socket Events

The ws url (
this url is the same as the server url but with the ws protocol instead of the http protocol
) is used to create a socket connection with the server and is protected by jwt authentication (the token is sent in the
header of the request).
The default namespace is used to send and receive messages from the server and create matches between users and
spectators.

| Event Name     | Description                                           |
|----------------|-------------------------------------------------------|
| joinRoom       | Join a waiting game room                              |
| startGame      | Start a game after the room is full ( 2 players )     |
| moveUp         | Move the player paddle up                             |
| moveDown       | Move the player paddle down                           |
| endGame        | give up of the current game or leave the waiting room |
| enterSpectator | Enter in a game as spectator using the room id        |
| spectatorOut   | Leave the game as spectator                           |
| invite         | Invite a friend to play a game                        |
| acceptInvite   | Accept a game invitation                              |
| declineInvite  | Decline a game invitation                             |

## Dependencies

### Client (React)

The client dependencies are listed in
the [package.json](https://github.com/transpong/Transpong/blob/master/client/package.json) file.

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

## Server (NestJS)

The server dependencies are listed in
the [package.json](https://github.com/transpong/Transpong/blob/master/server/package.json) file.

| Package                    | Version | Description                                                  |
|----------------------------|---------|--------------------------------------------------------------|
| @nestjs/class-transformer  | ^0.4.0  | Class transformation library for NestJS                      |
| @nestjs/class-validator    | ^0.13.1 | Class validation library for NestJS                          |
| @nestjs/common             | ^9.0.0  | Main module of the NestJS framework                          |
| @nestjs/config             | ^2.3.1  | Configuration library for NestJS                             |
| @nestjs/core               | ^9.0.0  | Core module of the NestJS framework                          |
| @nestjs/jwt                | ^10.0.3 | JWT authentication library for NestJS                        |
| @nestjs/passport           | ^9.0.3  | Authentication library for NestJS                            |
| @nestjs/platform-express   | ^9.0.0  | Express-based HTTP adapter for NestJS                        |
| @nestjs/platform-socket.io | ^9.4.0  | Socket.io adapter for NestJS                                 |
| @nestjs/typeorm            | ^9.0.1  | TypeORM integration for NestJS                               |
| @nestjs/websockets         | ^9.4.0  | WebSockets adapter for NestJS                                |
| 2fa-util                   | ^1.1.1  | Two-factor authentication utility library                    |
| bcrypt                     | ^5.1.0  | Library for hashing passwords                                |
| class-transformer          | ^0.5.1  | Class transformation library                                 |
| class-validator            | ^0.14.0 | Class validation library                                     |
| http-proxy-middleware      | ^2.0.6  | Middleware for proxying HTTP requests                        |
| passport-42                | ^1.2.6  | Passport strategy for authenticating with 42 OAuth           |
| passport-jwt               | ^4.0.1  | Passport strategy for JSON Web Token (JWT) authentication    |
| pg                         | ^8.10.0 | PostgreSQL database driver for Node.js                       |
| reflect-metadata           | ^0.1.13 | Library for adding metadata reflection to JavaScript objects |
| rxjs                       | ^7.2.0  | Reactive programming library for JavaScript                  |
| typeorm                    | ^0.3.15 | Object-Relational Mapping (ORM) library for TypeScript       |

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
