export interface IGeneratedTaskData {
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
  training_key: string | null;
}