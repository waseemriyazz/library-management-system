import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './books.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorsService } from '../authors/authors.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private authorsService: AuthorsService,
    private categoriesService: CategoriesService,
  ) {}

  /**
   * Get all books with author and category relations
   * @returns Promise<Book[]>
   */
  async findAll(): Promise<Book[]> {
    return this.booksRepository.find({
      relations: ['author', 'category'],
    });
  }

  /**
   * Get a single book by ID with relations
   * @param id - Book ID
   * @returns Promise<Book>
   * @throws NotFoundException if book not found
   */
  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  /**
   * Create a new book
   * @param createBookDto - Book creation data
   * @returns Promise<Book>
   * @throws ConflictException if ISBN already exists
   * @throws NotFoundException if author or category doesn't exist
   */
  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Check for duplicate ISBN
    const existingIsbn = await this.booksRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });

    if (existingIsbn) {
      throw new ConflictException('Book with this ISBN already exists');
    }

    // Verify author exists
    try {
      await this.authorsService.findOne(createBookDto.authorId);
    } catch (error) {
      throw new NotFoundException(`Author with ID ${createBookDto.authorId} not found`);
    }

    // Verify category exists
    try {
      await this.categoriesService.findOne(createBookDto.categoryId);
    } catch (error) {
      throw new NotFoundException(`Category with ID ${createBookDto.categoryId} not found`);
    }

    const book = this.booksRepository.create(createBookDto);
    return this.booksRepository.save(book);
  }

  /**
   * Update an existing book
   * @param id - Book ID
   * @param updateBookDto - Book update data
   * @returns Promise<Book>
   * @throws NotFoundException if book not found
   * @throws ConflictException if ISBN already exists
   */
  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    // Check for ISBN conflict if ISBN is being updated
    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingIsbn = await this.booksRepository.findOne({
        where: { isbn: updateBookDto.isbn },
      });

      if (existingIsbn) {
        throw new ConflictException('Book with this ISBN already exists');
      }
    }

    // Verify author exists if authorId is being updated
    if (updateBookDto.authorId && updateBookDto.authorId !== book.authorId) {
      try {
        await this.authorsService.findOne(updateBookDto.authorId);
      } catch (error) {
        throw new NotFoundException(`Author with ID ${updateBookDto.authorId} not found`);
      }
    }

    // Verify category exists if categoryId is being updated
    if (updateBookDto.categoryId && updateBookDto.categoryId !== book.categoryId) {
      try {
        await this.categoriesService.findOne(updateBookDto.categoryId);
      } catch (error) {
        throw new NotFoundException(`Category with ID ${updateBookDto.categoryId} not found`);
      }
    }

    await this.booksRepository.update(id, updateBookDto);
    return this.findOne(id);
  }

  /**
   * Delete a book
   * @param id - Book ID
   * @returns Promise<void>
   * @throws NotFoundException if book not found
   */
  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }
}