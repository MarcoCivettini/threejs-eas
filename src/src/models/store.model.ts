export interface GameStore {
  messages: Message[];
  addNewMessage: (message: Message) => void;
}

export interface Message {
  userName: string;
  message: string;
}