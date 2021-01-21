import { Module } from '@nestjs/common';
import { QueryBuilderService } from 'src/utils/queryBuilder.service';
import { MidiFileController } from './midifile.controller';
import { MidiFileService } from './midifile.service';

@Module({
    imports: [],
    controllers: [MidiFileController],
    providers: [MidiFileService, QueryBuilderService],
})
export class MidiFileModule {}
