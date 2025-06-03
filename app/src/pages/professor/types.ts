import { type TASKS_CONFIGURATION } from 'config';

export interface ITemplateProps {
  template: typeof TASKS_CONFIGURATION[0]['tasks'][0]
}

export interface Topic {
  id: number;
  name: string;
  section_name: string;
}

export interface Task {
  id: number;
  title: string;
  view: string;
  topics?: Topic[];
}