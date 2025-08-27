import { User } from "./User";

export interface ChatMessage {
  id:number;
  content: string;
  sender: User;   // username de l’émetteur
  receiver: User; // username du destinataire
}
