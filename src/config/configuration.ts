import { User } from 'src/entities/user.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const getConfiguration = () =>
  ({
    // typeorm config
    database: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number.parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USERNAME,
      password:
        process.env.MYSQL_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
      database: process.env.MYSQL_DATABASE,
      timezone: '+08:00', // 东八区
      logging: true,
      // entities: [User],
      // autoLoadEntities: true,
      entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
      synchronize: false,
      migrations: ['dist/migrations/**/*.js'],
      // cli: {
      //   migrationsDir: 'src/migrations', 不推荐
      // },
    } as MysqlConnectionOptions,
  } as const);

export type ConfigurationType = ReturnType<typeof getConfiguration>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type ConfigurationKeyPaths = Record<NestedKeyOf<ConfigurationType>, any>;
