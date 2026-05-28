import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SalonsController } from './salons.controller';
import { SalonsService } from './salons.service';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Salon } from './entities/salon.entity';

const mockSalon = (): Salon =>
  ({
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Test Salon',
    address: 'ul. Marszałkowska 1, Warszawa',
    district: 'Śródmieście',
    phone: null,
    website: null,
    services: ['Haircut'],
    priceRange: '€',
    rating: 4.2,
    reviewCount: 80,
    latitude: 52.23,
    longitude: 21.01,
    googlePlaceId: 'ChIJ_abc',
  } as Salon);

const mockService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
});

describe('SalonsController', () => {
  let controller: SalonsController;
  let service: ReturnType<typeof mockService>;

  beforeEach(async () => {
    service = mockService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalonsController],
      providers: [{ provide: SalonsService, useValue: service }],
    }).compile();

    controller = module.get<SalonsController>(SalonsController);
  });

  describe('findAll', () => {
    it('delegates filters and pagination to the service', async () => {
      const page = { data: [mockSalon()], total: 1, page: 1, totalPages: 1 };
      service.findAll.mockResolvedValue(page);

      const result = await controller.findAll('Mokotów', 'test', 'Haircut', '2', '6');

      expect(service.findAll).toHaveBeenCalledWith({
        district: 'Mokotów',
        search: 'test',
        service: 'Haircut',
        page: 2,
        limit: 6,
      });
      expect(result).toBe(page);
    });

    it('handles undefined query params', async () => {
      service.findAll.mockResolvedValue({ data: [], total: 0, page: 1, totalPages: 1 });

      await controller.findAll(undefined, undefined, undefined, undefined, undefined);

      expect(service.findAll).toHaveBeenCalledWith({
        district: undefined,
        search: undefined,
        service: undefined,
        page: undefined,
        limit: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('returns the salon from the service', async () => {
      service.findOne.mockResolvedValue(mockSalon());

      const result = await controller.findOne('a1b2c3d4-e5f6-7890-abcd-ef1234567890');

      expect(service.findOne).toHaveBeenCalledWith('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(result.id).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    });

    it('propagates NotFoundException from the service', async () => {
      service.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('passes id and dto to the service and returns the result', async () => {
      const updated = { ...mockSalon(), name: 'Updated' };
      service.update.mockResolvedValue(updated);

      const dto: UpdateSalonDto = { name: 'Updated' };
      const result = await controller.update('a1b2c3d4-e5f6-7890-abcd-ef1234567890', dto);

      expect(service.update).toHaveBeenCalledWith('a1b2c3d4-e5f6-7890-abcd-ef1234567890', dto);
      expect(result.name).toBe('Updated');
    });

    it('propagates NotFoundException from the service', async () => {
      service.update.mockRejectedValue(new NotFoundException());
      await expect(controller.update('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });
});
