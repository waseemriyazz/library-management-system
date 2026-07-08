import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './categories.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory: Category = {
    id: 1,
    name: 'Fiction',
    description: 'Fiction books',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCategoriesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Fiction',
        description: 'Fiction books',
      };

      mockCategoriesService.create.mockResolvedValue(mockCategory);
      const result = await controller.create(createCategoryDto);
      expect(result).toEqual(mockCategory);
      expect(mockCategoriesService.create).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      mockCategoriesService.findAll.mockResolvedValue([mockCategory]);
      const result = await controller.findAll();
      expect(result).toEqual([mockCategory]);
      expect(mockCategoriesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockCategory);
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Fiction',
        description: 'Updated description',
      };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      mockCategoriesService.update.mockResolvedValue(updatedCategory);
      const result = await controller.update('1', updateCategoryDto);
      expect(result).toEqual(updatedCategory);
      expect(mockCategoriesService.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockCategoriesService.remove.mockResolvedValue(undefined);
      await controller.remove('1');
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(1);
    });
  });
});