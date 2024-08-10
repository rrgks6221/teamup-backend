import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  private static readonly VERSION = '0.1';

  static setup(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('teamup-backend')
      .setDescription('The teamup-backend API')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Admin API 필터링 (경로가 `/admin/`으로 시작하는 API만 포함)
    const adminDocument = this.filterPaths(document, '^/admin/');

    // 일반 API 필터링 (경로가 `/admin/`이 아닌 API만 포함)
    const userDocument = this.filterPaths(document, '^(?!/admin/)');

    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: this.swaggerOptions,
    });
    SwaggerModule.setup('swagger/admin', app, adminDocument, {
      swaggerOptions: this.swaggerOptions,
    });
    SwaggerModule.setup('swagger/user', app, userDocument, {
      swaggerOptions: this.swaggerOptions,
    });
  }

  private static filterPaths(
    document: OpenAPIObject,
    pattern: string,
  ): OpenAPIObject {
    const regex = new RegExp(pattern);
    const filteredPaths = Object.keys(document.paths)
      .filter((path) => regex.test(path))
      .reduce((obj, key) => {
        obj[key] = document.paths[key];
        return obj;
      }, {} as any);

    return {
      ...document,
      paths: filteredPaths,
    };
  }

  static get defaultDocumentConfig() {
    return new DocumentBuilder().setVersion(this.VERSION).addBearerAuth();
  }

  static get swaggerOptions() {
    return {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: (a: Map<string, string>, b: Map<string, string>) => {
        const order = {
          post: '0',
          get: '1',
          put: '2',
          patch: '3',
          delete: '4',
        };

        return order[a.get('method') as string].localeCompare(
          order[b.get('method') as string],
        );
      },
    };
  }
}
