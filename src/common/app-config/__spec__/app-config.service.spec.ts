import { Test, TestingModule } from '@nestjs/testing';

import { AppConfigModule } from '@common/app-config/app-config.module';
import { AppConfigService } from '@common/app-config/app-config.service';

describe(AppConfigService.name, () => {
  let service: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppConfigModule],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  describe(AppConfigService.prototype.get.name, () => {
    describe('존재하는 환경변수를 가져오면', () => {
      it('환경변수를 가져와야한다.', () => {
        expect(service.get('APP_STAGE')).not.toBeUndefined();
      });
    });

    describe('존재하지 않는 환경변수를 가져오면', () => {
      it('환경변수가 존재하지 않는다.', () => {
        expect(service.get('NOT_EXIST_ENV' as any)).toBeUndefined();
      });
    });
  });
});
