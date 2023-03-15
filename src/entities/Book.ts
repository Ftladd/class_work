import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Review } from './Review';
import { Author } from './Author';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  bookId: string;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  pubYear: number | undefined;

  @Column({ default: false })
  publicDomain: boolean;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Relation<Review>[];

  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable()
  author: Relation<Author>[];
}
