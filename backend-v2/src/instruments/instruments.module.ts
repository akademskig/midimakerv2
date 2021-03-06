import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        InstrumentsController],
    providers: [
        InstrumentsService],
})
export class InstrumentsModule { }
