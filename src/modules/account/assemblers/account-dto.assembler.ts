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

    return dto;
  }
}
