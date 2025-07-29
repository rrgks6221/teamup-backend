# 🏗️ Teamup Backend

Teamup은 개발자/디자이너들이 사이드 프로젝트 팀원을 모집하고 협업할 수 있도록 돕는 플랫폼입니다.  
이 레포는 **Teamup의 백엔드 API**를 제공하는 NestJS 기반 서버로, **DDD + CQRS + EDA**를 기반으로 도메인 중심의 유즈케이스 설계와 이벤트 흐름을 관리합니다.

---

## 📦 Tech Stack

- **Language**: TypeScript (Node.js)
- **Framework**: NestJS
- **Architecture**: DDD + CQRS + EDA(Event Driven Architecture)
- **Database**: PostgreSQL (Prisma ORM)
- **API Docs**: Swagger (`/swagger`)
- **Infra (예정)**: AWS 기반 배포 (Lambda, RDS 등)

---

## 🧱 Architecture

- **도메인 계층 분리**

  - `modules/{{feature}}/` 아래에 도메인 별로 구조화: `use-cases`, `entities`, `repositories`, `events` 등
  - 공통 기능은 `shared`, `common`에 유틸리티/데코레이터/밸리데이터로 분리

- **CQRS 적용**

  - Command/Query 책임 분리: 도메인 확장 시 Side-effect 분리를 용이하게 처리

- **이벤트 기반 설계**

  - 도메인 이벤트 → `event-store`에 저장 (Event Sourcing 실험적 도입)
  - 예: 계정 생성/삭제, 지원 승인 시 구성원 자동 등록 등

- **자동 스캐폴딩 스크립트**
  - 반복되는 유즈케이스/도메인 구조 생성을 자동화하여 개발 생산성 향상

---

## ⚙️ Scripts

- `scripts/generate-usecase-preset.script.ts`: 유즈케이스 스캐폴딩 자동화
- `scripts/generate-domain.script.ts`: 도메인 구조 자동 생성기

---

## 🚀 Getting Started

Swagger 문서: <http://localhost:3000/swagger>

```bash
# 1. 의존성 설치
$ npm install

# 2. 환경 변수 설정
$ cp .env.sample .env

# 3. 로컬 인프라 실행 (PostgreSQL 등)
$ docker-compose up -d

# 4. Prisma 마이그레이션 및 Client 생성
$ npx prisma migrate dev
$ npx prisma generate

# 5. 로컬 서버 실행
$ npm run start:dev

```

---

## 🧪 Test

```bash
# 유닛 테스트 환경변수 설정
$ cp .env.sample .env.test
# 유닛 테스트
$ npm run test

```

---

## 🗂️ Project Structure

```
├── scripts
│   ├── generate-domain.script.ts # 도메인 모듈 기본 템플릿 생성
│   └── generate-usecase-preset.script.ts # 유즈케이스 초기 스캐폴딩
├── src
│   ├── common
│   ├── core
│   ├── shared
│   ├── modules
│   │   ├── feature
│   │   │   ├── assemblers
│   │   │   ├── dto
│   │   │   ├── entities
│   │   │   ├── errors
│   │   │   ├── event-handlers
│   │   │   ├── events
│   │   │   ├── mappers
│   │   │   ├── repositories
│   │   │   ├── use-cases
│   │   │   └── feature.module.ts
│   ├── app.module.ts
│   ├── bootstrap.ts
│   ├── main.ts
│   └── swagger.ts
├── test
├── prisma
├── prisma.d.ts
├── jest.config.ts
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── tsconfig.spec.json
```
