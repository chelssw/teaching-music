import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    payload: { email: string; fullName: string; password: string; role: UserRole }
  ) {
    return this.authService.register(payload);
  }

  @Post('login')
  login(@Body() payload: { email: string; password: string }) {
    return this.authService.login(payload.email, payload.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user: { userId: string; email: string; role: UserRole } }) {
    return req.user;
  }

  @Get('teacher-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  teacherOnly() {
    return { ok: true };
  }
}
