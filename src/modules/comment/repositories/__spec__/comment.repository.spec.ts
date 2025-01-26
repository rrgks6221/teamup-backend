import { Test, TestingModule } from '@nestjs/testing';

import { CommentFactory } from '@module/comment/entities/__spec__/comment.factory';
import { Comment } from '@module/comment/entities/comment.entity';
import { CommentRepository } from '@module/comment/repositories/comment.repository';
import {
  COMMENT_REPOSITORY,
  CommentRepositoryPort,
} from '@module/comment/repositories/comment.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(CommentRepository.name, () => {
  let repository: CommentRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: COMMENT_REPOSITORY,
          useClass: CommentRepository,
        },
      ],
    }).compile();

    repository = module.get<CommentRepositoryPort>(COMMENT_REPOSITORY);
  });

  describe(CommentRepository.prototype.findOneById.name, () => {
    let commentId: string;

    beforeEach(() => {
      commentId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let comment: Comment;

      beforeEach(async () => {
        comment = await repository.insert(
          CommentFactory.build({ id: commentId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(commentId)).resolves.toEqual(
            comment,
          );
        });
      });
    });
  });
});
