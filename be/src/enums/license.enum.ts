import { registerEnumType } from '@nestjs/graphql'

export enum LICENSE_ROLE {
  COLLABORATOR = 'COLLABORATOR',
  OWNER = 'OWNER'
}
registerEnumType(LICENSE_ROLE, {
  name: 'LICENSE_ROLE'
})
