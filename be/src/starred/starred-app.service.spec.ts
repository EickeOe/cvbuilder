import { Test, TestingModule } from '@nestjs/testing'
import { StarredService } from './starred.service'

describe('StarredService', () => {
  let service: StarredService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarredService]
    }).compile()

    service = module.get<StarredService>(StarredService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
