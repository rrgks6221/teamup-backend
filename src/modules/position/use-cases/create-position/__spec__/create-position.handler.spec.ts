import { Test, TestingModule } from '@nestjs/testing';

import { PositionFactory } from '@module/position/entities/__spec__/position.factory';
import { PositionAlreadyExistsError } from '@module/position/errors/position-already-exists.error';
import { PositionRepositoryModule } from '@module/position/repositories/position.repository.module';
import {
  POSITION_REPOSITORY,
  PositionRepositoryPort,
} from '@module/position/repositories/position.repository.port';
import { CreatePositionCommandFactory } from '@module/position/use-cases/create-position/__spec__/create-position-command.factory';
import { CreatePositionCommand } from '@module/position/use-cases/create-position/create-position.command';
import { CreatePositionHandler } from '@module/position/use-cases/create-position/create-position.handler';

describe(CreatePositionHandler.name, () => {
  let handler: CreatePositionHandler;

  let positionRepository: PositionRepositoryPort;

  let command: CreatePositionCommand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PositionRepositoryModule],
      providers: [CreatePositionHandler],
    }).compile();

    handler = module.get<CreatePositionHandler>(CreatePositionHandler);
    positionRepository =
      module.get<PositionRepositoryPort>(POSITION_REPOSITORY);
  });

  beforeEach(() => {
    command = CreatePositionCommandFactory.build();
  });

  describe('이름이 동일한 포지션이 존재하지 않고', () => {
    describe('포지션을 생성하면', () => {
      it('포지션이 생성된다.', async () => {
        await expect(handler.execute(command)).resolves.toEqual(
          expect.objectContaining({
            name: command.name,
          }),
        );
      });
    });
  });

  describe('이름이 동일한 포지션이 존재하는 경우', () => {
    beforeEach(async () => {
      await positionRepository.insert(
        PositionFactory.build({ name: command.name }),
      );
    });

    describe('포지션을 생성하면', () => {
      it('이미 포지션이 존재한다는 에러가 발생한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(
          PositionAlreadyExistsError,
        );
      });
    });
  });
});
