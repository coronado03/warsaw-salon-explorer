import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalonsModule } from './salons/salons.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER ?? 'salon',
      password: process.env.DB_PASSWORD ?? 'salon',
      database: process.env.DB_NAME ?? 'salons',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SalonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
