export interface IAnnouncement {
  id?: string;
  title: string;
  description: string;
  sender: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnnouncementParams {
  title: string;
  description: string;
  sender: string;
}
