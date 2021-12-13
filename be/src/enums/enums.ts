import { registerEnumType } from '@nestjs/graphql'

export enum ENTITY_TYPE {
  APP = 'APP',
  DOC = 'DOC'
}
registerEnumType(ENTITY_TYPE, {
  name: 'ENTITY_TYPE'
})
