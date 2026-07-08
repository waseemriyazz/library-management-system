import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Author } from '../authors/authors.entity';
import { Category } from '../categories/categories.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  title!: string;

  @Column({ unique: true })
  isbn!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  publishedDate?: Date;

  @Column({ nullable: true })
  pageCount?: number;

  @Column({ default: true })
  available!: boolean;

  @Column()
  authorId!: number;

  @Column()
  categoryId!: number;

  @ManyToOne(() => Author, (author) => author.books)
  author!: Author;

  @ManyToOne(() => Category, (category) => category.books)
  category!: Category;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}