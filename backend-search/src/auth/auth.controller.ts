import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard) // Only authenticated users can create new users
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return this.authService.findById(req.user.userId);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  getAllUsers() {
    return this.authService.findAll();
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(req.user.userId, updateUserDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
