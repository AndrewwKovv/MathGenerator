export interface GeneratedTask {
  id: number;
  title: string; // Название варианта
  hash_code: string; // Хеш-код варианта
  topic: {
    id: number;
    name: string;
    section_name: string;
    tasks: Task[];
  };
  tasks: Task[];
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  generated_task?: GeneratedTask; // Связанный вариант, содержащий хеш
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
  title: string; // Название задания
  data_task: string;
  answerText: string;
}

export interface Answer {
  id: number;
  user: string;
  full_name: string | null;
  generated_task: GeneratedTask; // Связанный объект варианта
  task_answers: TaskAnswer[];
  created_at: string;
  generated_task_hash: string;
}