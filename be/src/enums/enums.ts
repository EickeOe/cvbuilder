import { registerEnumType } from '@nestjs/graphql'

export enum ENTITY_TYPE {
  APP = 'app'
}
registerEnumType(ENTITY_TYPE, {
  name: 'ENTITY_TYPE'
})
