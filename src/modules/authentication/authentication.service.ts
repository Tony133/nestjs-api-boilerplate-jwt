import { Kysely } from 'kysely';
import { httpErrors } from '@fastify/sensible';
import { Database } from '../users/users.model';
import { HashingService } from '../../shared/hashing/hashing.service';

export class AuthenticationService {
  constructor(
    private readonly db: Kysely<Database>,
    private readonly hashingService: HashingService
  ) {}

  public async login(
    email: string,
    password: string
  ) {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      throw httpErrors.notFound('User not found');
    }

    const isValidPassword = await this.hashingService.compare(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw httpErrors.unauthorized('Invalid password');
    }

    // Update last access date
    await this.db
      .updateTable('users')
      .set({ dateOfLastAccess: new Date() })
      .where('id', '=', user.id)
      .execute();

    return { user, success: true };
  }

  public async getUserData(userId: string) {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', userId)
      .executeTakeFirst();

    if (!user) {
      throw httpErrors.notFound('User not found');
    }
    return user;
  }
}
