import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@auth/auth.module';
import { DynamicModule } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './users/entity/user.entity';

@Module({})
export class AppModule {
  static forRoot(): DynamicModule {
    return {
      module: AppModule,
      controllers: [AppController],
      imports: [
        ConfigModule.forRoot(),
        AuthModule,
        UsersModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DB_HOST') || 'localhost',
            port: 5432,
            username: configService.get<string>('DB_USER') || 'postgres',
            password: configService.get<string>('DB_PASS') || 'test',
            database: configService.get<string>('DB_NAME') || 'test',
            entities: [UserEntity],
            migrations: ['src/migration/*{.ts,.js}'],
            cli: {
              migrationsDir: 'src/migration',
            },
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [AppService],
    };
  }
}
