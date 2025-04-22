import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { CustomRequest } from 'src/types';
import { TokenPurpose } from './entities/auth.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tokenPurpose: TokenPurpose,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      const payload = this.jwtService.verify(token, {
        issuer: this.tokenPurpose,
      });

      request.session = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token Expired');
      }

      if (error instanceof JsonWebTokenError) {
        // console.log(error.message);

        if (error.message.includes('issuer')) {
          throw new UnauthorizedException('Invalid Token Purpose');
        }
      }
      throw new UnauthorizedException('Invalid Token');
    }
  }

  private extractTokenFromHeader(request: CustomRequest) {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException(
        'Authorization not present in the header',
      );
    }

    return authorization.split(' ')[1];
  }
}

function AuthGaurdFactory(tokenPurpose: TokenPurpose): Type<CanActivate> {
  @Injectable()
  class DynamicAuthGaurd extends AuthGuard {
    constructor(jwtService: JwtService) {
      super(jwtService, tokenPurpose);
    }
  }

  return mixin(DynamicAuthGaurd);
}

export function Authenticate(
  tokenPurpose: TokenPurpose = TokenPurpose.SESSION,
) {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    UseGuards(AuthGaurdFactory(tokenPurpose)),
  );
}
