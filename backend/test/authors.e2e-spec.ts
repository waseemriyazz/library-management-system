import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { Author } from '../src/authors/authors.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AuthorsController (e2e)', () => {
  let app: INestApplication<App>;
  let authorRepository: Repository<Author>;
  let createdAuthorId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authorRepository = moduleFixture.get<Repository<Author>>(getRepositoryToken(Author));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await authorRepository.clear();
  });

  describe('/authors (POST)', () => {
    it('should create a new author', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          bio: 'A famous author',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('John Doe');
          expect(res.body.email).toBe('john@example.com');
          expect(res.body.bio).toBe('A famous author');
          createdAuthorId = res.body.id;
        });
    });

    it('should return 400 when name is missing', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send({
          email: 'john@example.com',
        })
        .expect(400);
    });

    it('should return 409 when author name already exists', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        })
        .expect(201)
        .then(() =>
          request(app.getHttpServer())
            .post('/authors')
            .send({
              name: 'John Doe',
              email: 'different@example.com',
            })
            .expect(409),
        );
    });

    it('should return 409 when author email already exists', () => {
      return request(app.getHttpServer())
        .post('/authors')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        })
        .expect(201)
        .then(() =>
          request(app.getHttpServer())
            .post('/authors')
            .send({
              name: 'Jane Smith',
              email: 'john@example.com',
            })
            .expect(409),
        );
    });
  });

  describe('/authors (GET)', () => {
    beforeEach(async () => {
      await authorRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'A famous author',
      });
      await authorRepository.save({
        name: 'Jane Smith',
        email: 'jane@example.com',
        bio: 'Another famous author',
      });
    });

    it('should return all authors', () => {
      return request(app.getHttpServer())
        .get('/authors')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });
  });

  describe('/authors/:id (GET)', () => {
    let authorId: number;

    beforeEach(async () => {
      const author = await authorRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'A famous author',
      });
      authorId = author.id;
    });

    it('should return an author by id', () => {
      return request(app.getHttpServer())
        .get(`/authors/${authorId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', authorId);
          expect(res.body.name).toBe('John Doe');
          expect(res.body.email).toBe('john@example.com');
        });
    });

    it('should return 404 when author not found', () => {
      return request(app.getHttpServer()).get('/authors/999').expect(404);
    });
  });

  describe('/authors/:id (PATCH)', () => {
    let authorId: number;

    beforeEach(async () => {
      const author = await authorRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'A famous author',
      });
      authorId = author.id;
    });

    it('should update an author', () => {
      return request(app.getHttpServer())
        .patch(`/authors/${authorId}`)
        .send({
          name: 'John Updated',
          bio: 'Updated bio',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe('John Updated');
          expect(res.body.bio).toBe('Updated bio');
        });
    });

    it('should return 404 when author not found', () => {
      return request(app.getHttpServer())
        .patch('/authors/999')
        .send({
          name: 'Updated',
        })
        .expect(404);
    });

    it('should return 409 when updating to an existing author name', async () => {
      await authorRepository.save({
        name: 'Jane Smith',
        email: 'jane@example.com',
        bio: 'Another famous author',
      });

      return request(app.getHttpServer())
        .patch(`/authors/${authorId}`)
        .send({
          name: 'Jane Smith',
        })
        .expect(409);
    });

    it('should return 409 when updating to an existing author email', async () => {
      await authorRepository.save({
        name: 'Jane Smith',
        email: 'jane@example.com',
        bio: 'Another famous author',
      });

      return request(app.getHttpServer())
        .patch(`/authors/${authorId}`)
        .send({
          email: 'jane@example.com',
        })
        .expect(409);
    });
  });

  describe('/authors/:id (DELETE)', () => {
    let authorId: number;

    beforeEach(async () => {
      const author = await authorRepository.save({
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'A famous author',
      });
      authorId = author.id;
    });

    it('should delete an author', () => {
      return request(app.getHttpServer())
        .delete(`/authors/${authorId}`)
        .expect(204);
    });

    it('should return 404 when author not found', () => {
      return request(app.getHttpServer()).delete('/authors/999').expect(404);
    });
  });
});