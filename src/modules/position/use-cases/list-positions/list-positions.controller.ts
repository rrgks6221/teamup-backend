import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PositionDtoAssembler } from '@module/position/assemblers/position-dto.assembler';
import { PositionResponseDto } from '@module/position/dto/position.response-dto';
import {
  IListPositionsService,
  LIST_POSITIONS_SERVICE,
} from '@module/position/use-cases/list-positions/list-positions.service.interface';

@ApiTags('position')
@Controller()
export class ListPositionsController {
  constructor(
    @Inject(LIST_POSITIONS_SERVICE)
    private readonly listPositionsService: IListPositionsService,
  ) {}

  @ApiOperation({ summary: '포지션 리스트 조회' })
  @ApiOkResponse({ type: [PositionResponseDto] })
  @Get('positions')
  async listPositions(): Promise<PositionResponseDto[]> {
    const positions = await this.listPositionsService.execute();

    return positions.map((position) =>
      PositionDtoAssembler.convertToDto(position),
    );
  }
}
