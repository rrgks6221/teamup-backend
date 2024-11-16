import { exec } from 'child_process';
import { Command } from 'commander';
import { writeFileSync } from 'fs';
import path from 'path';
import camelCase from 'to-camel-case';
import pascalCase from 'to-pascal-case';
import snakeCase from 'to-snake-case';

const program = new Command();

const runCommand = (command: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
};

const createdFiles: string[] = [];

const generateDirs = async (rootDir: string) => {
  const dirs = [
    rootDir,
    path.join(rootDir, 'use-cases'),
    path.join(rootDir, 'assemblers'),
    path.join(rootDir, 'dto'),
    path.join(rootDir, 'entities'),
    path.join(rootDir, 'entities', '__spec__'),
    path.join(rootDir, 'mappers'),
    path.join(rootDir, 'repositories'),
    path.join(rootDir, 'repositories', '__spec__'),
  ];

  for await (const dirPath of dirs) {
    try {
      await runCommand(`mkdir ${dirPath}`);
      console.log(`generate dir ${dirPath}`);
    } catch (error) {
      console.log(`already exist dir ${dirPath}`);
    }
  }
};

const generateFile = (
  path: string,
  preset: string,
  dir: string,
  domain: string,
) => {
  const reconfigureFile = (preset: string, dir: string, domain: string) => {
    const REGEXP_MAP = [
      ['dir-name', dir],
      ['domain-name', domain],
      ['DomainName', pascalCase(domain)],
      ['domainName', camelCase(domain)],
      ['DOMAIN_NAME', snakeCase(domain).toUpperCase()],
    ];

    return REGEXP_MAP.reduce((acc, [key, value]) => {
      const regexp = new RegExp(key, 'gm');
      return acc.replace(regexp, value);
    }, preset);
  };

  try {
    writeFileSync(path, reconfigureFile(preset, dir, domain));
    createdFiles.push(path);
    console.log(`generate file ${path}`);
  } catch (error) {
    console.log(`already exist file ${path}`);
  }
};

const generateModule = async (dir: string) => {
  await runCommand(`nest g module ${dir} modules`).catch(() => {});
};

const generateAssembler = async (
  rootDir: string,
  dir: string,
  domain: string,
) => {
  const PRESET = `
import { DomainNameResponseDto } from '@module/dir-name/dto/domain-name.response-dto';
import { DomainName } from '@module/dir-name/entities/domain-name.entity';

export class DomainNameDtoAssembler {
  static convertToDto(domainName: DomainName): DomainNameResponseDto {
    const dto = new DomainNameResponseDto({
      id: domainName.id,
      createdAt: domainName.createdAt,
      updatedAt: domainName.updatedAt,
    });

    return dto;
  }
}
`;

  generateFile(
    `${rootDir}/assemblers/${domain}-dto.assembler.ts`,
    PRESET,
    dir,
    domain,
  );
};

const generateDto = async (rootDir: string, dir: string, domain: string) => {
  const PRESET = `
import { BaseResponseDto } from '@common/base/base.dto';

export class DomainNameResponseDto extends BaseResponseDto {}
`;

  generateFile(`${rootDir}/dto/${domain}.response-dto.ts`, PRESET, dir, domain);
};

const generateEntity = async (rootDir: string, dir: string, domain: string) => {
  const ENTITY_PRESET = `
import {
  BaseEntity,
  CreateEntityProps,
  generateEntityId,
} from '@common/base/base.entity';

export interface DomainNameProps {}

interface CreateDomainNameProps {}

export class DomainName extends BaseEntity<DomainNameProps> {
  constructor(props: CreateEntityProps<DomainNameProps>) {
    super(props);
  }

  static create(createDomainNameProps: CreateDomainNameProps) {
    const id = generateEntityId();
    const date = new Date();

    return new DomainName({
      id,
      props: {},
      createdAt: date,
      updatedAt: date,
    });
  }

  public validate(): void {}
}
`;

  const FACTORY_PRESET = `
import { faker } from '@faker-js/faker';
import { Factory } from 'rosie';

import {
  DomainName,
  DomainNameProps,
} from '@module/dir-name/entities/domain-name.entity';

import { generateEntityId } from '@common/base/base.entity';

export const DomainNameFactory = Factory.define<DomainName & DomainNameProps>(
  DomainName.name,
)
  .attrs({
    id: () => generateEntityId(),
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
  })
  .after(
    ({ id, createdAt, updatedAt, ...props }) =>
      new DomainName({ id, createdAt, updatedAt, props }),
  );
`;

  generateFile(
    `${rootDir}/entities/${domain}.entity.ts`,
    ENTITY_PRESET,
    dir,
    domain,
  );

  generateFile(
    `${rootDir}/entities/__spec__/${domain}.factory.ts`,
    FACTORY_PRESET,
    dir,
    domain,
  );
};

const generateMapper = async (rootDir: string, dir: string, domain: string) => {
  const PRESET = `
import { DomainName } from '@module/dir-name/entities/domain-name.entity';
import { DomainNameRaw } from '@module/dir-name/repositories/domain-name.repository.port';

import { BaseMapper } from '@common/base/base.mapper';

export class DomainNameMapper extends BaseMapper {
  static toEntity(raw: DomainNameRaw): DomainName {
    return new DomainName({
      id: this.toEntityId(raw.id),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {},
    });
  }

  static toPersistence(entity: DomainName): DomainNameRaw {
    return {
      id: this.toPrimaryKey(entity.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
`;

  generateFile(`${rootDir}/mappers/${domain}.mapper.ts`, PRESET, dir, domain);
};

const generateRepository = async (
  rootDir: string,
  dir: string,
  domain: string,
) => {
  const MODULE_PRESET = `
import { Module } from '@nestjs/common';

import { DomainNameRepository } from '@module/dir-name/repositories/domain-name.repository';
import { DOMAIN_NAME_REPOSITORY } from '@module/dir-name/repositories/domain-name.repository.port';

import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: DOMAIN_NAME_REPOSITORY,
      useClass: DomainNameRepository,
    },
  ],
  exports: [DOMAIN_NAME_REPOSITORY],
})
export class DomainNameRepositoryModule {}
`;

  const PORT_PRESET = `
// import { DomainName as DomainNameModel } from '@prisma/client';

import { DomainName } from '@module/dir-name/entities/domain-name.entity';

import { RepositoryPort } from '@common/base/base.repository';

export const DOMAIN_NAME_REPOSITORY = Symbol('DOMAIN_NAME_REPOSITORY');

// export interface DomainNameRaw extends DomainNameModel {}
export interface DomainNameRaw {
  id: bigint;
  createdAt: Date;
  updatedAt: Date;
}

export interface DomainNameFilter {}

export interface DomainNameRepositoryPort
  extends RepositoryPort<DomainName, DomainNameFilter> {}
`;

  const REPOSITORY_PRESET = `
import { Inject, Injectable } from '@nestjs/common';

import { DomainName } from '@module/dir-name/entities/domain-name.entity';
import { DomainNameMapper } from '@module/dir-name/mappers/domain-name.mapper';
import {
  DomainNameFilter,
  DomainNameRaw,
  DomainNameRepositoryPort,
} from '@module/dir-name/repositories/domain-name.repository.port';

import {
  BaseRepository,
  ICursorPaginated,
  ICursorPaginatedParams,
} from '@common/base/base.repository';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class DomainNameRepository
  extends BaseRepository<DomainName, DomainNameRaw>
  implements DomainNameRepositoryPort
{
  protected TABLE_NAME = 'domainName';

  constructor(
    @Inject(PRISMA_SERVICE) protected readonly prismaService: PrismaService,
  ) {
    super(prismaService, DomainNameMapper);
  }

  findAllCursorPaginated(
    params: ICursorPaginatedParams<DomainName, DomainNameFilter>,
  ): Promise<ICursorPaginated<DomainName>> {
    throw new Error('Method not implemented.');
  }
}
`;

  const SPEC_PRESET = `
import { Test, TestingModule } from '@nestjs/testing';

import { DomainNameFactory } from '@module/dir-name/entities/__spec__/domain-name.factory';
import { DomainName } from '@module/dir-name/entities/domain-name.entity';
import { DomainNameRepository } from '@module/dir-name/repositories/domain-name.repository';
import {
  DOMAIN_NAME_REPOSITORY,
  DomainNameRepositoryPort,
} from '@module/dir-name/repositories/domain-name.repository.port';

import { generateEntityId } from '@common/base/base.entity';

import { PRISMA_SERVICE } from '@shared/prisma/prisma.di-token';
import { PrismaService } from '@shared/prisma/prisma.service';

describe(DomainNameRepository.name, () => {
  let repository: DomainNameRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PRISMA_SERVICE,
          useClass: PrismaService,
        },
        {
          provide: DOMAIN_NAME_REPOSITORY,
          useClass: DomainNameRepository,
        },
      ],
    }).compile();

    repository = module.get<DomainNameRepositoryPort>(DOMAIN_NAME_REPOSITORY);
  });

  describe(DomainNameRepository.prototype.findOneById.name, () => {
    let domainNameId: string;

    beforeEach(() => {
      domainNameId = generateEntityId();
    });

    describe('식별자와 일치하는 리소스가 존재하는 경우', () => {
      let domainName: DomainName;

      beforeEach(async () => {
        domainName = await repository.insert(
          DomainNameFactory.build({ id: domainNameId }),
        );
      });

      describe('리소스를 조회하면', () => {
        it('리소스가 반환돼야한다.', async () => {
          await expect(repository.findOneById(domainNameId)).resolves.toEqual(
            domainName,
          );
        });
      });
    });
  });
});
`;

  generateFile(
    `${rootDir}/repositories/${domain}.repository.module.ts`,
    MODULE_PRESET,
    dir,
    domain,
  );
  generateFile(
    `${rootDir}/repositories/${domain}.repository.port.ts`,
    PORT_PRESET,
    dir,
    domain,
  );
  generateFile(
    `${rootDir}/repositories/${domain}.repository.ts`,
    REPOSITORY_PRESET,
    dir,
    domain,
  );
  generateFile(
    `${rootDir}/repositories/__spec__/${domain}.repository.spec.ts`,
    SPEC_PRESET,
    dir,
    domain,
  );
};

// CLI 명령어 정의
program
  .name('generate-domain')
  .description('Generate a new general file for domain.')
  .version('1.0.0')
  .argument('<dir>', 'Name of the target dir name')
  .argument('<domain>', 'Name of the target domain')
  .action(async (dirName: string, domainName: string) => {
    if (domainName === undefined || dirName === undefined) {
      throw new Error('domainName, dirName is required');
    }

    const rootDir = path.resolve(process.cwd(), 'src', 'modules', dirName);

    await generateDirs(rootDir);
    await generateModule(dirName);
    await generateAssembler(rootDir, dirName, domainName);
    await generateDto(rootDir, dirName, domainName);
    await generateEntity(rootDir, dirName, domainName);
    await generateMapper(rootDir, dirName, domainName);
    await generateRepository(rootDir, dirName, domainName);

    if (createdFiles.length !== 0) {
      await runCommand(`npx prettier --write ${createdFiles.join(' ')}`);
    }
  });

// 프로그램 실행
program.parse(process.argv);
