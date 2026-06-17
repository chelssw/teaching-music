import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { LessonStatus, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SchedulingService } from './scheduling.service';

interface AuthenticatedRequest {
  user: {
    userId: string;
    role: UserRole;
  };
}

@Controller('scheduling')
@UseGuards(JwtAuthGuard)
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('lesson-types')
  createLessonType(
    @Req() req: AuthenticatedRequest,
    @Body() payload: { title: string; description?: string; durationMinutes: number; priceCents: number }
  ) {
    return this.schedulingService.createLessonType(req.user, payload);
  }

  @Get('lesson-types/me')
  listMyLessonTypes(@Req() req: AuthenticatedRequest) {
    return this.schedulingService.listMyLessonTypes(req.user);
  }

  @Get('lesson-types/teacher/:teacherId')
  listTeacherLessonTypes(@Param('teacherId') teacherId: string) {
    return this.schedulingService.listLessonTypesForTeacher(teacherId);
  }

  @Post('availability-slots')
  createAvailabilitySlot(
    @Req() req: AuthenticatedRequest,
    @Body() payload: { weekday: number; startTime: string; endTime: string }
  ) {
    return this.schedulingService.createAvailabilitySlot(req.user, payload);
  }

  @Get('availability-slots/me')
  listMyAvailabilitySlots(@Req() req: AuthenticatedRequest) {
    return this.schedulingService.listMyAvailabilitySlots(req.user);
  }

  @Get('availability-slots/teacher/:teacherId')
  listTeacherAvailabilitySlots(@Param('teacherId') teacherId: string) {
    return this.schedulingService.listAvailabilitySlotsForTeacher(teacherId);
  }

  @Delete('availability-slots/:slotId')
  deleteAvailabilitySlot(@Req() req: AuthenticatedRequest, @Param('slotId') slotId: string) {
    return this.schedulingService.deleteAvailabilitySlot(req.user, slotId);
  }

  @Delete('lesson-types/:lessonTypeId')
  deleteLessonType(
    @Req() req: AuthenticatedRequest,
    @Param('lessonTypeId') lessonTypeId: string
  ) {
    return this.schedulingService.deleteLessonType(req.user, lessonTypeId);
  }

  @Post('lessons/book')
  bookLesson(
    @Req() req: AuthenticatedRequest,
    @Body()
    payload: {
      teacherId: string;
      lessonTypeId: string;
      startsAtIso: string;
      endsAtIso: string;
      timezone: string;
    }
  ) {
    return this.schedulingService.bookLesson(req.user, payload);
  }

  @Get('lessons/me')
  listMyLessons(@Req() req: AuthenticatedRequest) {
    return this.schedulingService.listMyLessons(req.user);
  }

  @Patch('lessons/:lessonId/status')
  updateLessonStatus(
    @Req() req: AuthenticatedRequest,
    @Param('lessonId') lessonId: string,
    @Body() payload: { status: LessonStatus; cancellationReason?: string }
  ) {
    return this.schedulingService.updateLessonStatus(req.user, lessonId, payload);
  }
}
