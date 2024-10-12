import {
  Account,
  AccountRole,
  SignInType,
} from '@module/account/entities/account.entity';
import { AccountRaw } from '@module/account/repositories/account/account.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class AccountMapper extends BaseMapper {
  static toEntity(raw: AccountRaw): Account {
    return new Account({
      id: raw.id.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        username: raw.username ?? undefined,
        password: raw.password ?? undefined,
        signInType: SignInType[raw.signInType],
        role: AccountRole[raw.role],
        name: raw.name,
        introduce: raw.introduce ?? undefined,
        positionNames: [...raw.positionNames],
        techStackNames: [...raw.techStackNames],
      },
    });
  }

  static toPersistence(entity: Account): AccountRaw {
    return {
      id: BigInt(entity.id),
      username: entity.props.username ?? null,
      password: entity.props.password ?? null,
      signInType: entity.props.signInType,
      role: entity.props.role,
      name: entity.props.name ?? null,
      introduce: entity.props.introduce ?? null,
      positionNames: entity.props.positionNames,
      techStackNames: entity.props.techStackNames,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
