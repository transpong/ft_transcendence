import { Injectable } from '@nestjs/common';
import { GameService } from '../../game/service/game.service';
import { MatchStatus } from '../../game/enum/MatchStatus';

@Injectable()
export class PongService {
  private readonly canvasWidth = 800; // Width of the game canvas
  private readonly canvasHeight = 600; // Height of the game canvas
  private readonly widthPlayer = 10; // Width of the paddles
  private readonly heightPlayer = 80; // Height of the paddles
  private readonly diameterBall = 10; // Size of the ball
  private readonly paddleSpeed = 10; // Speed at which the paddles move
  private readonly ballSpeed = 3; // Speed at which the ball moves

  private player1Y = this.canvasHeight / 2 - this.heightPlayer / 2; // Initial Y position of player 1's paddle
  private player2Y = this.canvasHeight / 2 - this.heightPlayer / 2; // Initial Y position of player 2's paddle
  private ballX = this.canvasWidth / 2 - this.diameterBall / 2; // Initial X position of the ball
  private ballY = this.canvasHeight / 2 - this.diameterBall / 2; // Initial Y position of the ball
  private ballSpeedX = this.ballSpeed; // Initial speed of the ball along the X-axis
  private ballSpeedY = this.ballSpeed; // Initial speed of the ball along the Y-axis

  private player1Score = 0; // Player 1's score
  private player2Score = 0; // Player 2's score
  private gameLoopInterval: NodeJS.Timeout | null = null;
  private timerInterval: NodeJS.Timeout | null = null;
  private timerDuration = 10; // Duration of the game in seconds
  private timer = this.timerDuration; // Current value of the timer

  private roomNameTmp;
  private serverTmp;

  constructor(private readonly gameService: GameService) {}

  movePlayer1Up(): void {
    if (this.player1Y >= this.paddleSpeed) {
      this.player1Y -= this.paddleSpeed;
    }
  }

  movePlayer1Down(): void {
    if (
      this.player1Y + this.heightPlayer + this.paddleSpeed <=
      this.canvasHeight
    ) {
      this.player1Y += this.paddleSpeed;
    }
  }

  movePlayer2Up(): void {
    if (this.player2Y >= this.paddleSpeed) {
      this.player2Y -= this.paddleSpeed;
    }
  }

  movePlayer2Down(): void {
    if (
      this.player2Y + this.heightPlayer + this.paddleSpeed <=
      this.canvasHeight
    ) {
      this.player2Y += this.paddleSpeed;
    }
  }

  updateBallPosition(): void {
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // Check collision with walls
    if (
      this.ballY <= 0 ||
      this.ballY + this.diameterBall >= this.canvasHeight
    ) {
      this.ballSpeedY *= -1; // Reverse the ball's Y speed
    }

    // Check collision with paddles
    if (
      (this.ballX <= this.widthPlayer &&
        this.ballY + this.diameterBall >= this.player1Y &&
        this.ballY <= this.player1Y + this.heightPlayer) ||
      (this.ballX + this.diameterBall >= this.canvasWidth - this.widthPlayer &&
        this.ballY + this.diameterBall >= this.player2Y &&
        this.ballY <= this.player2Y + this.heightPlayer)
    ) {
      this.ballSpeedX *= -1; // Reverse the ball's X speed
    }

    // Check for point scoring
    if (this.ballX < 0) {
      // Player 2 scores a point
      this.resetBallPosition(2); // Reset ball position
      // Increment player 2 score or perform other actions
      this.player1Score++;
    } else if (this.ballX > this.canvasWidth) {
      // Player 1 scores a point
      this.resetBallPosition(1); // Reset ball position
      // Increment player 1 score or perform other actions
      this.player2Score++;
    }
  }

  resetBallPosition(scoringPlayer: number): void {
    this.ballX = this.canvasWidth / 2 - this.diameterBall / 2; // Reset X position of the ball
    this.ballY = this.canvasHeight / 2 - this.diameterBall / 2; // Reset Y position of the ball

    // Reset X speed of the ball based on the scoring player
    this.ballSpeedX = this.ballSpeed * (scoringPlayer === 1 ? 1 : -1);

    // Reset Y speed of the ball
    this.ballSpeedY = this.ballSpeed;
  }

  startGameLoop(roomName: string, server: any): void {
    if (!this.gameLoopInterval) {
      this.roomNameTmp = roomName;
      this.serverTmp = server;
      // Start the game loop
      this.gameLoopInterval = setInterval(() => {
        // if conexao off emit endGame
        this.updateGameState();
        const gameState = this.getGameState();
        this.serverTmp.to(this.roomNameTmp).emit('pong', gameState);
      }, 1000 / 60); // Update the game state approximately 60 times per second
      // Start the timer
      this.startTimer();
    }
  }

  async stopGameLoop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;

      // Stop the timer
      this.stopTimer();

      const gameState = this.getGameState();
      console.log('ENDGAME', gameState);

      const matchEntity = await this.gameService.getByRoomName(
        this.roomNameTmp,
      );
      matchEntity.user1Score = gameState.player1Score;
      matchEntity.user2Score = gameState.player2Score;
      matchEntity.status = MatchStatus.FINISHED;
      if (gameState.player1Score > gameState.player2Score) {
        matchEntity.setWinner(1);
      } else {
        matchEntity.setWinner(2);
      }

      await this.gameService.updateMatch(matchEntity);
      this.serverTmp.to(this.roomNameTmp).emit('endGame', 'Acabouuuuu');
    }
  }

  private updateGameState(): void {
    this.updateBallPosition();

    // Check if the game is over
    if (this.timer <= 0) {
      const gameState = this.getGameState();
      this.serverTmp.to(this.roomNameTmp).emit('pong', gameState);
      this.stopGameLoop();
    }
  }

  private startTimer(): void {
    this.timer = this.timerDuration;

    if (!this.timerInterval) {
      // Start the timer countdown
      this.timerInterval = setInterval(() => {
        this.timer--;

        if (this.timer <= 0) {
          // Stop the timer when it reaches 0
          this.stopTimer();
        }
      }, 1000); // Update the timer every second
    }
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getGameState(): any {
    return {
      player1Y: this.player1Y,
      player2Y: this.player2Y,
      heightPlayer: this.heightPlayer,
      widthPlayer: this.widthPlayer,
      ballX: this.ballX,
      ballY: this.ballY,
      diameterBall: this.diameterBall,
      player1Score: this.player1Score,
      player2Score: this.player2Score,
      timer: this.timer,
    };
  }
}
