// Интерфейс для задания
export interface Task {
  id: number; // Уникальный идентификатор задания
  title: string; // Название задания
  data_task: string; // Данные задания (например, описание или параметры)
  user_answer: string; // Ответ пользователя
}

// Интерфейс для ответа на задание
export interface TaskAnswer {
  id: number; // Уникальный идентификатор ответа на задание
  task: Task; // Связанное задание
  answer_text: string; // Текст ответа
}

// Интерфейс для ответа
export interface Answer {
  id: number; // Уникальный идентификатор ответа
  user: {
    id: number; // ID пользователя
    full_name: string; // ФИО пользователя
  };
  generated_task: {
    id: number; // ID варианта
    hash_code: string; // Хеш-код варианта
    topic: {
      id: number; // ID темы
      name: string; // Название темы
      section_name: string; // Название секции
    };
  };
  task_answers: TaskAnswer[]; // Список ответов на задания
  created_at: string; // Дата создания ответа
  updated_at: string; // Дата последнего обновления ответа
}
