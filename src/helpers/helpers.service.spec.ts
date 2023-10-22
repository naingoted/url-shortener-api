import { Test, TestingModule } from '@nestjs/testing';
import { HelperService } from './helpers.service';

describe('ShortidGeneratorService', () => {
  let service: HelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelperService],
    }).compile();

    service = module.get<HelperService>(HelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
