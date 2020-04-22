
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUtils } from './auth.utils';
import MailService from '../mailer/mail.service';
import { UserRegister } from '../users/types/UserRegister.type';
import { getConnection } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly authUtils: AuthUtils,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });
    if (user && await this.authUtils.comparePasswords({ password, hashedPassword: user.password })) {
      const { password: pwd, ...result } = user;
      return result;
    } else if (user && !await this.authUtils.comparePasswords({ password, hashedPassword: user.password })) {
      throw new UnauthorizedException('Invalid password');
    } else if (!user) {
      throw new UnauthorizedException('User doesn\'t exist!');
    }
  }
  async signIn(user: any) {
    const payload = { username: user.username, id: user.id, role: user.role };
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      access_token: this.jwtService.sign(payload),
      role: user.role,
    };
  }

  async register(user: UserRegister) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const verificationToken = await this.authUtils.createVerificationToken(user.email, queryRunner);
      user["verificationTokenId"] = verificationToken.id
      const userCreated = await this.usersService.createNew(user, queryRunner);
      if (userCreated) {
        const { password, ...userData } = userCreated;
        await this.mailService.sendMail(userData.email, userData.verificationToken);
        await queryRunner.commitTransaction();
        return userData;
      }
    } catch (err) {
      Logger.error('Registration error', JSON.stringify(err), 'AuthService.register');
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePassword(id, { oldPassword, newPassword }: { oldPassword: string, newPassword: string }) {
    const user = await this.usersService.findOne(id);
    if (user && !await this.authUtils.comparePasswords({ password: oldPassword, hashedPassword: user.password })) {
      throw new UnauthorizedException('Invalid password');
    }
    user.password = await this.authUtils.hashPassword(newPassword);
    return this.usersService.updateOne(id, user);
  }

  async verifyUser({ email, token }: { email: string, token: string }) {
    return this.usersService.verifyUser({ email, token })
  }
}
