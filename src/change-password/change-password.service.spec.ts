import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordService } from './change-password.service';

describe('ChangePasswordService', () => {
  let service: ChangePasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangePasswordService],
    }).compile();

    service = module.get<ChangePasswordService>(ChangePasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
