import { TechStackResponseDto } from '@module/tech-stack/dto/tech-stack.response-dto';
import { TechStack } from '@module/tech-stack/entities/tech-stack.entity';

export class TechStackDtoAssembler {
  static convertToDto(techStack: TechStack): TechStackResponseDto {
    const dto = new TechStackResponseDto({
      id: techStack.id,
      createdAt: techStack.createdAt,
      updatedAt: techStack.updatedAt,
    });

    dto.name = techStack.name;

    return dto;
  }
}
