import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Category } from './categories.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockCategory: Category = {
    id: 1,
    name: 'Fiction',
    description: 'Fiction books',
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
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      mockRepository.find.mockResolvedValue([mockCategory]);
      const result = await service.findAll();
      expect(result).toEqual([mockCategory]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategory);
      const result = await service.findOne(1);
      expect(result).toEqual(mockCategory);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Science Fiction',
        description: 'Sci-fi books',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockCategory);
      mockRepository.save.mockResolvedValue(mockCategory);

      const result = await service.create(createCategoryDto);
      expect(result).toEqual(mockCategory);
      expect(mockRepository.create).toHaveBeenCalledWith(createCategoryDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when category name already exists', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Fiction',
        description: 'Fiction books',
      };

      mockRepository.findOne.mockResolvedValue(mockCategory);

      await expect(service.create(createCategoryDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { name: 'Fiction' } });
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Fiction',
        description: 'Updated description',
      };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      
      mockRepository.findOne
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce(null);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue(updatedCategory);

      const result = await service.update(1, updateCategoryDto);
      expect(result).toEqual(updatedCategory);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });

    it('should throw ConflictException when updating to an existing category name', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Non-Fiction',
      };

      const existingCategory = { ...mockCategory, id: 2, name: 'Non-Fiction' };

      mockRepository.findOne
        .mockResolvedValueOnce(mockCategory)
        .mockResolvedValueOnce(existingCategory);

      await expect(service.update(1, updateCategoryDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when category not found', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateCategoryDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockRepository.findOne.mockResolvedValue(mockCategory);
      mockRepository.remove.mockResolvedValue(mockCategory);

      await service.remove(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});