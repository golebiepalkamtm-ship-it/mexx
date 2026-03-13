import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { UsersService } from '../users/users.service';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get<string>(
          'SUPABASE_URL',
        )}/auth/v1/jwks`,
      }),
      issuer: `${configService.get<string>('SUPABASE_URL')}/auth/v1`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // Supabase UID is in payload.sub
    // Sync Supabase User with local database
    return await this.usersService.syncSupabaseUser(
      payload.sub,
      payload.email,
      payload.user_metadata?.username
    );
  }
}
