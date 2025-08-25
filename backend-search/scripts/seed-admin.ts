import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    await authService.register({
      username: 'admin2',
      password: 'admin123',
      fullName: 'System Administrator',
      department: 'IT Security',
      role: 'admin',
    });
    console.log('Admin user created successfully');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin user:', error.message);
    }
  }

  await app.close();
}

seedAdmin();
