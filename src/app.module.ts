import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConfigurationKeyPaths,
  getConfiguration,
} from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdCard } from './entities/id-card.entity';
import { User } from './entities/user.entity';
import { Department } from './entities/department.entity';
import { Employee } from './entities/employee.entity';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';

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
          logging: configService.get('database.logging'),
          entities: configService.get('database.entities'),
          autoLoadEntities: configService.get<boolean>(
            'database.autoLoadEntities' as any,
          ),
          synchronize: configService.get<boolean>('database.synchronize'),
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      IdCard,
      Department,
      Employee,
      Article,
      Tag,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
