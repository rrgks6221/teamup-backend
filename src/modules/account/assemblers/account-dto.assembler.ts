import { AccountResponseDto } from '@module/account/dto/account.response-dto';
import { Account } from '@module/account/entities/account.entity';

export class AccountDtoAssembler {
  static convertToDto(account: Account): AccountResponseDto {
    const dto = new AccountResponseDto({
      id: account.id,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });

    dto.name = account.name;
    dto.introduce = account.introduce ?? null;
    dto.profileImageUrl = account.profileImageUrl ?? null;
    dto.positionNames = account.positionNames;
    dto.techStackNames = account.techStackNames;
    dto.snsLinks = account.snsLinks.map((snsLink) => ({
      url: snsLink.url,
      platform: snsLink.platform,
      visibilityScope: snsLink.visibilityScope,
    }));

    return dto;
  }
}
