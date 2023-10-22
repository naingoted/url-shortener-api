import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from './url-shortener.service';
import { Mockify } from 'test/mockify.types';

const mockUrlShortenerService: Mockify<UrlShortenerService> = {
  shortenUrl: jest.fn(),
};

const mockResponse = {
  json: jest.fn(),
};

describe('UrlShortenerController', () => {
  let urlShortenerController: UrlShortenerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [
        UrlShortenerController,
        {
          provide: UrlShortenerService,
          useValue: mockUrlShortenerService,
        },
      ],
    }).compile();

    urlShortenerController = app.get<UrlShortenerController>(
      UrlShortenerController,
    );
  });

  describe('Shorten Url', () => {
    beforeEach(() => {
      mockUrlShortenerService.shortenUrl.mockResolvedValueOnce(
        'https://domain.com/DSI8koIx',
      );
    });

    it('should return shorten url when valid url is provided', async () => {
      const longUrl =
        'https://mothership.sg/2023/10/boys-arrested-drug-offences-yishun/';
      await urlShortenerController.createShortUrl(
        {
          url: longUrl,
        },
        mockResponse as any,
      );

      expect(mockUrlShortenerService.shortenUrl).toHaveBeenCalledWith(longUrl);
      expect(mockResponse.json).toHaveBeenCalledWith({
        shortUrl: 'https://domain.com/DSI8koIx',
      });
    });

    it('should throw validation error error if the url is empty', async () => {
      const longUrl = '';

      try {
        await urlShortenerController.createShortUrl(
          {
            url: longUrl,
          },
          mockResponse as any,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message.response.message).toEqual([
          'url should not be empty',
        ]);
        expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw a validation error when "url" property is not a valid URL', async () => {
      try {
        await urlShortenerController.createShortUrl(
          {
            url: 'invalid-url',
          },
          mockResponse as any,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message.response.message).toEqual([
          'url should not be empty',
        ]);
        expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
