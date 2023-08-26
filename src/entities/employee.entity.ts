import { Department } from './department.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  name: string;

  //   在多的一方使用 @ManyToOne 装饰器
  @ManyToOne(() => Department, {
    // 不然，双方都级联保存，那不就无限循环了么
    // cascade: true
  })
  department: Department;
}
