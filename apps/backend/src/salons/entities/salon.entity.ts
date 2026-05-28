import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Salon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  district: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column('simple-array', { nullable: true })
  services: string[];

  @Column({ nullable: true })
  priceRange: string;

  @Column('float', { nullable: true })
  rating: number;

  @Column({ nullable: true })
  reviewCount: number;

  @Column('float', { nullable: true })
  latitude: number;

  @Column('float', { nullable: true })
  longitude: number;

  @Column({ nullable: true, unique: true })
  googlePlaceId: string;
}
