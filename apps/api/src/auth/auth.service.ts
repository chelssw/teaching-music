import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(params: {
    email: string;
    fullName: string;
    password: string;
    role: UserRole;
  }): Promise<AuthResponse> {
    const passwordHash = await bcrypt.hash(params.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: params.email.toLowerCase(),
          fullName: params.fullName,
          passwordHash,
          role: params.role
        }
      });

      return this.buildAuthResponse(user.id, user.email, user.fullName, user.role);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('An account with that email already exists.');
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.buildAuthResponse(user.id, user.email, user.fullName, user.role);
  }

  private buildAuthResponse(
    userId: string,
    email: string,
    fullName: string,
    role: UserRole
  ): AuthResponse {
    const accessToken = this.jwtService.sign({
      sub: userId,
      email,
      role
    });

    return {
      accessToken,
      user: {
        id: userId,
        email,
        fullName,
        role
      }
    };
  }
}
