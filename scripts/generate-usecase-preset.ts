import { exec } from 'child_process';
import { Command } from 'commander';
import { writeFileSync } from 'fs';
import * as path from 'path';
import camelCase from 'to-camel-case';
import pascalCase from 'to-pascal-case';
import snakeCase from 'to-snake-case';

const program = new Command();

const PRESETS = {
  MODULE_PRESET: `import { Module } from '@nestjs/common';

import { UseCaseNameController } from '@module/module-name/use-cases/use-case-name/use-case-name.controller';
import { UseCaseNameService } from '@module/module-name/use-cases/use-case-name/use-case-name.service';
import { USE_CASE_NAME_SERVICE } from '@module/module-name/use-cases/use-case-name/use-case-name.service.interface';

@Module({
  controllers: [UseCaseNameController],
  providers: [
    {
      provide: USE_CASE_NAME_SERVICE,
      useClass: UseCaseNameService,
    },
  ],
})
export class UseCaseNameModule {}
`,

  CONTROLLER_PRESET: `import { Controller, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  USE_CASE_NAME_SERVICE,
  UseCaseNameOperationName,
  IUseCaseNameService,
} from '@module/module-name/use-cases/use-case-name/use-case-name.service.interface';

@ApiTags('module-name')
@Controller()
export class UseCaseNameController {
  constructor(
    @Inject(USE_CASE_NAME_SERVICE) private readonly useCaseNameService: IUseCaseNameService,
  ) {}

  @ApiOperation({ summary: '' })
  async useCaseName() {
    try {
      const operationName = new UseCaseNameOperationName({});
    
      const result = await this.useCaseNameService.execute(operationName);
    } catch (error) {
      throw error 
    }
  }
}
`,

  SERVICE_INTERFACE_PRESET: `import { IBaseService } from '@common/base/base-service';

export const USE_CASE_NAME_SERVICE = Symbol('IUseCaseNameService');

export interface IUseCaseNameOperationNameProps {}

export class UseCaseNameOperationName {
  constructor(props: IUseCaseNameOperationNameProps) {}
}

export interface IUseCaseNameService extends IBaseService<UseCaseNameOperationName, unknown> {}
`,

  SERVICE_PRESET: `import { Injectable } from '@nestjs/common';

import {
  UseCaseNameOperationName,
  IUseCaseNameService,
} from '@module/module-name/use-cases/use-case-name/use-case-name.service.interface';

@Injectable()
export class UseCaseNameService implements IUseCaseNameService {
  constructor() {}

  async execute(operationName: UseCaseNameOperationName): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
}
`,

  SERVICE_SPEC_PRESET: `import { Test, TestingModule } from '@nestjs/testing';

import { UseCaseNameOperationNameFactory } from '@module/module-name/use-cases/use-case-name/__spec__/use-case-name-operation-name.factory';
import { UseCaseNameModule } from '@module/module-name/use-cases/use-case-name/use-case-name.module';
import { UseCaseNameService } from '@module/module-name/use-cases/use-case-name/use-case-name.service';
import { UseCaseNameOperationName } from '@module/module-name/use-cases/use-case-name/use-case-name.service.interface';

describe('UseCaseNameService', () => {
  let service: UseCaseNameService;

  let operationName: UseCaseNameOperationName;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UseCaseNameModule],
    }).compile();

    service = module.get<UseCaseNameService>(UseCaseNameService);
  });

  beforeEach(() => {
    operationName = UseCaseNameOperationNameFactory.build();
  });
});
`,

  FACTORY_OPERATION_PRESET: `import { Factory } from 'rosie';

import { UseCaseNameOperationName } from '@module/module-name/use-cases/use-case-name/use-case-name.service.interface';

export const UseCaseNameOperationNameFactory = Factory.define<UseCaseNameOperationName>(
  'UseCaseNameOperationName',
  UseCaseNameOperationName,
).attrs({});
`,

  DTO_PRESET: `export class UseCaseNameRequestDto {}
`,
};

// 명령어 실행 함수
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

// CLI 명령어 정의
program
  .name('generate-usecase')
  .description('Generate a new use case with module, controller, and service.')
  .version('1.0.0')
  .argument('<module>', 'Name of the target module')
  .argument('<name>', 'Name of the use case')
  .argument('<operation>', 'Operation of the use case')
  .action(async (moduleName, useCaseName, operation) => {
    if (
      moduleName === undefined ||
      useCaseName === undefined ||
      operation === undefined
    ) {
      throw new Error('moduleName, useCaseName, operation is required');
    }
    if (operation !== 'query' && operation !== 'command') {
      throw new Error('operation must be a command or query');
    }

    const useCaseDir = path.resolve(
      process.cwd(),
      'src',
      'modules',
      moduleName,
      'use-cases',
      useCaseName,
    );

    try {
      // NestJS CLI 명령어 실행
      await runCommand(
        `nest g module ${useCaseName} modules/${moduleName}/use-cases`,
      );
      await runCommand(
        `nest g controller ${useCaseName} modules/${moduleName}/use-cases`,
      );
      await runCommand(
        `nest g service ${useCaseName} modules/${moduleName}/use-cases`,
      );
      await runCommand(
        `nest g interface ${useCaseName}.service modules/${moduleName}/use-cases/${useCaseName} --flat`,
      );

      await runCommand(`mkdir ${useCaseDir}/__spec__`);
      await runCommand(
        `mv ${useCaseDir}/${useCaseName}.service.spec.ts ${useCaseDir}/__spec__/${useCaseName}.service.spec.ts`,
      );
      await runCommand(
        `touch ${useCaseDir}/__spec__/${useCaseName}-${operation}.factory.ts`,
      );

      const REGEXP_MAP = [
        ['module-name', moduleName],

        ['use-case-name', useCaseName],
        ['UseCaseName', pascalCase(useCaseName)],
        ['useCaseName', camelCase(useCaseName)],
        ['USE_CASE_NAME', snakeCase(useCaseName).toUpperCase()],

        ['operation-name', operation],
        ['OperationName', pascalCase(operation)],
        ['operationName', operation],
      ];

      const reconfigureFile = (preset: string) => {
        return REGEXP_MAP.reduce((acc, [key, value]) => {
          const regexp = new RegExp(key, 'gm');
          return acc.replace(regexp, value);
        }, preset);
      };

      const modulePath = `${useCaseDir}/${useCaseName}.module.ts`;
      const controllerPath = `${useCaseDir}/${useCaseName}.controller.ts`;
      const serviceInterfacePath = `${useCaseDir}/${useCaseName}.service.interface.ts`;
      const servicePath = `${useCaseDir}/${useCaseName}.service.ts`;
      const serviceSpecPath = `${useCaseDir}/__spec__/${useCaseName}.service.spec.ts`;
      const factoryPath = `${useCaseDir}/__spec__/${useCaseName}-${operation}.factory.ts`;
      const dtoPath = `${useCaseDir}/dto/${useCaseName}.request-dto.ts`;
      writeFileSync(modulePath, reconfigureFile(PRESETS.MODULE_PRESET));
      writeFileSync(controllerPath, reconfigureFile(PRESETS.CONTROLLER_PRESET));
      writeFileSync(
        serviceInterfacePath,
        reconfigureFile(PRESETS.SERVICE_INTERFACE_PRESET),
      );
      writeFileSync(servicePath, reconfigureFile(PRESETS.SERVICE_PRESET));
      writeFileSync(
        serviceSpecPath,
        reconfigureFile(PRESETS.SERVICE_SPEC_PRESET),
      );
      writeFileSync(
        factoryPath,
        reconfigureFile(PRESETS.FACTORY_OPERATION_PRESET),
      );

      if (operation === 'command') {
        await runCommand(`mkdir ${useCaseDir}/dto`);
        await runCommand(
          `touch ${useCaseDir}/dto/${useCaseName}.request-dto.ts`,
        );
        writeFileSync(dtoPath, reconfigureFile(PRESETS.DTO_PRESET));
        await runCommand(`npx prettier --write ${dtoPath}`);
      }

      await runCommand(
        `npx prettier --write ${modulePath} ${controllerPath} ${serviceInterfacePath} ${servicePath} ${serviceSpecPath} ${factoryPath}`,
      );

      console.log(`Use case '${useCaseName}' generated successfully.`);
    } catch (error) {
      console.error('Failed to generate use case:', error);
    }
  });

// 프로그램 실행
program.parse(process.argv);
