import { Test, TestingModule } from '@nestjs/testing';
import { ReseauController } from './reseau.controller';

describe('ReseauController', () => {
  let controller: ReseauController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReseauController],
    }).compile();

    controller = module.get<ReseauController>(ReseauController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
