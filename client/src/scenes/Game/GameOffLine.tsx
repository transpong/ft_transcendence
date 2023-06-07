/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import Sketch from "react-p5";
import * as p5Types from "p5";
import {useLocation, useNavigate, useOutletContext} from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

let ball: Ball;
let player1: Player;
let player2: Player | Bot;
let game: Game;
let windowWidth = 0
let windowHeight = 0
let canvasParent: Element
let parentBorderWidth = 0

class Game {
    isRunning;
    scoreP1;
    scoreP2
    ballGame;
    constructor(ballGame: Ball){
        this.isRunning = false
        this.scoreP1 = 0
        this.scoreP2 = 0
        this.ballGame = ballGame
    }

    stop(){
        this.isRunning = false
    }

    start(){
        this.ballGame.centralize();
        this.isRunning = true;
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

class Pawn {
    id = 0
    positionX = 0;
    positionY = 0;
    heightPlayer = 0;
    widthPlayer = 0;
    speedY = 10 * (windowHeight / 600) * (800 / windowWidth);
    p5;

    constructor(p5Origin: p5Types, idPlayer: number) {
        this.widthPlayer = (windowWidth / 800) * 20;
        this.heightPlayer = (windowHeight / 600) * 80;
        this.id = idPlayer;
        if(idPlayer == 1){
            this.positionX = 0;
        }else if (idPlayer == 2){
            this.positionX = windowWidth - this.widthPlayer;
        }
        this.positionY = (windowHeight / 2) - (this.heightPlayer / 2);
        this.speedY = (windowHeight / 600) * (800 / windowWidth) * 10;
        this.p5 = p5Origin
    }

    responsivePlayer(newHeight: number, oldHeight: number, newWidth: number){
        this.heightPlayer = (newHeight / 600) * 80
        this.widthPlayer = (newWidth / 800) * 20
        this.positionY =  this.positionY * (newHeight / oldHeight)
        this.positionX = this.id === 1 ? 0 : newWidth - this.widthPlayer;

        this.speedY = (newHeight / 600) * (800 / newWidth ) * 10;
    }

    printPlayer() {
        this.p5.rect( this.positionX, this.positionY, this.widthPlayer, this.heightPlayer);
    }
    movePlayer() {
      throw new Error("Move method not implemented.");
    }
  }

  class Player extends Pawn {
    movePlayer(){
        if(this.id == 1){
            if(this.p5.keyIsDown(this.p5.UP_ARROW)){
                this.positionY -= this.speedY
                if(this.positionY < 0) this.positionY = 0
            }
            if(this.p5.keyIsDown(this.p5.DOWN_ARROW)){
                this.positionY += this.speedY
                if(this.positionY + this.heightPlayer > windowHeight)this.positionY = windowHeight - this.heightPlayer
            }
        }
        else if (this.id === 2) {
            if(this.p5.keyIsDown(this.p5.SHIFT)){
                this.positionY -= this.speedY
                if(this.positionY < 0) this.positionY = 0
            }
            if(this.p5.keyIsDown(this.p5.CONTROL)){
                this.positionY += this.speedY
                if(this.positionY + this.heightPlayer > windowHeight)this.positionY = windowHeight - this.heightPlayer
            }
        }
    }
  }

  class Bot extends Pawn {
    randomMove = 0;
    previousTime = Date.now();
    elapsedTime = 0;

    private moveBotToBall() {
        // Ball is moving towards the bot
        const targetY = ball.positionY + ball.diameterBall / 2;

        if (targetY < this.positionY + this.heightPlayer / 2) {
            // Ball is above the bot, move up
            const newY = Math.max(this.positionY - this.speedY, targetY - this.heightPlayer / 2);
            this.positionY = newY;
            if (this.positionY < 0)
                this.positionY = 0;
        } else if (targetY > this.positionY + this.heightPlayer / 2) {
            // Ball is below the bot, move down
            const newY = Math.min(this.positionY + this.speedY, targetY - this.heightPlayer / 2);
            this.positionY = newY;
            if (this.positionY + this.heightPlayer > windowHeight)
                this.positionY = windowHeight - this.heightPlayer;
        }
        this.elapsedTime = 0;
    }

    private moveBotRandom() {
        const currentTime = Date.now();
        this.elapsedTime += currentTime - this.previousTime;
        this.previousTime = currentTime;
        if (this.elapsedTime >= 1000) {
            this.elapsedTime = 0;
            // Ball is not coming towards the bot, perform small random moves
            const randomMove = Math.random();

            if (randomMove < 0.5) {
                // Move up
                this.positionY -= this.speedY;
                if (this.positionY < 0)
                    this.positionY = 0;
            } else if (randomMove >= 0.5) {
                // Move down
                this.positionY += this.speedY;
                if (this.positionY + this.heightPlayer > windowHeight)
                    this.positionY = windowHeight - this.heightPlayer;
            }
            this.randomMove = randomMove;
        }
        else {
            // Continue moving in the same direction
            if (this.randomMove < 0.5) {
                // Move up
                this.positionY -= this.speedY;
                if (this.positionY < 0) {
                    this.positionY = 0;
                    this.randomMove = 1;
                }
            } else {
                // Move down
                this.positionY += this.speedY;
                if (this.positionY + this.heightPlayer > windowHeight) {
                    this.positionY = windowHeight - this.heightPlayer;
                    this.randomMove = 0.1;
                }
            }
        }
    }

    private moveBot() {
        if (ball.speedX > 0 && ball.positionX > windowWidth / 2) {
            this.moveBotToBall();
        } else {
            this.moveBotRandom();
        }
    }

    movePlayer(){
        if(this.id == 1){
            if(this.p5.keyIsDown(this.p5.UP_ARROW)){
                this.positionY -= this.speedY
                if(this.positionY < 0) this.positionY = 0
            }
            if(this.p5.keyIsDown(this.p5.DOWN_ARROW)){
                this.positionY += this.speedY
                if(this.positionY + this.heightPlayer > windowHeight)this.positionY = windowHeight - this.heightPlayer
            }
        }
        else if (this.id === 2) {
            this.moveBot();
        }
    }
  }

class Ball{
    positionX = windowWidth / 2;
    positionY = windowHeight / 2;
    speedX = 4 * windowWidth / 800;
    speedY = 4 * windowHeight / 600;
    diameterBall = ((windowWidth + windowHeight) / 2) * 0.02;
    ballImage;
    previousCollisionPlayer : 0 | 1 | 2;
    p5 ;

    constructor(teste: p5Types, newBallImage: any) {
        this.positionX;
        this.positionY;
        this.speedX;
        this.speedY;
        this.diameterBall;
        this.p5 = teste
        this.ballImage = newBallImage
        this.previousCollisionPlayer = 0
    }

    responsiveBall(newHeight: number, oldHeight: number, newWidth: number, oldWidth: number){
        const scaleFactorX = newWidth / oldWidth;
        const scaleFactorY = newHeight / oldHeight;

        this.positionX *= scaleFactorX;
        this.positionY *= scaleFactorY;

        // Adjust the ball diameter scaling
        this.diameterBall = ((newHeight + newWidth) / 2) * 0.02;

        // Adjust the speed scaling to maintain a consistent speed relative to the screen size
        this.speedX = Math.sign(this.speedX) * newWidth / 800 * 4;
        this.speedY = Math.sign(this.speedY) * newHeight / 600 * 4;
    }

    centralize(){
        this.positionX = windowWidth / 2;
        this.positionY = windowHeight / 2;
    }

    printBall() {
        if(this.ballImage != null)
            this.p5.image(this.ballImage, this.positionX, this.positionY, this.diameterBall, this.diameterBall)
        else
            this.p5.circle( this.positionX, this.positionY, this.diameterBall);
        this.positionX += this.speedX;
        this.positionY += this.speedY;
        return this.checkBorder();
    }

    checkBorder() {
        if(this.positionY - (this.diameterBall / 2) < 0) this.speedY *= -1;
        if(this.positionY + (this.diameterBall / 2) > windowHeight) this.speedY *= -1;
        return 0;
    }

    isGoal(){
        if(this.positionX - (this.diameterBall / 2) < 0) return true;
        if(this.positionX + (this.diameterBall / 2) > windowWidth) return true;
        return false
    }

    whoScoredGoal(){
        if(this.positionX - (this.diameterBall / 2) < 0) return 1;
        if(this.positionX + (this.diameterBall / 2) > windowWidth) return 2;
        return 0;
    }

    checkPlayerCollision(player: Player) {
        const yMin = player.positionY;
        const yMax = player.positionY + player.heightPlayer;

        if (player.id === 1) {
          const xReference = player.positionX + player.widthPlayer;
          if (
            this.previousCollisionPlayer !== 1 &&
            this.positionX - this.diameterBall / 2 <= xReference &&
            this.positionX - this.diameterBall / 2 > 0 &&
            this.positionY >= yMin &&
            this.positionY <= yMax
          ) {
            this.speedX *= -1;
            this.previousCollisionPlayer = 1;
          }
        } else if (player.id === 2) {
          const xReference = player.positionX;
          if (
            this.previousCollisionPlayer !== 2 &&
            this.positionX + this.diameterBall / 2 >= xReference &&
            this.positionX <= windowWidth &&
            this.positionY >= yMin &&
            this.positionY <= yMax
          ) {
            this.speedX *= -1;
            this.previousCollisionPlayer = 2;
          }
        }
      }

}

const Pong: React.FC = () => {
    const {state} = useLocation()
    const navigate = useNavigate()
    const toast = useToast();

    const validateOperation = () => {
        if (state === null) {
            toast({
                title: "Não autorizado",
                description: "Operação não autorizada",
                status: "info",
            duration: 5000,
            isClosable: true,
          });
          return true
        }
        return false
      }
    if (validateOperation()) {
      useEffect(() => {
        navigate("/home");
      }, []);
      return null;
    }

    const { ref } = useOutletContext<{ref: React.RefObject<HTMLDivElement>}>();

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
                this.button = this.p5.createButton("Começar");
                this.button.style("background", "white")
                this.button.style("border-radius", "20px")
                this.button.mousePressed(() => {
                    game.start()
                    this.p5.removeElements()
                })
                this.button.style("font-size", `${(windowHeight < windowWidth ? windowHeight : windowWidth) * 0.10}px`)
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
    let parentRef: Element


    const preload = (p5: p5Types) =>{
        if(state.field != "")
            background = p5.loadImage(state.field)
        else
            background = 0
        if(state.ball != "")
            ballImage = p5.loadImage(state.ball)
        else
            ballImage = null
    }

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        parentRef = canvasParentRef
        parentBorderWidth = (ref.current ? ref.current.clientHeight : canvasParentRef.clientHeight) -  canvasParentRef.clientHeight
        windowHeight = ref.current ? ref.current.clientHeight - parentBorderWidth : canvasParentRef.clientHeight
        windowWidth = ref.current ? ref.current.clientWidth - parentBorderWidth : canvasParentRef.clientWidth
        p5.createCanvas(windowWidth , windowHeight).parent(canvasParentRef);
        canvasParent = canvasParentRef
        ball = new Ball(p5,  ballImage)
        player1 = new Player(p5, 1)
        player2 = state.players == "2" ? new Player(p5, 2) : new Bot(p5, 2)
        game = new Game(ball)
        buttonStart = new ButtonStart(p5)
        score = new Score(p5)
    };

    const draw = (p5: p5Types) => {
        if(!parentRef){
            p5.noLoop()
            return
        }
        p5.background(background);
        player1.printPlayer();
        player2.printPlayer();
        if(game.isRunning){
            buttonStart?.destroy()
            score?.destroy()
            ball.printBall();
            if(ball.isGoal()){
                game.scorePlayer(ball.whoScoredGoal());
                game.stop();
                player1.positionY = windowHeight / 2;
                player2.positionY = windowHeight / 2;
            }
            player1.movePlayer();
            player2.movePlayer();
            ball.checkPlayerCollision(player1)
            ball.checkPlayerCollision(player2)
        }else{
            score?.show(game.scoreP1, game.scoreP2)
            buttonStart?.createButton()
        }
    };

    const windowResized = (p5: p5Types) => {
        parentBorderWidth = (ref.current ? ref.current.clientHeight : canvasParent.clientHeight) -  canvasParent.clientHeight
        const newWindowHeight = ref.current ? ref.current.clientHeight - parentBorderWidth : canvasParent.clientHeight
        const newWindowWidth = ref.current ? ref.current.clientWidth - parentBorderWidth : canvasParent.clientWidth
        player1.responsivePlayer(newWindowHeight, windowHeight, newWindowWidth)
        player2.responsivePlayer(newWindowHeight, windowHeight, newWindowWidth)
        ball.responsiveBall(newWindowHeight, windowHeight, newWindowWidth, windowWidth)
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
