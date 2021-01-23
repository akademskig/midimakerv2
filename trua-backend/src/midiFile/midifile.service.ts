import { BadRequestException, Injectable } from '@nestjs/common';
import MidiFile from 'src/database/entity/midiFile.entity';
import { AdvancedConsoleLogger, getConnection } from 'typeorm';
import MidiFileDto from './midiFileDto';
import { QueryBuilderService } from '../utils/queryBuilder.service'

@Injectable()
export class MidiFileService {
  constructor(
    private readonly qbs: QueryBuilderService,
  ) { }
  async findOne(query): Promise<MidiFile | undefined> {
    return await getConnection()
      .getRepository(MidiFile)
      .findOne(query)
  }

  async createNew({ name, midiChannels, canvasImgBlob }: MidiFileDto, userId: string): Promise<MidiFile> {
    const existingMidiFile = await this.findOne({ name });
    if (existingMidiFile) {
      throw new BadRequestException(`Midi with name ${existingMidiFile.name} already exists!`);
    }
    const midiFileDto = new MidiFile({ name, midiChannels, canvasImgBlob, userId });
    console.log(midiFileDto, 'miditto')
    const qR = getConnection().createQueryRunner();
    if (qR) {
      return qR.manager.save(midiFileDto);
    }
  }
  async getFilenames(userId) {
    const midiFiles = await getConnection()
      .getRepository(MidiFile)
      .find({ select: ["name", 'id'], where: { user: userId } })
    return midiFiles
  }
  async getAll(userId) {
    const midiFiles = await getConnection()
      .getRepository(MidiFile)
      .find({ where: { user: userId } })
      console.log(midiFiles)
    return midiFiles
  }

  async updateOne({id, name, midiChannels}){
    return await getConnection()
      .getRepository(MidiFile)
      .update({ id }, { name, midiChannels})
  }
  async deleteById(id){
    return await getConnection()
      .getRepository(MidiFile)
      .delete({ id })
  }
  async saveImage(id, file){
    console.log(file)
    return await getConnection()
      .getRepository(MidiFile)
      .update({ id }, { canvasImgBlob: file.buffer})
  }
}
