import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { UserModule } from './user/user.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ChangePasswordModule } from './change-password/change-password.module';
import { HandlebarsAdapter, MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
  	TypeOrmModule.forRoot(),
  	LoginModule, 
  	RegisterModule, 
  	UserModule, 
  	ForgotPasswordModule, 
  	ChangePasswordModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: { 
        	host: 'smtp.mailtrap.io', 
        	port:  2525,
				  auth: {
				    user: 'my_username',
				    pass: 'my_password'
				  }
				},
        defaults: {
        	from:'"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
