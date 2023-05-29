import * as React from "react";
import Sketch from "react-p5";
import * as p5Types from "p5"; //Import this for typechecking and intellisense
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";

interface ComponentProps {
  // Your component props
}

let ball: Ball;
let player1: Player;
let player2: Player;
let game: Game;
let windowWidth = 0
let windowHeight = 0
let canvasParent: Element
let parentBorderWidth = 0
let backendWidth = 800
let backendHeight = 600
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

    scorePlayer(player: number = 0){
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
    id = 0
    positionX = 0;
    positionY = 0;
    heightPlayer = 0;
    widthPlayer = 0;
    speedY = 2;
    p5;
    socket;
    constructor(p5Origin: p5Types, idPlayer: number, newSocket: Socket) {
        this.widthPlayer = 10 * fatorEscalaX;
        this.heightPlayer = 80 * fatorEscalaY;
        this.id = idPlayer;
        if(idPlayer == 1){
            this.positionX = 0;
        }else if (idPlayer == 2){
            this.positionX = windowWidth - this.widthPlayer;
        }
        this.positionY = (windowHeight / 2) - (this.heightPlayer / 2);
        this.speedY = 2;
        this.p5 = p5Origin
        this.socket = newSocket
    }

    responsivePlayer(newWidth: number, newFatorEscalaX: number, newFatorEscalaY: number){
        this.heightPlayer = 80 * newFatorEscalaY;
        this.widthPlayer = 10 * newFatorEscalaX;
        this.positionX = this.positionX == 0 ? 0 : newWidth - this.widthPlayer
    }

    printPlayer(newPositionY: number) {
        this.p5.rect( this.positionX, newPositionY * fatorEscalaY, this.widthPlayer, this.heightPlayer);
    }

    movePlayer(){
        if(this.p5.keyIsDown(this.p5.UP_ARROW)){
            this.socket.emit('moveUp')
        }
        if(this.p5.keyIsDown(this.p5.DOWN_ARROW)){
            this.socket.emit('moveDown')
        }
    }
}

class Ball{
    positionX = windowWidth / 2;
    positionY = windowHeight / 2;
    speedX = 2;
    speedY = 2;
    diameterBall = ((windowWidth + windowHeight) / 2) * 0.023;
    p5 ;

    constructor(teste: p5Types) {
        this.positionX;
        this.positionY;
        this.speedX;
        this.speedY;
        this.diameterBall;
        this.p5 = teste
    }

    responsiveBall(newHeight: number, oldHeight: number, newWidth: number, oldWidth: number){
        this.positionY = newHeight * (this.positionY / oldHeight)
        this.positionX = newWidth * (this.positionX / oldWidth)
        this.diameterBall = ((newHeight + newWidth) / 2) * 0.015;;

    }

    printBall(positionX: number, positionY: number) {
        this.p5.circle( positionX * fatorEscalaX, positionY * fatorEscalaY, this.diameterBall);
    }
}

const Pong: React.FC<ComponentProps> = (props: ComponentProps) => {
    const { ref, socketGame } = useOutletContext<{ref: React.RefObject<HTMLDivElement>, socketGame: Socket}>();
    type BackendGame = {
        ballX: number;
        ballY: number;
        player1Score: number;
        player1Y: number;
        player2Score: number;
        player2Y: number;
        timer: number;
    }

    let backendGame: BackendGame = {
        ballX: 0,
        ballY: 0,
        player1Score: 0,
        player1Y: 0,
        player2Score: 0,
        player2Y: 0,
        timer: 0,
    }
    // console.log('Conect Front');
    // Send 'joinRoom' message when the component mounts
    if(!socketGame.disconnected) {
        socketGame.disconnect() ;
    }
    socketGame.connect();
    socketGame.emit('joinRoom');

    socketGame.on('startGame', (message: BackendGame) => {
        socketGame.emit('startGame');
        backendGame = message;
        game.start()
        console.log('Game Startou', message);
    });

    // Listen for 'message' events and log the received messages
    socketGame.on('message', (message: string) => {
      console.log('Received message 1:', message);
    });


    socketGame.on('pong', (message: BackendGame) => {
        backendGame = message;
        console.log('Received message 2:', message);
    });

    socketGame.on('endGame', (message: string) => {
        socketGame.emit('endGame');
        game.stop();
        console.log('Game Over:', message);
        socketGame.disconnect();
    });

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


    const setup = (p5: p5Types, canvasParentRef: Element) => {
        parentBorderWidth = (ref.current ? ref.current.clientHeight : canvasParentRef.clientHeight) -  canvasParentRef.clientHeight
        windowHeight = ref.current ? ref.current.clientHeight - parentBorderWidth : canvasParentRef.clientHeight
        windowWidth = ref.current ? ref.current.clientWidth - parentBorderWidth : canvasParentRef.clientWidth
        fatorEscalaX = windowWidth / backendWidth
        fatorEscalaY = windowHeight / backendHeight
        p5.createCanvas(windowWidth , windowHeight).parent(canvasParentRef);
        canvasParent = canvasParentRef
        ball = new Ball(p5)
        player1 = new Player(p5, 1, socketGame)
        player2 = new Player(p5, 2, socketGame)
        game = new Game(ball,  p5)
        buttonStart = new ButtonStart(p5)
        score = new Score(p5)
    };

    const draw = (p5: p5Types) => {
        p5.background(0);
        if(game.isRunning){
            player1.printPlayer(backendGame.player1Y);
            player2.printPlayer(backendGame.player2Y);
            buttonStart?.destroy()
            score?.destroy()
            ball.printBall(backendGame.ballX, backendGame.ballY);
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
        player1.responsivePlayer(newWindowWidth, fatorEscalaX, fatorEscalaY)
        player2.responsivePlayer(newWindowWidth,  fatorEscalaX, fatorEscalaY)
        ball.responsiveBall(newWindowHeight, windowHeight, newWindowWidth, windowWidth)
        p5.createCanvas(newWindowWidth , newWindowHeight).parent(canvasParent)
        windowWidth = newWindowWidth
        windowHeight = newWindowHeight

        buttonStart?.destroy()
        score?.destroy()
        p5.removeElements()
    }

  return <Sketch setup={setup} draw={draw}  windowResized={windowResized}/>
}



export default Pong