export type LessonStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type LessonNoteVisibility = 'teacher_private' | 'shared_with_student';

export interface LessonType {
  id: string;
  teacherProfileId: string;
  title: string;
  description?: string;
  durationMinutes: number;
  priceCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
}

export interface Lesson {
  id: string;
  teacherId: string;
  studentId: string;
  lessonTypeId: string;
  lessonType: LessonType;
  startsAt: string;
  endsAt: string;
  timezone: string;
  status: LessonStatus;
  meetingUrl?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface LessonNote {
  id: string;
  lessonId: string;
  authorId: string;
  visibility: LessonNoteVisibility;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
