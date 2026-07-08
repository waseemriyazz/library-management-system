import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './authors.entity';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  @ApiResponse({ status: 201, description: 'Author created successfully', type: Author })
  @ApiResponse({ status: 409, description: 'Author with this name or email already exists' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({ status: 200, description: 'Return all authors', type: [Author] })
  findAll(): Promise<Author[]> {
    return this.authorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an author by ID' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 200, description: 'Return the author', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found' })
  findOne(@Param('id') id: string): Promise<Author> {
    return this.authorsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an author' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 200, description: 'Author updated successfully', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found' })
  @ApiResponse({ status: 409, description: 'Author with this name or email already exists' })
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    return this.authorsService.update(+id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an author' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 204, description: 'Author deleted successfully' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.authorsService.remove(+id);
  }
}