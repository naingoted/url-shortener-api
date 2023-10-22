import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedirectionController } from './redirect.controller';
import { UrlShortenerModule } from '../url-shortener/url-shortener.module';
import { UrlShortenerService } from '../url-shortener/url-shortener.service';
import { HelperService } from '../helpers/helpers.service';
import { UrlMappingSchema } from '../url-shortener/url-mapping.schema';

@Module({
  imports: [
    UrlShortenerModule,
    MongooseModule.forFeature([
      { name: 'UrlMapping', schema: UrlMappingSchema },
    ]),
  ],
  controllers: [RedirectionController],
  providers: [UrlShortenerService, HelperService],
})
export class RedirectModule {}
