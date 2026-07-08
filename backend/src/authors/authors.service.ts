import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './authors.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorsRepository: Repository<Author>,
  ) {}

  async findAll(): Promise<Author[]> {
    return this.authorsRepository.find();
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorsRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return author;
  }

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const existingAuthor = await this.authorsRepository.findOne({
      where: { name: createAuthorDto.name },
    });

    if (existingAuthor) {
      throw new ConflictException('Author with this name already exists');
    }

    if (createAuthorDto.email) {
      const existingEmail = await this.authorsRepository.findOne({
        where: { email: createAuthorDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Author with this email already exists');
      }
    }

    const author = this.authorsRepository.create(createAuthorDto);
    return this.authorsRepository.save(author);
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);

    if (updateAuthorDto.name && updateAuthorDto.name !== author.name) {
      const existingAuthor = await this.authorsRepository.findOne({
        where: { name: updateAuthorDto.name },
      });

      if (existingAuthor) {
        throw new ConflictException('Author with this name already exists');
      }
    }

    if (updateAuthorDto.email && updateAuthorDto.email !== author.email) {
      const existingEmail = await this.authorsRepository.findOne({
        where: { email: updateAuthorDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Author with this email already exists');
      }
    }

    await this.authorsRepository.update(id, updateAuthorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const author = await this.findOne(id);
    await this.authorsRepository.remove(author);
  }
}