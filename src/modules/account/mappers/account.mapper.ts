import {
  AccountSnsLink,
  AccountSnsLinkVisibilityScope,
} from '@module/account/entities/account-sns-link.vo';
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
        profileImagePath: raw.profileImagePath ?? undefined,
        positionNames: [...raw.positionNames],
        techStackNames: [...raw.techStackNames],
        snsLinks: raw.snsLinks.map(
          (snsLink) =>
            new AccountSnsLink({
              url: snsLink.url,
              platform: snsLink.platform,
              visibilityScope:
                AccountSnsLinkVisibilityScope[snsLink.visibilityScope],
            }),
        ),
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
      profileImagePath: entity.props.profileImagePath ?? null,
      positionNames: entity.props.positionNames,
      techStackNames: entity.props.techStackNames,
      snsLinks: entity.props.snsLinks.map((snsLink) => ({
        url: snsLink.url,
        platform: snsLink.platform,
        visibilityScope: snsLink.visibilityScope,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
