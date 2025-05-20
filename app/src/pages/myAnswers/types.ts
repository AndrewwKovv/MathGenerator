export interface GeneratedTask {
  id: number;
  hash_code: string;
  topic: {
    id: number;
    name: string;
    section_name: string;
    tasks: Task[];
  };
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  view: string;
  data_task: string;
  topics: {
    id: number;
    name: string;
    section_name: string;
  }[];
}

export interface TaskAnswer {
  taskId: number;
  answerText: string;
}

export interface Answer {
  id: number;
  user: string;
  full_name: string | null;
  generated_task: GeneratedTask; // Исправлено: теперь это объект
  task_answers: TaskAnswer[];
  created_at: string;
  generated_task_hash: string;
}