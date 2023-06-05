import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TFAGuard extends AuthGuard('tfa') {}
