import { User } from './user.entity';

describe('User class', () => {
  it('should make a user with no fields', () => {
    const user = new User('', '', '', '', '');
    expect(user).toBeTruthy();
    expect(user.name).toBe('');
    expect(user.email).toBe('');
    expect(user.username).toBe('');
    expect(user.password).toBe('');
  });
  it('should make a user with fields', () => {
    const user = new User(
      '1',
      'name#1',
      'test@example.com',
      'username#1',
      'password#1',
    );
    expect(user).toBeTruthy();
    expect(user.name).toBe('name#1');
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('username#1');
    expect(user.password).toBe('password#1');
  });
  it('should make a user with name only', () => {
    const user = new User('1', 'name#1', '', '', '');
    expect(user).toBeTruthy();
    expect(user.name).toBe('name#1');
    expect(user.email).toBe('');
    expect(user.username).toBe('');
    expect(user.password).toBe('');
  });
  it('should make a user with name and email', () => {
    const user = new User('1', 'name#1', 'test@example.com', '', '');
    expect(user).toBeTruthy();
    expect(user.name).toBe('name#1');
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('');
    expect(user.password).toBe('');
  });

  it('should make a user with name, email and username', () => {
    const user = new User('1', 'name#1', 'test@example.com', 'username#1', '');
    expect(user).toBeTruthy();
    expect(user.name).toBe('name#1');
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('username#1');
    expect(user.password).toBe('');
  });
});
