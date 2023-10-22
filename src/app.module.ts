import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedirectModule } from './redirect/redirect.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    UrlShortenerModule,
    RedirectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
