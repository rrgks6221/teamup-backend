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
import { UseCaseNameHandler } from '@module/module-name/use-cases/use-case-name/use-case-name.handler';

@Module({
  controllers: [UseCaseNameController],
  providers: [UseCaseNameHandler],
})
export class UseCaseNameModule {}
`,

  CONTROLLER_PRESET: `import { Controller, HttpStatus } from '@nestjs/common';
import { OperationNameBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UseCaseNameOperationName } from '@module/module-name/use-cases/use-case-name/use-case-name.operation-name';

import { RequestValidationError } from '@common/base/base.error';
import { ApiErrorResponse } from '@common/decorator/api-fail-response.decorator';

@ApiTags('module-name')
@Controller()
export class UseCaseNameController {
  constructor(
    private readonly operationNameBus: OperationNameBus,
  ) {}

  @ApiErrorResponse({
    [HttpStatus.BAD_REQUEST]: [RequestValidationError],
  })
  @ApiOperation({ summary: '' })
  async useCaseName() {
    try {
      const operationName = new UseCaseNameOperationName({});
    
      const result = await this.operationNameBus.execute<UseCaseNameOperationName, unknown>(operationName);
    } catch (error) {
      throw error 
    }
  }
}
`,

  HANDLER_PRESET: `import { OperationNameHandler, IOperationNameHandler } from '@nestjs/cqrs';

import { UseCaseNameOperationName } from '@module/module-name/use-cases/use-case-name/use-case-name.operation-name';

@OperationNameHandler(UseCaseNameOperationName)
export class UseCaseNameHandler implements IOperationNameHandler<UseCaseNameOperationName, unknown> {
  constructor() {}

  async execute(operationName: UseCaseNameOperationName): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
}
`,

  HANDLER_SPEC_PRESET: `import { Test, TestingModule } from '@nestjs/testing';

import { UseCaseNameOperationNameFactory } from '@module/module-name/use-cases/use-case-name/__spec__/use-case-name-operation-name.factory';
import { UseCaseNameOperationName } from '@module/module-name/use-cases/use-case-name/use-case-name.operation-name';
import { UseCaseNameHandler } from '@module/module-name/use-cases/use-case-name/use-case-name.handler';

describe(UseCaseNameHandler.name, () => {
  let handler: UseCaseNameHandler;

  let operationName: UseCaseNameOperationName;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UseCaseNameHandler],
    }).compile();

    handler = module.get<UseCaseNameHandler>(UseCaseNameHandler);
  });

  beforeEach(() => {
    operationName = UseCaseNameOperationNameFactory.build();
  });
});
`,

  OPERATION_PRESET: `import { IOperationName } from '@nestjs/cqrs';

export interface IUseCaseNameOperationNameProps {}

export class UseCaseNameOperationName implements IOperationName {
  constructor(props: IUseCaseNameOperationNameProps) {}
}
`,

  FACTORY_OPERATION_PRESET: `import { Factory } from 'rosie';

import { UseCaseNameOperationName } from '@module/module-name/use-cases/use-case-name/use-case-name.operation-name';

export const UseCaseNameOperationNameFactory = Factory.define<UseCaseNameOperationName>(
  UseCaseNameOperationName.name,
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
  .description('Generate a new use case with module, controller, and handler.')
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
        `mv ${useCaseDir}/${useCaseName}.service.ts ${useCaseDir}/${useCaseName}.handler.ts`,
      );
      await runCommand(`mkdir ${useCaseDir}/__spec__`);
      await runCommand(
        `mv ${useCaseDir}/${useCaseName}.service.spec.ts ${useCaseDir}/__spec__/${useCaseName}.handler.spec.ts`,
      );
      await runCommand(
        `touch ${useCaseDir}/__spec__/${useCaseName}-${operation}.factory.ts`,
      );
      await runCommand(`touch ${useCaseDir}/${useCaseName}.${operation}.ts`);

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
      const operationPath = `${useCaseDir}/${useCaseName}.${operation}.ts`;
      const handlerPath = `${useCaseDir}/${useCaseName}.handler.ts`;
      const handlerSpecPath = `${useCaseDir}/__spec__/${useCaseName}.handler.spec.ts`;
      const factoryPath = `${useCaseDir}/__spec__/${useCaseName}-${operation}.factory.ts`;
      const dtoPath = `${useCaseDir}/dto/${useCaseName}.request-dto.ts`;
      writeFileSync(modulePath, reconfigureFile(PRESETS.MODULE_PRESET));
      writeFileSync(controllerPath, reconfigureFile(PRESETS.CONTROLLER_PRESET));
      writeFileSync(handlerPath, reconfigureFile(PRESETS.HANDLER_PRESET));
      writeFileSync(operationPath, reconfigureFile(PRESETS.OPERATION_PRESET));
      writeFileSync(
        handlerSpecPath,
        reconfigureFile(PRESETS.HANDLER_SPEC_PRESET),
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
        `npx prettier --write ${modulePath} ${controllerPath} ${operationPath} ${handlerPath} ${handlerSpecPath} ${factoryPath}`,
      );

      console.log(`Use case '${useCaseName}' generated successfully.`);
    } catch (error) {
      console.error('Failed to generate use case:', error);
    }
  });

// 프로그램 실행
program.parse(process.argv);
