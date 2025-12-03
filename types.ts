
export enum Screen {
  Welcome,
  SelectConsultant,
  Chat,
  Settings,
  Journal,
  ActionItems,
}

export interface Consultant {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  systemInstruction: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}
