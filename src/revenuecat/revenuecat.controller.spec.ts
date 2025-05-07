import { Test, TestingModule } from '@nestjs/testing';
import { RevenuecatController } from './revenuecat.controller';

describe('RevenuecatController', () => {
  let controller: RevenuecatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevenuecatController],
    }).compile();

    controller = module.get<RevenuecatController>(RevenuecatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
