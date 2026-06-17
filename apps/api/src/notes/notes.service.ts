import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LessonNoteVisibility, UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedRequestUser {
  userId: string;
  role: UserRole;
}

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async createNote(
    user: AuthenticatedRequestUser,
    lessonId: string,
    payload: { title: string; content: string; visibility: LessonNoteVisibility }
  ) {
    if (user.role !== 'teacher') {
      throw new ForbiddenException('Only teachers can create notes.');
    }

    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found.');
    if (lesson.teacherId !== user.userId) {
      throw new ForbiddenException('You are not the teacher for this lesson.');
    }

    return this.prisma.lessonNote.create({
      data: {
        lessonId,
        authorId: user.userId,
        title: payload.title,
        content: payload.content,
        visibility: payload.visibility
      }
    });
  }

  async listNotesForLesson(user: AuthenticatedRequestUser, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found.');

    const isParticipant =
      lesson.teacherId === user.userId || lesson.studentId === user.userId;
    if (!isParticipant) {
      throw new ForbiddenException('You do not have access to this lesson.');
    }

    if (user.role === 'teacher') {
      return this.prisma.lessonNote.findMany({
        where: { lessonId, authorId: user.userId },
        orderBy: { createdAt: 'desc' }
      });
    }

    return this.prisma.lessonNote.findMany({
      where: { lessonId, visibility: 'shared_with_student' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateNote(
    user: AuthenticatedRequestUser,
    noteId: string,
    payload: { title?: string; content?: string; visibility?: LessonNoteVisibility }
  ) {
    if (user.role !== 'teacher') {
      throw new ForbiddenException('Only teachers can edit notes.');
    }

    const note = await this.prisma.lessonNote.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found.');
    if (note.authorId !== user.userId) {
      throw new ForbiddenException('You do not own this note.');
    }

    return this.prisma.lessonNote.update({
      where: { id: noteId },
      data: {
        ...(payload.title !== undefined && { title: payload.title }),
        ...(payload.content !== undefined && { content: payload.content }),
        ...(payload.visibility !== undefined && { visibility: payload.visibility })
      }
    });
  }

  async deleteNote(user: AuthenticatedRequestUser, noteId: string) {
    if (user.role !== 'teacher') {
      throw new ForbiddenException('Only teachers can delete notes.');
    }

    const note = await this.prisma.lessonNote.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found.');
    if (note.authorId !== user.userId) {
      throw new ForbiddenException('You do not own this note.');
    }

    return this.prisma.lessonNote.delete({ where: { id: noteId } });
  }
}
