export type UserRole = 'teacher' | 'student';

export type LessonStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type PaymentStatus = 'created' | 'pending' | 'paid' | 'failed' | 'refunded';

export interface LessonSummary {
  id: string;
  teacherId: string;
  studentId: string;
  startsAtIso: string;
  endsAtIso: string;
  status: LessonStatus;
}

export interface AvailabilitySlot {
  id: string;
  teacherProfileId: string;
  weekday: number;
  startTime: string;
  endTime: string;
}

export interface PracticeSubmissionSummary {
  id: string;
  studentId: string;
  lessonId: string | null;
  audioFileName: string;
  status: 'submitted' | 'reviewed';
}
