import React from "react";
import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { useOutletContext } from "react-router-dom";

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
let button: p5Types.Element 


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
    constructor(p5Origin: p5Types, idPlayer: number) {
        this.widthPlayer = 20;
        this.heightPlayer = windowHeight * 0.1;
        this.id = idPlayer;
        if(idPlayer == 1){
            this.positionX = 0;
        }else if (idPlayer == 2){
            this.positionX = windowWidth - this.widthPlayer;
        }
        this.positionY = (windowHeight / 2) - (this.heightPlayer / 2);
        this.speedY = 2;
        this.p5 = p5Origin
    }

    responsivePlayer(newHeight: number, oldHeight: number, newWidth: number){
        this.heightPlayer = newHeight * 0.1
        this.positionY = newHeight * (this.positionY / oldHeight)
        this.positionX = this.positionX == 0 ? 0 : newWidth - this.widthPlayer
    }

    printPlayer() {
        this.p5.rect( this.positionX, this.positionY, this.widthPlayer, this.heightPlayer);
    }

    movePlayer(){
        if(this.id == 1){
            if(this.p5.keyIsDown(this.p5.SHIFT)){
                this.positionY -= this.speedY
                if(this.positionY < 0) this.positionY = 0
            }
            if(this.p5.keyIsDown(this.p5.CONTROL)){
                this.positionY += this.speedY
                if(this.positionY + this.heightPlayer > windowHeight)this.positionY = windowHeight - this.heightPlayer
            }
        }

        if(this.id == 2){
            if(this.p5.keyIsDown(this.p5.UP_ARROW)){
                this.positionY -= this.speedY
                if(this.positionY < 0) this.positionY = 0
            }
            if(this.p5.keyIsDown(this.p5.DOWN_ARROW)){
                this.positionY += this.speedY
                if(this.positionY + this.heightPlayer > windowHeight) this.positionY = windowHeight - this.heightPlayer
            }
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

    centralize(){
        this.positionX = windowWidth / 2;
        this.positionY = windowHeight / 2;
    }

    printBall() {
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

    checkPlayerCollision(player: Player){
        const yMenor = player.positionY
        const yMaior = player.positionY + player.heightPlayer
        if(player.id == 1){
            const xReferencia = player.positionX + player.widthPlayer
            if(this.positionX - (this.diameterBall / 2) <= xReferencia && this.positionX - (this.diameterBall / 2) > 0){
                if(this.positionY >= yMenor && this.positionY <= yMaior)
                    this.speedX *= -1;
            }
        }else if(player.id == 2){
            const xReferencia = player.positionX
            if(this.positionX + (this.diameterBall / 2) >= xReferencia && this.positionX  < windowWidth){
                if(this.positionY >= yMenor && this.positionY <= yMaior)
                    this.speedX *= -1;
            }
        }
    }
}

const Pong: React.FC<ComponentProps> = (props: ComponentProps) => {
    const { ref } = useOutletContext<{ref: React.RefObject<HTMLDivElement>}>();
    let startButtonColor = "white"


    const showScore = (p5: p5Types, scoreP1: number, scoreP2: number) => {
        const score = p5.createButton(`${scoreP2} X ${scoreP1}`);
        score.style("font-size", `${windowHeight * 0.10}px`)
        score.style("color", "white")
        score.style("cursor", "default")
        const size = Object.entries(score.size()).reduce<Record<string, number>>((acc, item) => {
            acc[item[0]] = item[1]
            return acc
        }, {})
        score.position(((windowWidth / 2) - (size["width"] / 2)), windowHeight * 0.10 * 2 + parentBorderWidth)

    }

    const showStartButton = (p5: p5Types) => {
        button = p5.createButton("Começar");
        button.style("background", startButtonColor)
        button.style("border-radius", "20px")
        button.style("font-size", `${windowHeight * 0.10}px`)
        button.mousePressed(() => {
            game.start()
            p5.removeElements()
        })
        button.mouseOver(() => {
            startButtonColor = "grey"
        })
        button.mouseOut(() => {
            startButtonColor = "white"
        })
        const size = Object.entries( button.size()).reduce<Record<string, number>>((acc, item) => {
            acc[item[0]] = item[1]
            return acc
        }, {})
        button.position(((windowWidth / 2) - (size["width"] / 2)), (windowHeight / 2) + (size["height"] / 2) + parentBorderWidth)
    }

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        parentBorderWidth = (ref.current ? ref.current.clientHeight : canvasParentRef.clientHeight) -  canvasParentRef.clientHeight
        windowHeight = ref.current ? ref.current.clientHeight - parentBorderWidth : canvasParentRef.clientHeight
        windowWidth = ref.current ? ref.current.clientWidth - parentBorderWidth : canvasParentRef.clientWidth
        p5.createCanvas(windowWidth , windowHeight).parent(canvasParentRef);
        canvasParent = canvasParentRef
        ball = new Ball(p5)
        player1 = new Player(p5, 1)
        player2 = new Player(p5, 2)
        game = new Game(ball)
    };
    
    const draw = (p5: p5Types) => {
        p5.background(0);
        player1.printPlayer();
        player2.printPlayer();
        if(game.isRunning){
            ball.printBall();
            if(ball.isGoal()){
                game.scorePlayer(ball.whoScoredGoal());
                game.stop();
            }
            player1.movePlayer();
            player2.movePlayer();
            ball.checkPlayerCollision(player1)
            ball.checkPlayerCollision(player2)
        }else{
            showScore(p5, game.scoreP1, game.scoreP2);
            showStartButton(p5);
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
        p5.removeElements()
    }

  return <Sketch setup={setup} draw={draw}  windowResized={windowResized}/>
}



export default Pong