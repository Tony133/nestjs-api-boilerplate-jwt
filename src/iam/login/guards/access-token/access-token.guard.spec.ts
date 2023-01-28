import { AccessTokenGuard } from './access-token.guard';

describe('AccessTokenGuard', () => {
  it('should be defined', () => {
    expect(new AccessTokenGuard()).toBeDefined();
  });
});
