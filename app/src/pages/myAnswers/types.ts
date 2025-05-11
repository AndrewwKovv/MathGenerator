export interface Answer {
  id: number; // Уникальный идентификатор ответа
  created_at: string; // Дата создания ответа
  update_at: string; // Дата последнего обновления ответа
  name: string; // Текст ответа
}

export interface Task {
  id: number; // Уникальный идентификатор задания
  title: string; // Название задания
  data_task: string; // Данные задания (например, описание или параметры)
  user_answer: string; // Ответ пользователя
}

export interface Answer {
  id: number; // Уникальный идентификатор ответа
  variant_code: string; // Код варианта
  variant_title: string; // Название варианта
  tasks: Task[]; // Список заданий, связанных с этим вариантом
  created_at: string; // Дата создания ответа
  update_at: string; // Дата последнего обновления ответа
}
