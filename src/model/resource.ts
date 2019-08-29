import { JxxtApi } from '../api/jxxt';

export enum ResourceType {
  folder,
  file
}

export class Resource {
  // 文件的id
  fileId: string;

  // 文件夹的id
  folderId: string;

  // 文件的资源id
  resId: string;

  // 课程id
  lId: string;

  // 资源的名字
  name: string;

  // 文件真正的名字
  realName: string;

  // 资源的类型（文件或文件夹）
  type: ResourceType;

  get downloadUrl() {
    if (this.type === ResourceType.folder) {
      return null;
    }

    return `${JxxtApi.resourceDownloadUrl}?fileid=${this.fileId}&resid=${this.resId}&lid=${this.lId}`;
  }
}
