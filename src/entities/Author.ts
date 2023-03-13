import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Relation } from 'typeorm';
import { Book } from './Book';

@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  authorId: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: 'unknown' })
  originCountry: string;

  @ManyToMany(() => Book, (book) => book.author)
  books: Relation<Book>[];
}
