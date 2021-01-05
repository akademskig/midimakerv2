import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InstrumentsService } from './instruments.service';
import Instrument from '../database/entity/instrument.entity'
import ValidationErrors from 'src/errors/ValidationErrors';
import { validate } from 'class-validator';

@UseGuards(AuthGuard('jwt'))
@Controller('instruments')
export class InstrumentsController {
    constructor(
        private instrumentsService: InstrumentsService,
    ) { }

    @Post()
    async createNew(@Body() instrument, @Req() req) {
        console.log(instrument)
        const instrumentO = new Instrument(instrument);
        console.log(instrumentO)
        const errors = await validate(instrumentO);
        if (errors.length) {
            throw new ValidationErrors(errors);
        }
        return this.instrumentsService.createNew(instrumentO);
    }
    @Get(':instrument_name')
    async getOne(@Param('instrument_name') name) {
       const instrument = await this.instrumentsService.findOne({name});
       return instrument
    }
 }
