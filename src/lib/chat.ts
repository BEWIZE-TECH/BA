export interface Message {
  role: 'user' | 'ai';
  content: string;
  image_url?: string;
  ref?: string;
  is_artifact?: boolean;
  artifact_name?: string;
  attachedFileName?: string;
}