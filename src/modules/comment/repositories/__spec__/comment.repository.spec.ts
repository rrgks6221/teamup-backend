import { Test, TestingModule } from '@nestjs/testing';

import { CommentFactory } from '@module/comment/entities/__spec__/comment.factory';
import {
  Comment,
  CommentPostType,
} from '@module/comment/entities/comment.entity';
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

  describe(CommentRepository.prototype.findAllCursorPaginated.name, () => {
    let postId: string;
    let comments: Comment[];

    beforeAll(async () => {
      postId = generateEntityId();

      comments = await Promise.all(
        [
          CommentFactory.build({ postType: CommentPostType.recruitmentPost }),
          CommentFactory.build({
            postId: postId,
            postType: CommentPostType.recruitmentPost,
          }),
          CommentFactory.build({
            postId: postId,
            postType: CommentPostType.recruitmentPost,
          }),
        ].map((comment) => repository.insert(comment)),
      );
    });

    describe('게시글 식별자로 필터링 하는 경우', () => {
      it('게시글 식별자와 일치하는 게시글 댓글만 반환해야한다.', async () => {
        const result = await repository.findAllCursorPaginated({
          filter: {
            postType: CommentPostType.recruitmentPost,
            postId: postId,
          },
        });

        expect(result.data.length).toBeGreaterThanOrEqual(2);
        expect(result.data).toSatisfyAll<Comment>(
          (comment) => comment.postId === postId,
        );
      });
    });

    describe('정렬 옵션이 존재하지 않는 경우', () => {
      it('기본 정렬인 id로 정렬된 게시글 댓글 목록이 반환돼야한다.', async () => {
        const result = await repository.findAllCursorPaginated({});

        expect(result.data.length).toBeGreaterThanOrEqual(1);
        expect(result.data).toEqual(
          [...result.data].sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            }
            if (a.id < b.id) {
              return -1;
            }
            return 0;
          }),
        );
      });
    });

    describe('커서가 존재하는 경우', () => {
      it('커서 이후의 게시글 댓글 목록만 반환해야한다.', async () => {
        const cursor = comments[0].id;
        const result = await repository.findAllCursorPaginated({
          cursor,
        });

        expect(result.data.length).toBeGreaterThanOrEqual(1);
        expect(result.data).toSatisfyAll<Comment>((el) => el.id > cursor);
      });
    });

    describe('다음 커서가 존재하지 않는 경우', () => {
      it('게시글 댓글 목록만 반환해야한다.', async () => {
        const result = await repository.findAllCursorPaginated({
          limit: 10000,
        });

        expect(result.cursor).toBeUndefined();
        expect(result.data.length).toBeGreaterThanOrEqual(1);
        expect(result.data).toBeArray();
      });
    });

    describe('다음 커서가 존재하는 경우', () => {
      it('커서를 포함한 게시글 댓글 목록을 반환해야한다.', async () => {
        const result = await repository.findAllCursorPaginated({
          limit: 1,
        });

        expect(result.cursor).toBeDefined();
        expect(result.data.length).toBeGreaterThanOrEqual(1);
        expect(result.data).toBeArrayOfSize(1);
      });
    });
  });
});
