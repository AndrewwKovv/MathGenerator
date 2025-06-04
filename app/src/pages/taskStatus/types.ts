export interface Group {
  id: number;
  name: string;
}

export interface Student {
  id: number;
  full_name: string;
  group: Group;
}

export interface TaskStatus {
  id: number;
  user: {
    id: number;
    full_name: string;
    group: {
      id: number;
      name: string;
    };
  } | null; // Если пользователь может быть null
  generated_task: {
    hash_code: string;
  };
  completed_at: string | null;
  time_spent: string | null;
  status: string;
}