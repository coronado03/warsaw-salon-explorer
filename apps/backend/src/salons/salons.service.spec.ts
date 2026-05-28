import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SalonsService } from './salons.service';
import { Salon } from './entities/salon.entity';

const mockSalon = (): Salon =>
  ({
    id: 'uuid-1',
    name: 'Test Salon',
    address: 'ul. Marszałkowska 1, Warszawa',
    district: 'Śródmieście',
    phone: '+48 22 123 456',
    website: 'https://test.pl',
    services: ['Haircut', 'Colouring'],
    priceRange: '€€',
    rating: 4.5,
    reviewCount: 120,
    latitude: 52.23,
    longitude: 21.01,
    googlePlaceId: 'ChIJ_place_id',
  } as Salon);

const buildQb = (results: Salon[] = [], total = results.length) => ({
  andWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([results, total]),
});

const mockRepo = (salon: Salon | null = null) => ({
  createQueryBuilder: jest.fn(),
  findOneBy: jest.fn().mockResolvedValue(salon),
  save: jest.fn().mockImplementation(async (s) => s),
  create: jest.fn().mockImplementation((dto) => ({ ...dto })),
});

describe('SalonsService', () => {
  let service: SalonsService;
  let repo: ReturnType<typeof mockRepo>;

  beforeEach(async () => {
    repo = mockRepo(mockSalon());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalonsService,
        { provide: getRepositoryToken(Salon), useValue: repo },
      ],
    }).compile();

    service = module.get<SalonsService>(SalonsService);
  });

  describe('findAll', () => {
    it('returns paginated data with totals', async () => {
      const salon = mockSalon();
      const qb = buildQb([salon]);
      repo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({});

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('applies district filter', async () => {
      const qb = buildQb([]);
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ district: 'Mokotów' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'salon.district = :district',
        { district: 'Mokotów' },
      );
    });

    it('applies search filter on name and address', async () => {
      const qb = buildQb([]);
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ search: 'beauty' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(salon.name ILIKE :search OR salon.address ILIKE :search)',
        { search: '%beauty%' },
      );
    });

    it('applies service filter', async () => {
      const qb = buildQb([]);
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ service: 'Haircut' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'salon.services ILIKE :service',
        { service: '%Haircut%' },
      );
    });

    it('paginates with skip and take', async () => {
      const qb = buildQb([]);
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ page: 3, limit: 10 });

      expect(qb.skip).toHaveBeenCalledWith(20);
      expect(qb.take).toHaveBeenCalledWith(10);
    });

    it('defaults to page 1 with limit 12', async () => {
      const qb = buildQb([]);
      repo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.skip).toHaveBeenCalledWith(0);
      expect(qb.take).toHaveBeenCalledWith(12);
    });

    it('calculates totalPages correctly', async () => {
      const qb = buildQb([], 25);
      repo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ limit: 10 });

      expect(result.totalPages).toBe(3);
    });
  });

  describe('findOne', () => {
    it('returns a salon by id', async () => {
      const result = await service.findOne('uuid-1');
      expect(result.id).toBe('uuid-1');
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
    });

    it('throws NotFoundException when salon does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('merges attrs and saves', async () => {
      const result = await service.update('uuid-1', { name: 'New Name' });
      expect(result.name).toBe('New Name');
      expect(repo.save).toHaveBeenCalled();
    });

    it('throws NotFoundException when salon does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.update('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });
});
