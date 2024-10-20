export const AWS_S3_CLIENT = Symbol('S3Client');
export const AWS_S3_PORT = Symbol('AwsS3Port');

export interface GetUploadInfoDto {
  key: string;
  extension: string;
  contentType: string;
  contentLength: number;
  md5Hash: string;
}

export interface AwsS3UploadInfoDto {
  extension: string;
  contentType: string;
  contentLength: number;
  md5Hash: string;
  uploadUrlExpiresIn: number;
  uploadUrl: string;
  uploadMethod: string;
  uploadedUrl: string;
}

export interface AwsS3Port {
  getUploadUrlInfo(
    getUploadInfoDto: GetUploadInfoDto,
  ): Promise<AwsS3UploadInfoDto>;
}
