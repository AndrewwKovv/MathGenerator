export interface Topic {
  id: number;
  name: string;
  section_name: string;
}

export interface Task {
  id: number;
  title: string;
  view: string;
  data_task: string;
  topics: Topic[];
}