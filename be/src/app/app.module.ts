import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModel } from './app.model';

@Module({
  imports: [TypeOrmModule.forFeature([AppModel])],
  providers: [AppService, AppResolver],
  exports: [AppService],
})
export class AppModule { }
