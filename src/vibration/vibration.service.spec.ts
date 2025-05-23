import { Test, TestingModule } from '@nestjs/testing';
import { VibrationService } from './vibration.service';

describe('VibrationService', () => {
  let service: VibrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VibrationService],
    }).compile();

    service = module.get<VibrationService>(VibrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
