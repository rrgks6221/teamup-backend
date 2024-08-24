import { generateEntityId } from './functions';
import { PrismaClient } from '@prisma/client';

// 주석으로 적힌 직군은 구분을 위함이고 큰 의미 없음
const TECH_STACKS = [
  // Frontend
  'HTML',
  'CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Vue.js',
  'Svelte',
  'Next.js',
  'Nuxt.js',
  'Tailwind CSS',
  'Webpack',
  'Vite',

  // Backend
  'Node.js',
  'Express',
  'NestJS',
  'Django',
  'Flask',
  'Spring Boot',
  'Ruby on Rails',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'REST API',

  // Mobile
  'Swift',
  'SwiftUI',
  'UIKit',
  'Xcode',
  'Combine',
  'CoreData',
  'Realm',
  'Firebase',
  'Kotlin',
  'Jetpack Compose',
  'Android Studio',
  'Dagger',
  'Hilt',
  'Retrofit',
  'Room',

  // Game
  'Unity',
  'C#',
  'Unreal Engine',
  'C++',
  'Godot',
  'GDScript',
  'Photon',
  'PlayFab',
  'Shader',
  'HLSL',
  'GLSL',

  // AI / Machine Learning
  'Python',
  'TensorFlow',
  'PyTorch',
  'OpenCV',
  'scikit-learn',
  'Hugging Face',
  'Jupyter Notebook',
  'CUDA',
  'FastAPI',

  // Design
  'Figma',
  'Sketch',
  'Adobe XD',
  'Framer',
  'Zeplin',
  'Protopie',
  'Balsamiq',
  'Photoshop',
  'Illustrator',
  'InDesign',
  'Affinity Designer',
  'After Effects',
  'Blender',
  'Cinema 4D',
  'Adobe Animate',
  'Lottie',
  'Maya',
  'ZBrush',
  'Substance Painter',

  // Planning & Business
  'Notion',
  'Jira',
  'Confluence',
  'Trello',
  'Google Analytics',
  'Mixpanel',
  'Miro',
  'Google Sheets',
  'Excel',
  'Tableau',
  'Power BI',
  'Storyboard',

  // DevOps / Infra
  'Docker',
  'Kubernetes',
  'Terraform',
  'Ansible',
  'Jenkins',
  'GitHub Actions',
  'GitLab CI/CD',
  'ArgoCD',
  'Helm',
  'AWS',
  'Azure',
  'Google Cloud',
  'CloudFormation',
  'Pulumi',
  'Serverless Framework',
  'Prometheus',
  'Grafana',
  'ELK Stack',
  'Loki',
  'Jaeger',
  'Datadog',
  'OWASP',
  'HashiCorp Vault',
  'Snyk',
  'SonarQube',
  'Trivy',
];

export const techStackSeeding = async (prisma: PrismaClient) => {
  const now = new Date();

  await Promise.all(
    TECH_STACKS.map((techStack) =>
      prisma.techStack.upsert({
        create: {
          id: BigInt(generateEntityId()),
          name: techStack,
          createdAt: now,
          updatedAt: now,
        },
        update: {
          name: techStack,
        },
        where: {
          name: techStack,
        },
      }),
    ),
  );

  console.log('tech stack seeding complete');
};
