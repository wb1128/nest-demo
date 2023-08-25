import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';
import {
  ConfigurationKeyPaths,
  getConfiguration,
} from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3307,
//       username: 'root',
//       password: 'root',
//       database: 'nest-demo',
//       // entities: [User],
//       autoLoadEntities: true,
//       // synchronize: true,
//       logging: true,
//     }),
//     UsersModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigurationKeyPaths>) => {
        return {
          type: configService.get<any>('database.type'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          timezone: configService.get('database.timezone'), // 时区
          logger: configService.get('database.logger'),
          entities: configService.get('database.entities'),
          autoLoadEntities: configService.get<boolean>(
            'database.autoLoadEntities' as any,
          ),
          synchronize: configService.get<boolean>('database.synchronize'),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
