export interface Topic {
  id: number;
  name: string;
  section_name: string;
}

export interface TaskAnswer {
  taskId: number;
  answerText: string;
}

export interface Answer {
  id: number;
  user: string | null;
  full_name: string | null;
  generated_task: number; // ID варианта
  task_answers: TaskAnswer[];
  created_at: string; // Дата создания в формате ISO
  generated_task_hash: string;
}
