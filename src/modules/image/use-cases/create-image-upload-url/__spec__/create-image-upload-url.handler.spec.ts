import { Test, TestingModule } from '@nestjs/testing';

import { faker } from '@faker-js/faker';

import { Image } from '@module/image/entities/image.entity';
import { CreateImageUploadUrlCommandFactory } from '@module/image/use-cases/create-image-upload-url/__spec__/create-image-upload-url-command.factory';
import { CreateImageUploadUrlCommand } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.command';
import { CreateImageUploadUrlHandler } from '@module/image/use-cases/create-image-upload-url/create-image-upload-url.handler';

import { AppConfigModule } from '@common/app-config/app-config.module';

import { AwsS3Module } from '@shared/services/aws-s3/aws-s3.module';
import {
  AWS_S3_PORT,
  AwsS3Port,
  AwsS3UploadInfoDto,
} from '@shared/services/aws-s3/aws-s3.port';

describe(CreateImageUploadUrlHandler.name, () => {
  let handler: CreateImageUploadUrlHandler;

  let awsS3Adapter: AwsS3Port;

  let command: CreateImageUploadUrlCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AwsS3Module, AppConfigModule],
      providers: [CreateImageUploadUrlHandler],
    }).compile();

    handler = module.get<CreateImageUploadUrlHandler>(
      CreateImageUploadUrlHandler,
    );

    awsS3Adapter = module.get(AWS_S3_PORT);
  });

  beforeEach(() => {
    command = CreateImageUploadUrlCommandFactory.build();

    jest.spyOn(awsS3Adapter, 'getUploadUrlInfo').mockResolvedValue({
      uploadUrlExpiresIn: faker.number.int(),
      uploadUrl: faker.internet.url(),
      uploadMethod: 'PUT',
      uploadedUrl: faker.internet.url(),
    } as AwsS3UploadInfoDto);
  });

  describe('이미지 업로드 url을 생성하면', () => {
    it('이미지 정보를 반환해야한다.', async () => {
      const result = await handler.execute(command);

      expect(result).toBeInstanceOf(Image);
      expect(result).toEqual(
        expect.objectContaining({
          extension: command.extension,
          contentLength: command.contentLength,
          md5Hash: command.md5Hash,
          preUploadInfo: {
            uploadUrlExpiresIn: expect.any(Number),
            uploadUrl: expect.any(String),
            uploadMethod: expect.any(String),
            uploadedUrl: expect.any(String),
          },
        }),
      );
    });
  });
});
