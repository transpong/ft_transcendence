import * as React from "react";
import Sketch from "react-p5";
import * as p5Types from "p5"; //Import this for typechecking and intellisense
import { useLocation, useOutletContext } from "react-router-dom";

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
        this.positionY = newHeight * (this.positionY / oldHeight)
        this.positionX = newWidth * (this.positionX / oldWidth)
        this.diameterBall = ((newHeight + newWidth) / 2) * 0.015;;

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

    checkPlayerCollision(player: Player){
        const yMenor = player.positionY
        const yMaior = player.positionY + player.heightPlayer
        if(player.id == 1){
            const xReferencia = player.positionX + player.widthPlayer
            if(this.previousCollisionPlayer != 1 && this.positionX - (this.diameterBall / 2) <= xReferencia && this.positionX - (this.diameterBall / 2) > 0){
                if(this.positionY >= yMenor && this.positionY <= yMaior){
                    this.speedX *= -1;
                    this.previousCollisionPlayer = 1
                }
            }
        }else if(player.id == 2){
            const xReferencia = player.positionX
            if(this.previousCollisionPlayer != 2 && this.positionX + (this.diameterBall / 2) >= xReferencia && this.positionX  < windowWidth){
                if(this.positionY >= yMenor && this.positionY <= yMaior){
                    this.speedX *= -1;
                    this.previousCollisionPlayer = 2
                }
            }
        }
    }
}

const Pong: React.FC<ComponentProps> = (props: ComponentProps) => {
    const { ref } = useOutletContext<{ref: React.RefObject<HTMLDivElement>}>();
    const {state} = useLocation()

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
        parentBorderWidth = (ref.current ? ref.current.clientHeight : canvasParentRef.clientHeight) -  canvasParentRef.clientHeight
        windowHeight = ref.current ? ref.current.clientHeight - parentBorderWidth : canvasParentRef.clientHeight
        windowWidth = ref.current ? ref.current.clientWidth - parentBorderWidth : canvasParentRef.clientWidth
        p5.createCanvas(windowWidth , windowHeight).parent(canvasParentRef);
        canvasParent = canvasParentRef
        ball = new Ball(p5,  ballImage)
        player1 = new Player(p5, 1)
        player2 = new Player(p5, 2)
        game = new Game(ball)
        buttonStart = new ButtonStart(p5)
        score = new Score(p5)
    };

    const draw = (p5: p5Types) => {
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