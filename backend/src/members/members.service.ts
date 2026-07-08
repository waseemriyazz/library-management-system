import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './members.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  async findAll(): Promise<Member[]> {
    return this.membersRepository.find();
  }

  async findOne(id: number): Promise<Member> {
    const member = await this.membersRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const existingMember = await this.membersRepository.findOne({
      where: { name: createMemberDto.name },
    });

    if (existingMember) {
      throw new ConflictException('Member with this name already exists');
    }

    if (createMemberDto.email) {
      const existingEmail = await this.membersRepository.findOne({
        where: { email: createMemberDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Member with this email already exists');
      }
    }

    const member = this.membersRepository.create(createMemberDto);
    return this.membersRepository.save(member);
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);

    if (updateMemberDto.name && updateMemberDto.name !== member.name) {
      const existingMember = await this.membersRepository.findOne({
        where: { name: updateMemberDto.name },
      });

      if (existingMember) {
        throw new ConflictException('Member with this name already exists');
      }
    }

    if (updateMemberDto.email && updateMemberDto.email !== member.email) {
      const existingEmail = await this.membersRepository.findOne({
        where: { email: updateMemberDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Member with this email already exists');
      }
    }

    await this.membersRepository.update(id, updateMemberDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const member = await this.findOne(id);
    await this.membersRepository.remove(member);
  }
}