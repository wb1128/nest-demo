import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdCard } from './entities/id-card.entity';
import { User } from './entities/user.entity';
import { Department } from './entities/department.entity';
import { Employee } from './entities/employee.entity';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';

@Controller()
export class AppController {
  @InjectRepository(User)
  private usersRepository: Repository<User>;
  @InjectRepository(IdCard)
  private idCardRepository: Repository<IdCard>;
  @InjectRepository(Department)
  private departmentRepository: Repository<Department>;
  @InjectRepository(Employee)
  private employeeRepository: Repository<Employee>;

  @InjectRepository(Article)
  private articleRepository: Repository<Article>;
  @InjectRepository(Tag)
  private tagRepository: Repository<Tag>;
  constructor(private readonly appService: AppService) {}

  // 一对一我们是通过 @OneToOne 和 @JoinColumn 来把 Entity 映射成数据库表：Entity 之间的引用关系，转换为数据库表之间的外键关联的关系。
  // 一对多我们是通过 @OneToMany 和 @ManyToOne 来把 Entity 映射成数据库表：它并不需要 @JoinColumn 来指定外键列，因为外键一定在多的那一边。
  // 多对多呢，我们是通过中间表来保存这种多对多的关系的：把多对多拆成了两个一对多

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('findAllIdCard')
  async findAllIdCard() {
    // return this.usersRepository.find();
    // const ics = await this.idCardRepository.find({
    //   relations: {
    //     user: true,
    //   },
    // });
    const ics = await this.idCardRepository
      .createQueryBuilder('ic')
      .leftJoinAndSelect('ic.user', 'u')
      .getMany();
    return ics;
  }

  @Get('findAllUser')
  async findAllUser() {
    return await this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.idCard', 'ic')
      .getMany();
  }

  @Get('initUserIdCard')
  async initUser() {
    const user = new User();
    user.firstName = 'guang';
    user.lastName = 'guang';
    user.age = 20;

    const idCard = new IdCard();
    idCard.cardName = '1111111';
    idCard.user = user;
    const res = await this.idCardRepository.save(idCard);
    return this.usersRepository.find({
      where: {
        idCard: [res],
      },
      relations: {
        idCard: true,
      },
    });
  }

  @Get('deleteUser')
  async deleteUser(@Query('id') id: string) {
    // 因为设置了外键的 onDelete 是 cascade，所以只要删除了 user，那关联的 idCard 就会跟着被删除。
    return await this.usersRepository.delete(id);
  }

  @Get('initDepartmentEmployee')
  async initEmployee() {
    const d1 = new Department();
    d1.name = '技术部';

    const e1 = new Employee();
    e1.name = '张三';
    // e1.department = d1;

    const e2 = new Employee();
    e2.name = '李四';
    // e2.department = d1;

    const e3 = new Employee();
    e3.name = '王五';
    // e3.department = d1;
    d1.employees = [e1, e2, e3];
    const res = await this.departmentRepository.save(d1);
    return res;
    // return this.departmentRepository.find({
    //   where: {
    //     id: res.id,
    //   },
    //   relations: {
    //     employees: true,
    //   },
    // });
  }

  @Get('findAllDepartment')
  async findAllDepartment() {
    // return await this.departmentRepository.find({
    //   // relations 其实就是 left join on
    //   relations: {
    //     employees: true,
    //   },
    // });

    const es = await await this.departmentRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.employees', 'e')
      .getMany();
    return es;
  }

  @Get('findAllEmployee')
  async findAllEmployee() {
    return await this.employeeRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.department', 'd')
      .getMany();
  }

  @Get('initArticleTag')
  async initArticleTag() {
    const a1 = new Article();
    a1.title = 'aaaa';
    a1.content = 'aaaaaaaaaa';

    const a2 = new Article();
    a2.title = 'bbbbbb';
    a2.content = 'bbbbbbbbbb';

    const t1 = new Tag();
    t1.name = 'ttt1111';

    const t2 = new Tag();
    t2.name = 'ttt2222';

    const t3 = new Tag();
    t3.name = 'ttt33333';

    a1.tags = [t1, t2];
    a2.tags = [t1, t2, t3];
    // 先保存所有的 tag，再保存 article
    await this.tagRepository.save([t1, t2, t3]);
    await this.articleRepository.save([a1, a2]);
  }

  @Get('findAllArticle')
  async findAllArticle() {
    return await this.articleRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.tags', 't')
      .getMany();
  }
  @Get('findAllTag')
  async findAllTag() {
    return await this.tagRepository.find({
      relations: {
        articles: true,
      },
    });
  }
}
