import { Test, TestingModule } from '@nestjs/testing';
import { VibrationController } from './vibration.controller';

describe('VibrationController', () => {
  let controller: VibrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VibrationController],
    }).compile();

    controller = module.get<VibrationController>(VibrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
