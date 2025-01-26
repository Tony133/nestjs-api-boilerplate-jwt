import { ChangePasswordDto } from '@/iam/change-password/dto/change-password.dto';
import { RegisterUserDto } from '@/iam/register/dto/register-user.dto';

export const registrationEmail = (user: RegisterUserDto) => {
  return `<html>
            <body>
              <div>
                <p>Hi ${user.name}!</p>
                <p>You did it! You registered!, You're successfully registered.✔</p>
              </div>
            </body>
          </html>
  `;
};

export const forgotPasswordEmail = (password: string) => {
  return `<html>
            <body>
              <div>
                <p>Request Reset Password Successfully!  ✔</p>
                <p>This is your new password: <b>${password}</b></p>
              </div>
            </body>
          </html>
  `;
};

export const changePasswordEmail = (user: ChangePasswordDto) => {
  return `<html>
            <body>
              <div>
                <p>Change Password Successfully! ✔ </p>
                <p>this is your new password: ${user.password}</p>
              </div>
            </body>
          </html>
  `;
};
