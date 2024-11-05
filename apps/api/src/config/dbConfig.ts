import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'test',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // 엔티티 경로 설정
  synchronize: true, // 개발 중에만 사용
};
