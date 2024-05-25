import { AuthTokenResponseDto } from '@module/auth/dto/auth-token.response.dto';
import { AuthToken } from '@module/auth/entities/auth-token.vo';

export class AuthTokenDtoAssembler {
  static convertToDto(authToken: AuthToken): AuthTokenResponseDto {
    const dto = new AuthTokenResponseDto();

    dto.accessToken = authToken.accessToken;
    dto.refreshToken = authToken.refreshToken;

    return dto;
  }
}
