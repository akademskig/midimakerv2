import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import MidiFile from '../database/entity/midiFile.entity'
import ValidationErrors from 'src/errors/ValidationErrors';
import { validate } from 'class-validator';
import { MidiFileService } from './midifile.service';
import MidiFileDto from './midiFileDto';
import { OwnerGuard } from 'src/guards/owner.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard('jwt'))
@Controller('midiFile')
export class MidiFileController {
    constructor(
        private midiFileService: MidiFileService,
    ) { }

    @Post()
    async createNew(@Body() midiFile: MidiFileDto, @Req() req) {
        const midiFileDTO = new MidiFileDto(midiFile);
        const errors = await validate(midiFileDTO);
        if (errors.length) {
            throw new ValidationErrors(errors);
        }
        return this.midiFileService.createNew(midiFileDTO, req.user.userId);
    }
    @Get('/getFilenames')
    async getFilename( @Req() req) {
       return this.midiFileService.getFilenames(req.user.userId);
    }
    @Get('/all')
    async getAll( @Req() req) {
        console.log('sdsd')
       return this.midiFileService.getAll(req.user.userId);
    }
    @Get(':id')
    async getOne(@Param('id') id) {
       return await this.midiFileService.findOne({id});
    }
    @Put(':id')
    async updateOne(@Param('id') id, @Body() midiFile) {
       return await this.midiFileService.updateOne({id, ...midiFile});
    }
    @Delete(':id')
    async deleteById(@Param('id') id) {
       return await this.midiFileService.deleteById(id);
    }
    @Post('/img/:id')
    @UseInterceptors(FileInterceptor('file'))
    async saveImage(@Param('id') id, @UploadedFile() file) {
        return this.midiFileService.saveImage(id, file)
    }

 }
