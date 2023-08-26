import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { IdCard } from './id-card.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
  // 用户和身份证是一对一的关系。通过第二个参数告诉 typeorm，外键是另一个 Entity 的哪个属性
  @OneToOne(() => IdCard, (idCard) => idCard.user)
  idCard: IdCard;
}
