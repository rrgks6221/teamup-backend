import { ICommand } from '@nestjs/cqrs';

import { ImageExtension } from '@module/image/entities/image.entity';

export interface ICreateImageUploadUrlCommandProps {
  extension: ImageExtension;
  contentLength: number;
  md5Hash: string;
}

export class CreateImageUploadUrlCommand implements ICommand {
  readonly extension: ImageExtension;
  readonly contentLength: number;
  readonly md5Hash: string;

  constructor(props: ICreateImageUploadUrlCommandProps) {
    this.extension = props.extension;
    this.contentLength = props.contentLength;
    this.md5Hash = props.md5Hash;
  }
}
