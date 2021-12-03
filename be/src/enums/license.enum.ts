import { registerEnumType } from '@nestjs/graphql'

export enum LICENSE_ROLE {
  MEMBER = 'member',
  OWNER = 'owner'
}
registerEnumType(LICENSE_ROLE, {
  name: 'LICENSE_ROLE'
})
