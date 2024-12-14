/* eslint-disable */
namespace PrismaJson {
  // Account
  type AccountPositionNames = string[];
  type AccountTechStackNames = string[];
  type AccountSnsLinks = {
    url: string;
    platform: string;
    visibilityScope: 'public' | 'private';
  }[];

  // Project
  type ProjectTags = string[];
}
