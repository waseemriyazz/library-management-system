import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { Author } from './authors.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repository: Repository<Author>;

  const mockAuthor: Author = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'A famous author',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    repository = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      mockRepository.find.mockResolvedValue([mockAuthor]);
      const result = await service.findAll();
      expect(result).toEqual([mockAuthor]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an author by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockAuthor);
      const result = await service.findOne(1);
      expect(result).toEqual(mockAuthor);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when author not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        bio: 'Another famous author',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockAuthor);
      mockRepository.save.mockResolvedValue(mockAuthor);

      const result = await service.create(createAuthorDto);
      expect(result).toEqual(mockAuthor);
      expect(mockRepository.create).toHaveBeenCalledWith(createAuthorDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when author name already exists', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John Doe',
        email: 'different@example.com',
      };

      mockRepository.findOne.mockResolvedValue(mockAuthor);

      await expect(service.create(createAuthorDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { name: 'John Doe' } });
    });

    it('should throw ConflictException when author email already exists', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'Jane Smith',
        email: 'john@example.com',
      };

      mockRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockAuthor);

      await expect(service.create(createAuthorDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        name: 'John Updated',
        bio: 'Updated bio',
      };

      const updatedAuthor = { ...mockAuthor, ...updateAuthorDto };
      
      mockRepository.findOne
        .mockResolvedValueOnce(mockAuthor)
        .mockResolvedValueOnce(null);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedAuthor);

      const result = await service.update(1, updateAuthorDto);
      expect(result).toEqual(updatedAuthor);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateAuthorDto);
    });

    it('should throw ConflictException when updating to an existing author name', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        name: 'Jane Smith',
      };

      const existingAuthor = { ...mockAuthor, id: 2, name: 'Jane Smith' };

      mockRepository.findOne
        .mockResolvedValueOnce(mockAuthor)
        .mockResolvedValueOnce(existingAuthor);

      await expect(service.update(1, updateAuthorDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when updating to an existing author email', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        email: 'jane@example.com',
      };

      const existingAuthor = { ...mockAuthor, id: 2, email: 'jane@example.com' };

      mockRepository.findOne
        .mockResolvedValueOnce(mockAuthor)
        .mockResolvedValueOnce(existingAuthor);

      await expect(service.update(1, updateAuthorDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when author not found', async () => {
      const updateAuthorDto: UpdateAuthorDto = {
        name: 'Updated',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateAuthorDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an author', async () => {
      mockRepository.findOne.mockResolvedValue(mockAuthor);
      mockRepository.remove.mockResolvedValue(mockAuthor);

      await service.remove(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockAuthor);
    });

    it('should throw NotFoundException when author not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});