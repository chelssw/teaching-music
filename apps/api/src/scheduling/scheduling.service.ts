import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { LessonStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedRequestUser {
  userId: string;
  role: UserRole;
}

@Injectable()
export class SchedulingService {
  constructor(private readonly prisma: PrismaService) {}

  async createLessonType(
    user: AuthenticatedRequestUser,
    payload: { title: string; description?: string; durationMinutes: number; priceCents: number }
  ) {
    this.assertRole(user.role, 'teacher');
    const teacherProfile = await this.ensureTeacherProfile(user.userId);

    return this.prisma.lessonType.create({
      data: {
        teacherProfileId: teacherProfile.id,
        title: payload.title,
        description: payload.description,
        durationMinutes: payload.durationMinutes,
        priceCents: payload.priceCents
      }
    });
  }

  async listMyLessonTypes(user: AuthenticatedRequestUser) {
    this.assertRole(user.role, 'teacher');
    const teacherProfile = await this.ensureTeacherProfile(user.userId);

    return this.prisma.lessonType.findMany({
      where: { teacherProfileId: teacherProfile.id },
      orderBy: { createdAt: 'desc' }
    });
  }

  async listLessonTypesForTeacher(teacherId: string) {
    const teacherProfile = await this.prisma.teacherProfile.findUnique({
      where: { userId: teacherId }
    });
    if (!teacherProfile) {
      throw new NotFoundException('Teacher profile was not found.');
    }

    return this.prisma.lessonType.findMany({
      where: { teacherProfileId: teacherProfile.id },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createAvailabilitySlot(
    user: AuthenticatedRequestUser,
    payload: { weekday: number; startTime: string; endTime: string }
  ) {
    this.assertRole(user.role, 'teacher');
    if (payload.weekday < 0 || payload.weekday > 6) {
      throw new BadRequestException('weekday must be between 0 and 6.');
    }

    const teacherProfile = await this.ensureTeacherProfile(user.userId);
    return this.prisma.availabilitySlot.create({
      data: {
        teacherProfileId: teacherProfile.id,
        weekday: payload.weekday,
        startTime: payload.startTime,
        endTime: payload.endTime
      }
    });
  }

  async listMyAvailabilitySlots(user: AuthenticatedRequestUser) {
    this.assertRole(user.role, 'teacher');
    const teacherProfile = await this.ensureTeacherProfile(user.userId);

    return this.prisma.availabilitySlot.findMany({
      where: { teacherProfileId: teacherProfile.id, isActive: true },
      orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }]
    });
  }

  async bookLesson(
    user: AuthenticatedRequestUser,
    payload: {
      teacherId: string;
      lessonTypeId: string;
      startsAtIso: string;
      endsAtIso: string;
      timezone: string;
    }
  ) {
    this.assertRole(user.role, 'student');
    await this.ensureStudentProfile(user.userId);

    const teacher = await this.prisma.user.findUnique({ where: { id: payload.teacherId } });
    if (!teacher || teacher.role !== 'teacher') {
      throw new NotFoundException('Teacher was not found.');
    }

    const lessonType = await this.prisma.lessonType.findUnique({
      where: { id: payload.lessonTypeId },
      include: { teacherProfile: true }
    });
    if (!lessonType || lessonType.teacherProfile.userId !== payload.teacherId) {
      throw new BadRequestException('Invalid lesson type for selected teacher.');
    }

    const startsAt = new Date(payload.startsAtIso);
    const endsAt = new Date(payload.endsAtIso);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || startsAt >= endsAt) {
      throw new BadRequestException('Invalid lesson time window.');
    }

    await this.assertNoConflicts(payload.teacherId, user.userId, startsAt, endsAt);

    return this.prisma.lesson.create({
      data: {
        teacherId: payload.teacherId,
        studentId: user.userId,
        lessonTypeId: payload.lessonTypeId,
        startsAt,
        endsAt,
        timezone: payload.timezone,
        status: 'pending'
      }
    });
  }

  async listMyLessons(user: AuthenticatedRequestUser) {
    const where =
      user.role === 'teacher' ? { teacherId: user.userId } : { studentId: user.userId };

    return this.prisma.lesson.findMany({
      where,
      orderBy: { startsAt: 'asc' },
      include: {
        lessonType: true
      }
    });
  }

  async updateLessonStatus(
    user: AuthenticatedRequestUser,
    lessonId: string,
    payload: { status: LessonStatus; cancellationReason?: string }
  ) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException('Lesson was not found.');
    }

    const isParticipant = lesson.teacherId === user.userId || lesson.studentId === user.userId;
    if (!isParticipant) {
      throw new ForbiddenException('You do not have access to this lesson.');
    }

    if (payload.status === 'cancelled' && !payload.cancellationReason?.trim()) {
      throw new BadRequestException('Cancellation reason is required when cancelling.');
    }

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: payload.status,
        cancellationReason: payload.status === 'cancelled' ? payload.cancellationReason : null
      }
    });
  }

  async listAvailabilitySlotsForTeacher(teacherId: string) {
    const teacherProfile = await this.prisma.teacherProfile.findUnique({
      where: { userId: teacherId }
    });
    if (!teacherProfile) {
      throw new NotFoundException('Teacher profile was not found.');
    }
    return this.prisma.availabilitySlot.findMany({
      where: { teacherProfileId: teacherProfile.id, isActive: true },
      orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }]
    });
  }

  async deleteAvailabilitySlot(user: AuthenticatedRequestUser, slotId: string) {
    this.assertRole(user.role, 'teacher');
    const slot = await this.prisma.availabilitySlot.findUnique({ where: { id: slotId } });
    if (!slot) throw new NotFoundException('Availability slot not found.');
    const teacherProfile = await this.ensureTeacherProfile(user.userId);
    if (slot.teacherProfileId !== teacherProfile.id) {
      throw new ForbiddenException('You do not own this availability slot.');
    }
    return this.prisma.availabilitySlot.delete({ where: { id: slotId } });
  }

  async deleteLessonType(user: AuthenticatedRequestUser, lessonTypeId: string) {
    this.assertRole(user.role, 'teacher');
    const lt = await this.prisma.lessonType.findUnique({ where: { id: lessonTypeId } });
    if (!lt) throw new NotFoundException('Lesson type not found.');
    const teacherProfile = await this.ensureTeacherProfile(user.userId);
    if (lt.teacherProfileId !== teacherProfile.id) {
      throw new ForbiddenException('You do not own this lesson type.');
    }
    return this.prisma.lessonType.delete({ where: { id: lessonTypeId } });
  }

  private async assertNoConflicts(
    teacherId: string,
    studentId: string,
    startsAt: Date,
    endsAt: Date
  ) {
    const conflictingLessons = await this.prisma.lesson.findMany({
      where: {
        status: { not: 'cancelled' },
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
        OR: [{ teacherId }, { studentId }]
      },
      select: { id: true }
    });

    if (conflictingLessons.length > 0) {
      throw new BadRequestException('The requested lesson time conflicts with an existing lesson.');
    }
  }

  private assertRole(actual: UserRole, expected: UserRole) {
    if (actual !== expected) {
      throw new ForbiddenException(`Only ${expected}s can perform this action.`);
    }
  }

  private async ensureTeacherProfile(userId: string) {
    return this.prisma.teacherProfile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        timezone: 'UTC'
      }
    });
  }

  private async ensureStudentProfile(userId: string) {
    return this.prisma.studentProfile.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        timezone: 'UTC'
      }
    });
  }
}
