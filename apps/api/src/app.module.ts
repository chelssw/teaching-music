import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SchedulingModule } from './scheduling/scheduling.module';

@Module({
  imports: [PrismaModule, AuthModule, SchedulingModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
