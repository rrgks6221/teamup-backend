import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PositionDtoAssembler } from '@module/position/assemblers/position-dto.assembler';
import { PositionResponseDto } from '@module/position/dto/position.response-dto';
import { Position } from '@module/position/entities/position.entity';
import { ListPositionsQuery } from '@module/position/use-cases/list-positions/list-positions.query';

@ApiTags('position')
@Controller()
export class ListPositionsController {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiOperation({ summary: '포지션 리스트 조회' })
  @ApiOkResponse({ type: [PositionResponseDto] })
  @Get('positions')
  async listPositions(): Promise<PositionResponseDto[]> {
    const query = new ListPositionsQuery();

    const positions = await this.queryBus.execute<
      ListPositionsQuery,
      Position[]
    >(query);

    return positions.map((position) =>
      PositionDtoAssembler.convertToDto(position),
    );
  }
}
