import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salon } from './entities/salon.entity';

@Injectable()
export class SalonsService {
  constructor(
    @InjectRepository(Salon)
    private readonly salonsRepository: Repository<Salon>,
  ) {}

  async findAll(filters: {
    district?: string;
    search?: string;
    service?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;

    const qb = this.salonsRepository.createQueryBuilder('salon');

    if (filters.district) {
      qb.andWhere('salon.district = :district', { district: filters.district });
    }

    if (filters.search) {
      qb.andWhere(
        '(salon.name ILIKE :search OR salon.address ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.service) {
      qb.andWhere('salon.services ILIKE :service', {
        service: `%${filters.service}%`,
      });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const salon = await this.salonsRepository.findOneBy({ id });
    if (!salon) throw new NotFoundException(`Salon #${id} not found`);
    return salon;
  }

  async update(id: string, attrs: Partial<Salon>) {
    const salon = await this.findOne(id);
    Object.assign(salon, attrs);
    return this.salonsRepository.save(salon);
  }
}
