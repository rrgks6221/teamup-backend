import { Image, ImageExtension } from '@module/image/entities/image.entity';

import { IBaseService } from '@common/base/base-service';

export const CREATE_IMAGE_UPLOAD_URL_SERVICE = Symbol(
  'ICreateImageUploadUrlService',
);

export interface ICreateImageUploadUrlCommandProps {
  extension: ImageExtension;
  contentLength: number;
  md5Hash: string;
}

export class CreateImageUploadUrlCommand {
  readonly extension: ImageExtension;
  readonly contentLength: number;
  readonly md5Hash: string;

  constructor(props: ICreateImageUploadUrlCommandProps) {
    this.extension = props.extension;
    this.contentLength = props.contentLength;
    this.md5Hash = props.md5Hash;
  }
}

export interface ICreateImageUploadUrlService
  extends IBaseService<CreateImageUploadUrlCommand, Image> {}
