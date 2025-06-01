import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: any) {
    const userExists = await this.userRepo.findOne({ where: { email: body.email } });
    if (userExists) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = this.userRepo.create({ email: body.email, password: hashedPassword });
    await this.userRepo.save(user);

    return { message: 'User registered successfully' };
  }

  async login(body: any) {
    const user = await this.userRepo.findOne({ where: { email: body.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(body.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return { token };
  }
}