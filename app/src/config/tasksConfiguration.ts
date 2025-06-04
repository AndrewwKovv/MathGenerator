export interface ITask {
  id: number
  name: string
  view: string
  template: string
}

export interface IConfiguration {
  section: string
  section_name: string
  tasks: ITask[]
}

export const TASKS_CONFIGURATION: IConfiguration[] = [{}]
    
