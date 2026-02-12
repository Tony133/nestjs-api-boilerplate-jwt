import { Kysely } from 'kysely';
import { HashingService } from '../../shared/hashing/hashing.service';
import { RegisterPayload } from './register.schema';
import { httpErrors } from '@fastify/sensible';
import { Database } from '../users/users.model';

export class RegisterService {
  constructor(
    private readonly db: Kysely<Database>,
    private readonly hashingService: HashingService
  ) {}

  public async register(userData: RegisterPayload) {
    const existingUser = await this.db
      .selectFrom('users')
      .select('id')
      .where('email', '=', userData.email)
      .executeTakeFirst();

    if (existingUser) {
      throw httpErrors.conflict('User already registered');
    }

    const passwordHash = userData.password
      ? await this.hashingService.hash(userData.password)
      : '';

    return await this.db
      .insertInto('users')
      .values({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: passwordHash,
        roles: ['USER'],
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
