import { PositionResponseDto } from '@module/position/dto/position.response-dto';
import { Position } from '@module/position/entities/position.entity';

export class PositionDtoAssembler {
  static convertToDto(position: Position): PositionResponseDto {
    const dto = new PositionResponseDto({
      id: position.id,
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    });

    dto.name = position.name;

    return dto;
  }
}
