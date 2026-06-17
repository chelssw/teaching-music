import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AvailabilitySlot, Lesson, LessonStatus, LessonType } from './scheduling.models';
import { environment } from '../../../environments/environment';

const API = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class SchedulingService {
  private readonly http = inject(HttpClient);

  // --- Lesson types ---

  createLessonType(payload: {
    title: string;
    description?: string;
    durationMinutes: number;
    priceCents: number;
  }) {
    return this.http.post<LessonType>(`${API}/scheduling/lesson-types`, payload);
  }

  listMyLessonTypes() {
    return this.http.get<LessonType[]>(`${API}/scheduling/lesson-types/me`);
  }

  listTeacherLessonTypes(teacherId: string) {
    return this.http.get<LessonType[]>(`${API}/scheduling/lesson-types/teacher/${teacherId}`);
  }

  deleteLessonType(lessonTypeId: string) {
    return this.http.delete(`${API}/scheduling/lesson-types/${lessonTypeId}`);
  }

  // --- Availability slots ---

  createAvailabilitySlot(payload: { weekday: number; startTime: string; endTime: string }) {
    return this.http.post<AvailabilitySlot>(`${API}/scheduling/availability-slots`, payload);
  }

  listMyAvailabilitySlots() {
    return this.http.get<AvailabilitySlot[]>(`${API}/scheduling/availability-slots/me`);
  }

  listTeacherAvailabilitySlots(teacherId: string) {
    return this.http.get<AvailabilitySlot[]>(
      `${API}/scheduling/availability-slots/teacher/${teacherId}`
    );
  }

  deleteAvailabilitySlot(slotId: string) {
    return this.http.delete(`${API}/scheduling/availability-slots/${slotId}`);
  }

  // --- Lessons ---

  listMyLessons() {
    return this.http.get<Lesson[]>(`${API}/scheduling/lessons/me`);
  }

  bookLesson(payload: {
    teacherId: string;
    lessonTypeId: string;
    startsAtIso: string;
    endsAtIso: string;
    timezone: string;
  }) {
    return this.http.post<Lesson>(`${API}/scheduling/lessons/book`, payload);
  }

  updateLessonStatus(lessonId: string, status: LessonStatus, cancellationReason?: string) {
    return this.http.patch<Lesson>(`${API}/scheduling/lessons/${lessonId}/status`, {
      status,
      cancellationReason
    });
  }
}
