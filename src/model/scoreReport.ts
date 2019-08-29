import { Score } from './score';
export class ScoreReport {
  // 姓名
  name: string;

  // 学号
  number: string;

  // 系所
  departmentName: string;

  // 班级
  className: string;

  // 成绩数组
  scores: Score[];
}
