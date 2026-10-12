import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  doLogin(loginDto: LoginDto) {
   console.log(loginDto instanceof LoginDto, loginDto);
    return loginDto;
  }
}