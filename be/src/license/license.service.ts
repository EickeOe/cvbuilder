import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
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
    private readonly repository: Repository<LicenseModel>
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
}
