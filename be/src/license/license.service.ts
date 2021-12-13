import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DocService } from 'src/doc/doc.service'
import { ENTITY_TYPE } from 'src/enums/enums'
import { LICENSE_ROLE } from 'src/enums/license.enum'
import { PageInfoModel } from 'src/model/page-info.model'
import { pageInfo2typeorm } from 'src/utils/page-info2typeorm'
import { Repository } from 'typeorm'
import { LicenseModel } from './license.model'

@Injectable()
export class LicenseService {
  constructor(
    @InjectRepository(LicenseModel)
    private readonly repository: Repository<LicenseModel>,
    private readonly docService: DocService
  ) {}

  async addLicense(userId: string, licensableId: string, licensableType: ENTITY_TYPE, role: LICENSE_ROLE) {
    const license = await this.findOne({ userId, licensableId, licensableType })
    if (license) {
      return this.repository.save({ ...license, role })
    }
    this.repository.save({ userId, licensableId, licensableType, role })
  }

  async removeLicense(id: string) {
    return this.repository.delete(id)
  }

  async findAndCount(license: Partial<LicenseModel>, pageInfo: PageInfoModel) {
    const page = pageInfo2typeorm(pageInfo)

    return this.repository.findAndCount({
      where: { ...license },
      ...page
    })
  }

  async findOne(license: Partial<LicenseModel>) {
    return this.repository.findOne({
      where: { ...license }
    })
  }

  async findAppLicense(userId: string, appId: string) {
    return await this.findOne({ userId, licensableId: appId, licensableType: ENTITY_TYPE.APP })
  }

  async findDocLicense(userId: string, docId: string) {
    const docs = await this.docService.findParentPath(docId)
    for (let doc of docs) {
      const license = await this.findOne({ userId, licensableId: doc.id, licensableType: ENTITY_TYPE.DOC })
      if (license) {
        return license
      }
    }
  }

  async findLicense(userId: string, licensableId: string, licensableType: ENTITY_TYPE) {
    if (licensableType === ENTITY_TYPE.APP) {
      return this.findAppLicense(userId, licensableId)
    }
    if (licensableType === ENTITY_TYPE.DOC) {
      return this.findDocLicense(userId, licensableId)
    }
  }

  async isLicenseOwner() {}
}
