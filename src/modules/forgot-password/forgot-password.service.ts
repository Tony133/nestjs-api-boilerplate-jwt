import { Kysely } from 'kysely';
import { Database } from '../users/users.model';
import { httpErrors } from '@fastify/sensible';
import { ForgotPasswordDto } from './forgot-password.schemas';
import { HashingService } from '../../shared/hashing/hashing.service';
import * as crypto from 'crypto';
import { MailerService } from '../../shared/mailer/mailer.service';

export class ForgotPasswordService {
  constructor(
    private readonly db: Kysely<Database>,
    private readonly hashingService: HashingService,
    private readonly mailerService: MailerService
  ) {}

  public async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.db
      .selectFrom('users')
      .select(['id', 'email'])
      .where('email', '=', data.email)
      .executeTakeFirst();

    if (!user) {
      throw httpErrors.notFound('User not found');
    }

    const temporaryPassword = crypto.randomBytes(6).toString('hex');
    const hashedPassword = await this.hashingService.hash(temporaryPassword);

    await this.db
      .updateTable('users')
      .set({ password: hashedPassword })
      .where('id', '=', user.id)
      .execute();

    try {
      this.mailerService
        .sendMail({
          to: user.email,
          subject: 'Your Temporary Password',
          html: `<p>Your new temporary password is: <b>${temporaryPassword}</b></p>`
        })
        .catch((err) => {
          console.error('Failed to send reset email:', err);
        });

      return {
        success: true,
        message: 'A temporary password has been sent to your email'
      };
    } catch (err) {
      throw httpErrors.internalServerError(
        'Failed to send reset email. Please try again later.'
      );
    }
  }
}
