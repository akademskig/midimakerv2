import { Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InstrumentsService } from './instruments.service';
import Instrument from '../database/entity/instrument.entity'
import ValidationErrors from 'src/errors/ValidationErrors';
import { validate } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard('jwt'))
@Controller('instruments')
export class InstrumentsController {
    constructor(
        private instrumentsService: InstrumentsService,
    ) { }
    @UseInterceptors(FileInterceptor('file'))
    @Post('/:instrument_name')
    async createNew(@Param('instrument_name') instrumentName, @UploadedFile() player: Buffer) {
        const instrumentO = new Instrument({name: instrumentName, player });
        console.log(instrumentO)
        const errors = await validate(instrumentO);
        if (errors.length) {
            throw new ValidationErrors(errors);
        }
        return this.instrumentsService.createNew(instrumentO);
    }
    @Get(':instrument_name')
    async getOne(@Param('instrument_name') name) {
        const instrument = await this.instrumentsService.findOne({ name });
        return instrument
    }
}
