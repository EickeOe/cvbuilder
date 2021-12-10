import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join, resolve } from 'path'
import { AppModel } from './app/app.model'
import { GraphQLModule } from '@nestjs/graphql'
import { AppModule as AModule } from './app/app.module'
import { PageInfoModel } from './model/page-info.model'
import { UserModel } from './user/user.model'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { APP_GUARD } from '@nestjs/core'
import { GqlAuthGuard } from './auth/gql-auth.guard'
import { StarredModel } from './starred/starred.model'
import { StarredModule } from './starred/starred.module'
import { LicenseModule } from './license/license.module'
import { LicenseModel } from './license/license.model'
import { VisitRecordModule } from './visit-record/visit-record.module'
import { VisitRecordModel } from './visit-record/visit-record.model'
import { DocModule } from './doc/doc.module'
import { DocModel } from './doc/doc.model'
@Module({
  imports: [
    AModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'eick',
      database: 'cvb',
      logging: true,
      entities: [AppModel, UserModel, StarredModel, LicenseModel, VisitRecordModel, DocModel],
      synchronize: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true
    }),
    UserModule,
    AuthModule,
    StarredModule,
    LicenseModule,
    VisitRecordModule,
    DocModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard
    }
  ]
})
export class AppModule {}
