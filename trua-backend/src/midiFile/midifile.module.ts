import { Module } from '@nestjs/common';
import { QueryBuilderService } from 'src/utils/queryBuilder.service';
import { MidiFileController } from './midifile.controller';
import { MidiFileService } from './midifile.service';
import { MidiFileConverterService } from './midiFileConverter.service';

@Module({
    imports: [],
    controllers: [MidiFileController],
    providers: [MidiFileService, QueryBuilderService, MidiFileConverterService],
})
export class MidiFileModule {}
