import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  inject,
  input,
  signal
} from '@angular/core';
import { NotesService } from '../../../../core/notes/notes.service';
import { LessonNote, LessonNoteVisibility } from '../../../../core/scheduling/scheduling.models';
import { AppButtonComponent } from '../../atoms/app-button/app-button.component';
import { AppInputComponent } from '../../atoms/app-input/app-input.component';
import { AppSelectComponent } from '../../atoms/app-select/app-select.component';
import { AppTextareaComponent } from '../../atoms/app-textarea/app-textarea.component';
import { NoteCardComponent } from '../../molecules/note-card/note-card.component';
import { SelectOption } from '../../atoms/app-select/app-select.component';

@Component({
  selector: 'lesson-notes-panel',
  standalone: true,
  imports: [
    NoteCardComponent,
    AppButtonComponent,
    AppInputComponent,
    AppTextareaComponent,
    AppSelectComponent
  ],
  templateUrl: './lesson-notes-panel.component.html',
  styleUrl: './lesson-notes-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonNotesPanelComponent implements OnChanges {
  private readonly notesService = inject(NotesService);

  readonly lessonId = input.required<string>();
  readonly userRole = input.required<'teacher' | 'student'>();

  readonly notes = signal<LessonNote[]>([]);
  readonly loading = signal(false);
  readonly showForm = signal(false);
  readonly editingNote = signal<LessonNote | null>(null);

  readonly formTitle = signal('');
  readonly formContent = signal('');
  readonly formVisibility = signal<LessonNoteVisibility>('teacher_private');

  readonly visibilityOptions: SelectOption[] = [
    { value: 'teacher_private', label: 'Private (teacher only)' },
    { value: 'shared_with_student', label: 'Share with student' }
  ];

  ngOnChanges() {
    this.loadNotes();
  }

  loadNotes() {
    this.loading.set(true);
    this.notesService.listNotesForLesson(this.lessonId()).subscribe({
      next: (notes) => { this.notes.set(notes); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openAddForm() {
    this.editingNote.set(null);
    this.formTitle.set('');
    this.formContent.set('');
    this.formVisibility.set('teacher_private');
    this.showForm.set(true);
  }

  openEditForm(note: LessonNote) {
    this.editingNote.set(note);
    this.formTitle.set(note.title);
    this.formContent.set(note.content);
    this.formVisibility.set(note.visibility);
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingNote.set(null);
  }

  saveNote() {
    const payload = {
      title: this.formTitle(),
      content: this.formContent(),
      visibility: this.formVisibility()
    };

    const editing = this.editingNote();
    if (editing) {
      this.notesService.updateNote(editing.id, payload).subscribe({
        next: () => { this.showForm.set(false); this.editingNote.set(null); this.loadNotes(); }
      });
    } else {
      this.notesService.createNote(this.lessonId(), payload).subscribe({
        next: () => { this.showForm.set(false); this.loadNotes(); }
      });
    }
  }

  onDeleteNote(noteId: string) {
    this.notesService.deleteNote(noteId).subscribe({
      next: () => this.loadNotes()
    });
  }

  setVisibility(value: string) {
    this.formVisibility.set(value as LessonNoteVisibility);
  }
}
