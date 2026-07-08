import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Category } from '../src/categories/categories.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication<App>;
  let categoryRepository: Repository<Category>;
  let createdCategoryId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    categoryRepository = moduleFixture.get<Repository<Category>>(getRepositoryToken(Category));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await categoryRepository.clear();
  });

  describe('/categories (POST)', () => {
    it('should create a new category', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Fiction',
          description: 'Fiction books',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Fiction');
          expect(res.body.description).toBe('Fiction books');
          createdCategoryId = res.body.id;
        });
    });

    it('should return 400 when name is missing', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .send({
          description: 'Test category',
        })
        .expect(400);
    });

    it('should return 409 when category name already exists', () => {
      return request(app.getHttpServer())
        .post('/categories')
        .send({
          name: 'Fiction',
          description: 'Fiction books',
        })
        .expect(201)
        .then(() =>
          request(app.getHttpServer())
            .post('/categories')
            .send({
              name: 'Fiction',
              description: 'Another fiction',
            })
            .expect(409),
        );
    });
  });

  describe('/categories (GET)', () => {
    beforeEach(async () => {
      await categoryRepository.save({
        name: 'Fiction',
        description: 'Fiction books',
      });
      await categoryRepository.save({
        name: 'Non-Fiction',
        description: 'Non-Fiction books',
      });
    });

    it('should return all categories', () => {
      return request(app.getHttpServer())
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('/categories/:id (GET)', () => {
    let categoryId: number;

    beforeEach(async () => {
      const category = await categoryRepository.save({
        name: 'Fiction',
        description: 'Fiction books',
      });
      categoryId = category.id;
    });

    it('should return a category by id', () => {
      return request(app.getHttpServer())
        .get(`/categories/${categoryId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', categoryId);
          expect(res.body.name).toBe('Fiction');
        });
    });

    it('should return 404 when category not found', () => {
      return request(app.getHttpServer()).get('/categories/999').expect(404);
    });
  });

  describe('/categories/:id (PATCH)', () => {
    let categoryId: number;

    beforeEach(async () => {
      const category = await categoryRepository.save({
        name: 'Fiction',
        description: 'Fiction books',
      });
      categoryId = category.id;
    });

    it('should update a category', () => {
      return request(app.getHttpServer())
        .patch(`/categories/${categoryId}`)
        .send({
          name: 'Updated Fiction',
          description: 'Updated description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('Updated Fiction');
          expect(res.body.description).toBe('Updated description');
        });
    });

    it('should return 404 when category not found', () => {
      return request(app.getHttpServer())
        .patch('/categories/999')
        .send({
          name: 'Updated',
        })
        .expect(404);
    });

    it('should return 409 when updating to an existing category name', async () => {
      await categoryRepository.save({
        name: 'Non-Fiction',
        description: 'Non-Fiction books',
      });

      return request(app.getHttpServer())
        .patch(`/categories/${categoryId}`)
        .send({
          name: 'Non-Fiction',
        })
        .expect(409);
    });
  });

  describe('/categories/:id (DELETE)', () => {
    let categoryId: number;

    beforeEach(async () => {
      const category = await categoryRepository.save({
        name: 'Fiction',
        description: 'Fiction books',
      });
      categoryId = category.id;
    });

    it('should delete a category', () => {
      return request(app.getHttpServer())
        .delete(`/categories/${categoryId}`)
        .expect(204);
    });

    it('should return 404 when category not found', () => {
      return request(app.getHttpServer()).delete('/categories/999').expect(404);
    });
  });
});