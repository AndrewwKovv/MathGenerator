// Интерфейс для задания
export interface Task {
  id: number; // Уникальный идентификатор задания
  title: string; // Название задания
  view: string; // Содержание задания (латех)
  template: string | null; // Шаблон задания
}

// Интерфейс для темы
export interface Topic {
  id: number; // Уникальный идентификатор темы
  name: string; // Название темы
  section_name: string; // Название секции
  tasks: Task[]; // Список заданий
}