import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UrlShortenerService } from './url-shortener.service';
import { IsUrl, IsNotEmpty } from 'class-validator';

export class UrlShortenerDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private urlShortenerService: UrlShortenerService) {}

  @Post()
  async createShortUrl(
    @Body() { url: longUrl }: UrlShortenerDto,
    @Res() response: Response,
  ): Promise<Response> {
    const shortUrl: string = await this.urlShortenerService.shortenUrl(longUrl);
    return response.json({ shortUrl: shortUrl });
  }
}
