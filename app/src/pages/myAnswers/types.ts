// Task внутри GeneratedTask
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

// GeneratedTask (входит в Answer)
export interface GeneratedTask {
  id: number;
  title: string;
  hash_code: string;
  creator: {
    id: number;
    email: string;
    full_name: string;
  };
  recipients: {
    id: number;
    email: string;
    full_name: string;
  }[];
  topic: {
    id: number;
    name: string;
    section_name: string;
    tasks: Task[];
  };
  tasks: Task[];
  training_key: string | null;
}

// TaskAnswer — как в API: taskId и answerText
export interface TaskAnswer {
  taskId: number;
  answerText: string;
}

// Основной тип Answer (используется на странице)
export interface Answer {
  id: number;
  user: string; // email
  full_name: string | null;
  generated_task: GeneratedTask;
  task_answers: TaskAnswer[];
  created_at: string;
  generated_task_hash: string;
}
