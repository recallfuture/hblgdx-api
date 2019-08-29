import { Course } from './course';

export class Homework {
  // 作业id
  id: string;

  // 作业标题
  title: string;

  // 作业截至日期
  dateTime: string;

  // 作业成绩
  score: string;

  // 作业发布人
  publisher: string;

  // 作业统计链接
  countUrl: string;

  // 做作业链接
  submitUrl: string;

  // 作业结果链接
  resultUrl: string;

  // 所属的课程
  course: Course;

  // 作业详情
  detail: string;
}
