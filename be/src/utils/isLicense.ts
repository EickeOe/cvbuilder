import { LICENSE_ROLE } from 'src/enums/license.enum'
import { LicenseModel } from 'src/license/license.model'

export const isLicenseCollaborator = (license: LicenseModel) => {
  if (license && license.role === LICENSE_ROLE.COLLABORATOR) {
    return true
  }
  return false
}

export const isLicenseOwner = (license: LicenseModel) => {
  if (license && license.role === LICENSE_ROLE.OWNER) {
    return true
  }
  return false
}
