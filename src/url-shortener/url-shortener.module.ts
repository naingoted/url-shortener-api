import { Module } from '@nestjs/common';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from './url-shortener.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlMappingSchema } from './url-mapping.schema';
import { HelperService } from '../helpers/helpers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UrlMapping', schema: UrlMappingSchema },
    ]),
  ],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, HelperService],
})
export class UrlShortenerModule {}
