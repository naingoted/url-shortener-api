import { Mockify } from './../../test/mockify.types';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from './url-shortener.service';
import { HelperService } from '../helpers/helpers.service';
import { Model } from 'mongoose';
import { UrlMapping } from './url-mapping.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockUrlMappingModel: Mockify<Model<UrlMapping>> = {
  findOne: jest.fn(),
  updateOne: jest.fn(),
  save: jest.fn(),
} as any;

const mockHelperService: Mockify<Partial<HelperService>> = {
  generateShortUrl: jest.fn(),
};

describe('UrlShortenerService', () => {
  let urlShortenerService: UrlShortenerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        {
          provide: getModelToken(UrlMapping.name),
          useValue: mockUrlMappingModel,
        },
        {
          provide: HelperService,
          useValue: mockHelperService,
        },
      ],
    }).compile();

    urlShortenerService = app.get<UrlShortenerService>(UrlShortenerService);
  });

  describe('shortenUrl', () => {
    it('should return shortened URL when long URL does not exist in the database', async () => {
      const longUrl = 'http://example.com';
      const shortUrlId = 'abc123';
      const domainName = 'http://short.url';
      const expectedShortUrl = `${domainName}/${shortUrlId}`;

      mockUrlMappingModel.findOne.mockResolvedValueOnce(null);
      mockHelperService.generateShortUrl.mockReturnValueOnce(shortUrlId);

      const result = await urlShortenerService.shortenUrl(longUrl);

      expect(result).toEqual(expectedShortUrl);
      expect(mockUrlMappingModel.findOne).toHaveBeenCalledWith({ longUrl });
      expect(mockHelperService.generateShortUrl).toHaveBeenCalled();
    });

    it('should return existing shortened URL when long URL already exists in the database', async () => {
      const longUrl = 'http://example.com';
      const existingShortUrlId = 'abc123';
      const domainName = 'http://short.url';
      const existingShortUrl = `${domainName}/${existingShortUrlId}`;

      mockUrlMappingModel.findOne.mockResolvedValueOnce({
        longUrl,
        shortUrl: existingShortUrlId,
      } as UrlMapping);
      const generateShortUrlSpy = jest.spyOn(
        mockHelperService,
        'generateShortUrl',
      );

      const result = await urlShortenerService.shortenUrl(longUrl);

      expect(result).toEqual(existingShortUrl);
      expect(mockUrlMappingModel.findOne).toHaveBeenCalledWith({ longUrl });
      expect(generateShortUrlSpy).not.toHaveBeenCalled();
    });
  });

  describe('getLongUrl', () => {
    it('should return long URL when provided with a valid short URL', async () => {
      const shortUrlId = 'abc123';
      const expectedLongUrl = 'http://example.com';

      mockUrlMappingModel.findOne.mockResolvedValueOnce({
        longUrl: expectedLongUrl,
        shortUrl: shortUrlId,
      } as UrlMapping);
      const updateOneSpy = jest.spyOn(mockUrlMappingModel, 'updateOne');

      const result = await urlShortenerService.getLongUrl(shortUrlId);

      expect(result).toEqual(expectedLongUrl);
      expect(mockUrlMappingModel.findOne).toHaveBeenCalledWith({
        shortUrl: shortUrlId,
      });
      expect(updateOneSpy).toHaveBeenCalledWith(
        { longUrl: expectedLongUrl },
        expect.objectContaining({
          $push: { accessTime: expect.any(Date) },
          $inc: { accessCount: 1 },
        }),
      );
    });

    it('should return undefined when provided with an invalid short URL', async () => {
      const shortUrlId = 'invalidShortUrl';

      mockUrlMappingModel.findOne.mockResolvedValueOnce(null);

      const result = await urlShortenerService.getLongUrl(shortUrlId);

      expect(result).toBeUndefined();
      expect(mockUrlMappingModel.findOne).toHaveBeenCalledWith({
        shortUrl: shortUrlId,
      });
    });
  });
});
