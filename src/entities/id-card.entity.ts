import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({
  name: 'id_card',
})
export class IdCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '身份证号',
  })
  cardName: string;

  // 在 IdCard 的 Entity 添加一个 user 列，指定它和 User 是 @OneToTone 一对一的关系。
  // 还要指定 @JoinColum 也就是外键列在 IdCard 对应的表里维护：
  @JoinColumn()
  @OneToOne(() => User, {
    // cascade 不是数据库的那个级联，而是告诉 typeorm 当你增删改一个 Entity 的时候，是否级联增删改它关联的 Entity。
    // 这样我们就不用自己保存 user 了
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
  // CASCADE： 主表主键更新，从表关联记录的外键跟着更新，主表记录删除，从表关联记录删除
  // SET NULL：主表主键更新或者主表记录删除，从表关联记录的外键设置为 null
  // RESTRICT：只有没有从表的关联记录时，才允许删除主表记录或者更新主表记录的主键 id
  // NO ACTION： 同 RESTRICT，只是 sql 标准里分了 4 种，但 mysql 里 NO ACTION 等同于 RESTRICT。
}
