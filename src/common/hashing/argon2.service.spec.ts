import { Test, TestingModule } from '@nestjs/testing';
import { Argon2Service } from './argon2.service';

describe('Argon2Service', () => {
  let service: Argon2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Argon2Service,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    service = module.get<Argon2Service>(Argon2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
