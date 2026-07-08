import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Book } from './books.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthorsService } from '../authors/authors.service';
import { CategoriesService } from '../categories/categories.service';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;
  let authorsService: AuthorsService;
  let categoriesService: CategoriesService;

  const mockBook: Book = {
    id: 1,
    title: 'Test Book',
    isbn: '9781234567890',
    description: 'A test book',
    publishedDate: new Date('2023-01-01'),
    pageCount: 300,
    available: true,
    authorId: 1,
    categoryId: 1,
    author: {
      id: 1,
      name: 'Test Author',
      createdAt: new Date(),
      updatedAt: new Date(),
      books: [],
    },
    category: {
      id: 1,
      name: 'Test Category',
      createdAt: new Date(),
      updatedAt: new Date(),
      books: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthorsService = {
    findOne: jest.fn(),
  };

  const mockCategoriesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
    authorsService = module.get<AuthorsService>(AuthorsService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      mockRepository.find.mockResolvedValue([mockBook]);
      const result = await service.findAll();
      expect(result).toEqual([mockBook]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['author', 'category'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);
      const result = await service.findOne(1);
      expect(result).toEqual(mockBook);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author', 'category'],
      });
    });

    it('should throw NotFoundException when book not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['author', 'category'],
      });
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        isbn: '9789876543210',
        authorId: 1,
        categoryId: 1,
      };

      mockRepository.findOne.mockResolvedValueOnce(null); // ISBN check
      mockAuthorsService.findOne.mockResolvedValue({ id: 1, name: 'Test Author' });
      mockCategoriesService.findOne.mockResolvedValue({ id: 1, name: 'Test Category' });
      mockRepository.create.mockReturnValue(mockBook);
      mockRepository.save.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);
      expect(result).toEqual(mockBook);
      expect(mockRepository.create).toHaveBeenCalledWith(createBookDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when ISBN already exists', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        isbn: '9781234567890',
        authorId: 1,
        categoryId: 1,
      };

      mockRepository.findOne.mockResolvedValue(mockBook);

      await expect(service.create(createBookDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { isbn: '9781234567890' },
      });
    });

    it('should throw NotFoundException when author not found', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        isbn: '9789876543210',
        authorId: 999,
        categoryId: 1,
      };

      mockRepository.findOne.mockResolvedValueOnce(null); // ISBN check
      mockAuthorsService.findOne.mockRejectedValue(new NotFoundException('Author not found'));

      await expect(service.create(createBookDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when category not found', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        isbn: '9789876543210',
        authorId: 1,
        categoryId: 999,
      };

      mockRepository.findOne.mockResolvedValueOnce(null); // ISBN check
      mockAuthorsService.findOne.mockResolvedValue({ id: 1, name: 'Test Author' });
      mockCategoriesService.findOne.mockRejectedValue(new NotFoundException('Category not found'));

      await expect(service.create(createBookDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        pageCount: 350,
      };

      const updatedBook = { ...mockBook, title: 'Updated Book', pageCount: 350 };

      mockRepository.findOne
        .mockResolvedValueOnce(mockBook) // findOne for validation
        .mockResolvedValueOnce(updatedBook); // Final findOne after update
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateBookDto);
      expect(result).toEqual(updatedBook);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateBookDto);
    });

    it('should throw ConflictException when updating to an existing ISBN', async () => {
      const updateBookDto: UpdateBookDto = {
        isbn: '9789999999999',
      };

      const existingBook = { ...mockBook, id: 2, isbn: '9789999999999' };

      mockRepository.findOne
        .mockResolvedValueOnce(mockBook) // findOne for validation
        .mockResolvedValueOnce(existingBook); // ISBN conflict check

      await expect(service.update(1, updateBookDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when book not found', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateBookDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when updating to non-existent author', async () => {
      const updateBookDto: UpdateBookDto = {
        authorId: 999,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(mockBook); // findOne for validation
      mockAuthorsService.findOne.mockRejectedValue(new NotFoundException('Author not found'));

      await expect(service.update(1, updateBookDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when updating to non-existent category', async () => {
      const updateBookDto: UpdateBookDto = {
        categoryId: 999,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(mockBook); // findOne for validation
      mockCategoriesService.findOne.mockRejectedValue(new NotFoundException('Category not found'));

      await expect(service.update(1, updateBookDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);
      mockRepository.remove.mockResolvedValue(mockBook);

      await service.remove(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockBook);
    });

    it('should throw NotFoundException when book not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});