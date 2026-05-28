import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SalonsService } from './salons.service';
import { UpdateSalonDto } from './dto/update-salon.dto';

@Controller('salons')
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @Get()
  findAll(
    @Query('district') district?: string,
    @Query('search') search?: string,
    @Query('service') service?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.salonsService.findAll({
      district,
      search,
      service,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salonsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id') id: string, @Body() dto: UpdateSalonDto) {
    return this.salonsService.update(id, dto);
  }
}
