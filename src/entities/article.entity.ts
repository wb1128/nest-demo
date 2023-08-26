import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    comment: '文章标题',
  })
  title: string;

  @Column({
    type: 'text',
    comment: '文章内容',
  })
  content: string;

  //   一篇文章可以有多个标签
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()
  tags: Tag[];
}
