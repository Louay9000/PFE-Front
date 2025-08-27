import { Platform } from "./platform";

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  platform: Platform
  link: string;
  startTime: Date;
  endTime: Date;

}
