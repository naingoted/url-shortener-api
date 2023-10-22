import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UrlShortenerService } from '../url-shortener/url-shortener.service';

@Controller()
export class RedirectionController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Get(':shortUrl')
  async redirectToLongUrl(
    @Param('shortUrl') shortUrl: string,
    @Res() res: Response,
  ): Promise<Response | void> {
    try {
      const longUrl: string | undefined =
        await this.urlShortenerService.getLongUrl(shortUrl);

      if (!longUrl) {
        return res.status(404).send('URL not found!'); // Send a 404 response when URL is not found
      }

      return res.status(302).redirect(longUrl); // Redirect when the URL is found
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error!');
    }
  }
}
