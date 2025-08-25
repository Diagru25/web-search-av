const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');
const { AuthService } = require('../dist/src/auth/auth.service');

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    await authService.register({
      username: 'admin',
      password: 'Admin@123',
      fullName: 'System Administrator',
      department: 'IT Security',
      role: 'admin',
    });
    console.log('Admin user created successfully');
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.log('Admin user already exists');
    } else {
      console.error(
        'Error creating admin user:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  await app.close();
}

seedAdmin();
