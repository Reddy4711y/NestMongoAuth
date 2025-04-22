import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SessionPayload, TokenPurpose } from './entities/auth.entity';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private res: Response;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signupData: SignUpDto) {
    const { email, password, name } = signupData;

    //check if email in use
    const isEmailInUse = await this.userModel.findOne({ email });

    if (isEmailInUse) {
      throw new BadRequestException('Email already in use');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a user

    await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    return { message: 'User Registered Successfully!' };
  }

  async login(loginData: LoginDto, res: Response) {
    this.res = res;

    const { email, password } = loginData;
    // find user exists by email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException("email doesn't exist");
    }

    //compare entered password with existed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Incorrect Password');
    }

    return this.generateTokenResponse(user);
  }

  // refreshSession(user: SessionPayload) {
  //   return this.generateTokenResponse(user as User);
  // }

  setCookie(name: string, token: string, maxAge: number) {
    this.res.cookie(name, token, {
      httpOnly: true,
      // sameSite:'strict',
      maxAge: 1000 * maxAge,
    });
  }

  generateTokenResponse(user: User) {
    const { name, email, id } = user;
    const payload = { id, email, name };
    const sessionToken = this.generateToken(
      'session_token',
      payload,
      TokenPurpose.SESSION,
      60 * 60,
    );

    const refreshToken = this.generateToken(
      'refresh_token',
      payload,
      TokenPurpose.REFRESH,
      24 * 60 * 60,
    );

    return {
      user: payload,
      sessionToken,
      refreshToken,
    };
  }

  generateToken(
    name: string,
    payload: SessionPayload,
    issuer: TokenPurpose,
    expiresIn: number,
  ) {
    const token = this.jwtService.sign(payload, {
      expiresIn,
      issuer,
    });

    this.setCookie(name, token, expiresIn);

    return token;
  }
}
