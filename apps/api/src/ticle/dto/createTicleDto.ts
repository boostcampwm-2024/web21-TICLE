export type CreateTicleDto = {
  speakerName: string;
  speakerEmail: string;
  speakerIntroduce: string;
  title: string;
  content: string;
  startTime: Date;
  endTime: Date;
  tags?: string[];
};
