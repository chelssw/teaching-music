import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { LessonNoteVisibility, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotesService } from './notes.service';

interface AuthenticatedRequest {
  user: { userId: string; role: UserRole };
}

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('lessons/:lessonId')
  createNote(
    @Req() req: AuthenticatedRequest,
    @Param('lessonId') lessonId: string,
    @Body() payload: { title: string; content: string; visibility: LessonNoteVisibility }
  ) {
    return this.notesService.createNote(req.user, lessonId, payload);
  }

  @Get('lessons/:lessonId')
  listNotesForLesson(
    @Req() req: AuthenticatedRequest,
    @Param('lessonId') lessonId: string
  ) {
    return this.notesService.listNotesForLesson(req.user, lessonId);
  }

  @Patch(':noteId')
  updateNote(
    @Req() req: AuthenticatedRequest,
    @Param('noteId') noteId: string,
    @Body() payload: { title?: string; content?: string; visibility?: LessonNoteVisibility }
  ) {
    return this.notesService.updateNote(req.user, noteId, payload);
  }

  @Delete(':noteId')
  deleteNote(@Req() req: AuthenticatedRequest, @Param('noteId') noteId: string) {
    return this.notesService.deleteNote(req.user, noteId);
  }
}
