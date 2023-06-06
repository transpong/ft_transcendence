import * as React from "react";
import Sketch from "react-p5";
import * as p5Types from "p5"; //Import this for typechecking and intellisense
import {useLocation, useNavigate, useOutletContext, useParams} from "react-router-dom";
import { Socket } from "socket.io-client";
import {useToast} from "@chakra-ui/react";


let ball: Ball;
let player1: Player;
let player2: Player;
let game: Game;
let windowWidth = 0
let windowHeight = 0
let canvasParent: Element
let parentBorderWidth = 0
const backendWidth = 800
const backendHeight = 600
let fatorEscalaY = 0
let fatorEscalaX = 0

class Game {
    isRunning;
    scoreP1;
    scoreP2
    ballGame;
    p5;
    constructor(ballGame: Ball, newP5: p5Types){
        this.isRunning = false
        this.scoreP1 = 0
        this.scoreP2 = 0
        this.ballGame = ballGame
        this.p5 = newP5
    }

    stop(){
        if(this.isRunning == true){
            this.p5.removeElements()
            this.isRunning = false;
        }
    }

    start(){
        if(this.isRunning == false){
            this.p5.removeElements()
            this.isRunning = true;
        }
    }

    scorePlayer(player = 0){
        if(player == 1)
            this.scoreP1 += 1
        else if(player == 2)
            this.scoreP2 += 1
    }

    resetScore(){
        this.scoreP1 = this.scoreP2 = 0;
    }
}

class Player{
    id;
    p5;
    socket;
    constructor(p5Origin: p5Types, idPlayer: 1 | 2, newSocket: Socket, private isSpectator: boolean) {
        this.id = idPlayer;
        this.p5 = p5Origin
        this.socket = newSocket
    }

    printPlayer(newPositionY: number, widthPlayerBackend: number, heightPlayerBackend: number) {
        const widthPlayer = widthPlayerBackend * fatorEscalaX
        const heightPlayer = heightPlayerBackend * fatorEscalaY
        const positionX = this.id == 1 ? 0 : windowWidth - widthPlayer
        this.p5.rect( positionX, newPositionY * fatorEscalaY, widthPlayer, heightPlayer);
    }

    movePlayer(){
        if (this.p5.keyIsDown(this.p5.UP_ARROW) && !this.isSpectator) {
          this.socket.emit("moveUp");
        }
        if(this.p5.keyIsDown(this.p5.DOWN_ARROW) && !this.isSpectator){
            this.socket.emit('moveDown')
        }
    }
}

class Ball{
    ballImage;
    p5 ;

    constructor(teste: p5Types, newBallImage: any) {
        this.p5 = teste
        this.ballImage = newBallImage
    }

    printBall(positionX: number, positionY: number, diameterBallBackend: number) {
        const diameterBall = diameterBallBackend * (fatorEscalaY < fatorEscalaX ? fatorEscalaY : fatorEscalaX)
        if(this.ballImage != null)
            this.p5.image(this.ballImage, positionX * fatorEscalaX, positionY * fatorEscalaY, diameterBall, diameterBall)
        else
            this.p5.circle( positionX * fatorEscalaX, positionY * fatorEscalaY, diameterBall);
    }
}

const Pong: React.FC = () => {
    const { ref, socketGame } = useOutletContext<{ref: React.RefObject<HTMLDivElement>, socketGame: Socket}>();
    const {state} = useLocation()

    type BackendGame = {
        ballX: number;
        ballY: number;
        diameterBall: number;
        heightPlayer: number;
        player1Name: string;
        player1Score: number;
        player1Y: number;
        player2Name: string;
        player2Score: number;
        player2Y: number;
        timer: number;
        widthPlayer: number;
    }

    const navigate = useNavigate();
    const params = useParams();

    let backendGame: BackendGame = {
        ballX: 0,
        ballY: 0,
        diameterBall: 0,
        heightPlayer: 0,
        player1Name: "",
        player1Score: 0,
        player1Y: 0,
        player2Name: "",
        player2Score: 0,
        player2Y: 0,
        timer: 0,
        widthPlayer: 0,
    }
    const toast = useToast();
    const isSpectator = !!params.id;
    // console.log('Conect Front');
    // Send 'joinRoom' message when the component mounts
    if (socketGame != null) {
      if (isSpectator) {
        socketGame.emit("enterSpectator", params.id);

        socketGame.on("pong", (message: BackendGame) => {
          backendGame = message;
          game.start();
          console.log("Received message 2:", message);
        });

        socketGame.on("giveUp", (message: string) => {
          toast({
            title: "Game Over",
            description: message,
            status: "info",
            duration: 5000,
            isClosable: true,
          });

          console.log("Game Over:", message);

          setTimeout(() => {
            navigate("/home/matches");
          }, 3000);
        });

        socketGame.on("gameOver", (message: string) => {
          game.stop();
          console.log("Game Over:", message);
          toast({
            title: "Game Over Finished",
            description: message,
            status: "info",
            duration: 5000,
            isClosable: true,
          });

          console.log("Game Over:", message);

          setTimeout(() => {
            navigate("/home/matches");
          }, 3000);
        });
      } else if (state?.fromInvite) {
        socketGame.emit("startGame");

        // Listen for 'message' events and log the received messages
        socketGame.on("message", (message: string) => {
          console.log("Received message 1:", message);
        });

        socketGame.on("pong", (message: BackendGame) => {
          backendGame = message;
          game.start();
          console.log("Received message 2:", message);
        });

        socketGame.on("giveUp", (message: string) => {
          toast({
            title: "Game Over",
            description: message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });

          console.log("Game Over:", message);

          setTimeout(() => {
            navigate("/home/matches");
          }, 3000);
        });

        socketGame.on("gameOver", (message: string) => {
          socketGame.emit("endGame");
          game.stop();
          console.log("Game Over:", message);

          setTimeout(() => {
            navigate("/home/matches");
          }, 3000);
        });
      } else {
        socketGame.emit("joinRoom");

        socketGame.on("toGame", (message: BackendGame) => {
          socketGame.emit("startGame");
          backendGame = message;
          setTimeout(() => socketGame.emit("startGame"), 1000);
          game.start();
          console.log("Game Startou", message);
        });

        // Listen for 'message' events and log the received messages
        socketGame.on("message", (message: string) => {
          console.log("Received message 1:", message);
        });

        socketGame.on("pong", (message: BackendGame) => {
          backendGame = message;
          game.start();
          console.log("Received message 2:", message);
        });

        socketGame.on("giveUp", (message: string) => {
          toast({
            title: "Game Over",
            description: message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });

          console.log("Game Over:", message);

          setTimeout(() => {
            navigate("/home/matches");
          }, 3000);
        });

        socketGame.on("gameOver", (message: string) => {
          socketGame.emit("endGame");
          game.stop();
          console.log("Game Over:", message);

          setTimeout(() => {
            navigate("/home/matches");
          }, 3000);
        });
      }
    }

    class Score {
        p5;
        scoreP1;
        scoreP2;
        score : p5Types.Element | null = null;

        constructor(p5New: p5Types){
            this.p5 = p5New
            this.scoreP1 = 0
            this.scoreP2 = 0
        }
        show(newScoreP1: number, newScoreP2: number){
            if(this.scoreP1 != newScoreP1 || this.scoreP2 != newScoreP2){
                this.scoreP1 = newScoreP1
                this.scoreP2 = newScoreP2
                this.p5.removeElements()
                this.score = null
            }
            if(this.score ===  null){
                this.score = this.p5.createButton(`${this.scoreP2} X ${this.scoreP1}`);
                this.score.style("color", "white")
                this.score.style("cursor", "default")
                this.score.style("font-size", `${(windowHeight < windowWidth ? windowHeight : windowWidth) * 0.10}px`)
                const size = Object.entries(this.score.size()).reduce<Record<string, number>>((acc, item) => {
                    acc[item[0]] = item[1]
                    return acc
                }, {})
                this.score.position(((windowWidth / 2) - (size["width"] / 2)), windowHeight * 0.20 + parentBorderWidth)
            }
        }
        destroy(){
            if(this.score !== null)
                this.score = null
        }
    }


    class ButtonStart{
        p5;
        button : p5Types.Element | null = null;
        constructor(p5New: p5Types){
            this.p5 = p5New
        }

        createButton(){
            if(this.button ===  null) {
                this.button = this.p5.createButton("Aguardando...");
                this.button.style("background", "white")
                this.button.style("cursor", "default")
                this.button.style("border-radius", "20px")
                this.button.style("font-size", `${(windowHeight < windowWidth ? windowHeight : windowWidth) * 0.08}px`)
                const size = Object.entries(this.button.size()).reduce<Record<string, number>>((acc, item) => {
                    acc[item[0]] = item[1]
                    return acc
                }, {})
                this.button.position(((windowWidth / 2) - (size["width"] / 2)), (windowHeight / 2) + (size["height"] / 2) + parentBorderWidth)
            }
        }
        destroy(){
            if(this.button !== null)
                this.button = null
        }

    }


    let buttonStart : ButtonStart | null = null
    let score : Score | null = null
    let background: any
    let ballImage: any


    const preload = (p5: p5Types) =>{
        if(state && state.field != "")
            background = p5.loadImage(state.field)
        else
            background = 0
        if(state && state.ball != "")
            ballImage = p5.loadImage(state.ball)
        else
            ballImage = null
    }



    const setup = (p5: p5Types, canvasParentRef: Element) => {
        parentBorderWidth = (ref.current ? ref.current.clientHeight : canvasParentRef.clientHeight) -  canvasParentRef.clientHeight
        windowHeight = ref.current ? ref.current.clientHeight - parentBorderWidth : canvasParentRef.clientHeight
        windowWidth = ref.current ? ref.current.clientWidth - parentBorderWidth : canvasParentRef.clientWidth
        fatorEscalaX = windowWidth / backendWidth
        fatorEscalaY = windowHeight / backendHeight
        p5.createCanvas(windowWidth , windowHeight).parent(canvasParentRef);
        canvasParent = canvasParentRef
        ball = new Ball(p5, ballImage)
        player1 = new Player(p5, 1, socketGame, isSpectator);
        player2 = new Player(p5, 2, socketGame, isSpectator);
        game = new Game(ball,  p5)
        buttonStart = new ButtonStart(p5)
        score = new Score(p5)
    };

    const draw = (p5: p5Types) => {
        p5.background(background);
        if(game.isRunning){
            player1.printPlayer(backendGame.player1Y, backendGame.widthPlayer, backendGame.heightPlayer);
            player2.printPlayer(backendGame.player2Y, backendGame.widthPlayer, backendGame.heightPlayer);
            buttonStart?.destroy()
            score?.destroy()
            ball.printBall(backendGame.ballX, backendGame.ballY, backendGame.diameterBall);
            player1.movePlayer();
        }else{
            score?.show(backendGame.player1Score, backendGame.player2Score)
            buttonStart?.createButton()
        }
    };

    const windowResized = (p5: p5Types) => {
        parentBorderWidth = (ref.current ? ref.current.clientHeight : canvasParent.clientHeight) -  canvasParent.clientHeight
        const newWindowHeight = ref.current ? ref.current.clientHeight - parentBorderWidth : canvasParent.clientHeight
        const newWindowWidth = ref.current ? ref.current.clientWidth - parentBorderWidth : canvasParent.clientWidth
        fatorEscalaY = newWindowHeight / backendHeight
        fatorEscalaX = newWindowWidth / backendWidth
        p5.createCanvas(newWindowWidth , newWindowHeight).parent(canvasParent)
        windowWidth = newWindowWidth
        windowHeight = newWindowHeight

        buttonStart?.destroy()
        score?.destroy()
        p5.removeElements()
    }

  return <Sketch setup={setup} draw={draw}  windowResized={windowResized} preload={preload}/>
}



export default Pong
