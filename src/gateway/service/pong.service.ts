import { Injectable } from '@nestjs/common';

@Injectable()
export class PongService {
  private x = 0;
  private y = 0;

  moveUp(): void {
    this.y -= 10;
  }

  getCoordinates(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  moveDown(): void {
    this.y += 10;
  }
}
