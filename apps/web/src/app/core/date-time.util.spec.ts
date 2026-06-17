import { describe, expect, it } from 'vitest';
import { formatLessonWindow } from './date-time.util';

describe('formatLessonWindow', () => {
  it('joins start and end lesson times into one window label', () => {
    expect(formatLessonWindow('09:00', '09:45')).toBe('09:00 - 09:45');
  });
});
