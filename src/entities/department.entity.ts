import { Employee } from './employee.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  name: string;

  // 一对一的时候我们还通过 @JoinColumn 来指定外键列，为什么一对多就不需要了呢？
  // 因为一对多的关系只可能是在多的那一方保存外键呀！
  // 所以并不需要 @JoinColumn。
  // 不过你也可以通过 @JoinColumn 来修改外键列的名字
  @OneToMany(() => Employee, (employee) => employee.department, {
    cascade: true,
  })
  employees: Employee[];
}
