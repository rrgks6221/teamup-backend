import { ImageValidationError } from '@module/image/errors/image-validation.error';

import {
  BaseEntity,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export enum ImageExtension {
  jpg = 'jpg',
  jpeg = 'jpeg',
  png = 'png',
}

export interface PreUploadInfo {
  uploadUrlExpiresIn: number;
  uploadUrl: string;
  uploadMethod: string;
  uploadedUrl: string;
}

export interface ImageProps {
  extension: ImageExtension;
  contentLength: number;
  md5Hash: string;
  preUploadInfo?: PreUploadInfo;
}

interface CreateImageProps {
  extension: ImageExtension;
  contentLength: number;
  md5Hash: string;
}

export class Image extends BaseEntity<ImageProps> {
  static readonly PRE_UPLOAD_PREFIX = 'pre-upload';
  static readonly MAX_SIZE_IN_BYTE = 20 * 1024 * 1024; // 20MB

  constructor(props: CreateEntityProps<ImageProps>) {
    super(props);
  }

  static create(createImageProps: CreateImageProps) {
    const id = generateEntityId();
    const date = new Date();

    return new Image({
      id,
      props: {
        extension: createImageProps.extension,
        contentLength: createImageProps.contentLength,
        md5Hash: createImageProps.md5Hash,
      },
      createdAt: date,
      updatedAt: date,
    });
  }

  get name() {
    return `${this.id}.${this.extension}`;
  }

  get extension() {
    return this.props.extension;
  }

  get contentType() {
    return `image/${this.props.extension}` as const;
  }

  get contentLength() {
    return this.props.contentLength;
  }

  get md5Hash() {
    return this.props.md5Hash;
  }

  get preUploadInfo(): PreUploadInfo | undefined {
    return this.props.preUploadInfo;
  }
  set preUploadInfo(value: PreUploadInfo) {
    this.props.preUploadInfo = {
      uploadUrlExpiresIn: value.uploadUrlExpiresIn,
      uploadUrl: value.uploadUrl,
      uploadMethod: value.uploadMethod,
      uploadedUrl: value.uploadedUrl,
    };
  }

  public validate(): void {
    if (ImageExtension[this.props.extension] === undefined) {
      throw new ImageValidationError('Image extensions not allowed');
    }

    if (this.props.contentLength > Image.MAX_SIZE_IN_BYTE) {
      throw new ImageValidationError(
        'Maximum allowed image size has been exceeded',
      );
    }
  }
}
