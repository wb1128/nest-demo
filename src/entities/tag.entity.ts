import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  //   一个标签对应多个文章
  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}
