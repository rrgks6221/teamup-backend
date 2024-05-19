import { Account, SignInType } from '@module/account/entities/account.entity';
import { AccountRaw } from '@module/account/repositories/account/account.repository.port';

export class AccountMapper {
  static toEntity(raw: AccountRaw): Account {
    return new Account({
      id: raw.id.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        username: raw.username ?? undefined,
        password: raw.password ?? undefined,
        signInType: SignInType[raw.signInType],
        nickname: raw.nickname,
      },
    });
  }

  static toPersistence(entity: Account): AccountRaw {
    return {
      id: BigInt(entity.id),
      username: entity.props.username ?? null,
      password: entity.props.password ?? null,
      signInType: entity.props.signInType,
      nickname: entity.props.nickname ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
