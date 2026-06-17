import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LessonNote, LessonNoteVisibility } from '../scheduling/scheduling.models';
import { environment } from '../../../environments/environment';

const API = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly http = inject(HttpClient);

  listNotesForLesson(lessonId: string) {
    return this.http.get<LessonNote[]>(`${API}/notes/lessons/${lessonId}`);
  }

  createNote(
    lessonId: string,
    payload: { title: string; content: string; visibility: LessonNoteVisibility }
  ) {
    return this.http.post<LessonNote>(`${API}/notes/lessons/${lessonId}`, payload);
  }

  updateNote(
    noteId: string,
    payload: { title?: string; content?: string; visibility?: LessonNoteVisibility }
  ) {
    return this.http.patch<LessonNote>(`${API}/notes/${noteId}`, payload);
  }

  deleteNote(noteId: string) {
    return this.http.delete(`${API}/notes/${noteId}`);
  }
}
