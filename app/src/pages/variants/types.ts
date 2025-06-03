// Интерфейс для задания
export interface Task {
  id: number; // Уникальный идентификатор задания
  title: string; // Название задания
  view: string; // Содержание задания (латех)
  topics: string | null; // Шаблон задания
}

// Интерфейс для варианта
export interface Variant {
  id: number; // Уникальный идентификатор варианта
  title: string; // Название варианта
  hash_code: string; // Хеш-код варианта
  topic: Topic; // Название темы
  tasks: Task[]; // Список заданий
}

export interface Topic {
  id: number;
  name: string;
  section_name: string;
}