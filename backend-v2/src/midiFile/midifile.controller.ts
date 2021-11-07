import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import MidiFile from '../database/entity/midiFile.entity'
import ValidationErrors from 'src/errors/ValidationErrors';
import { validate } from 'class-validator';
import { MidiFileService } from './midifile.service';
import MidiFileDto from './midiFileDto';
import { OwnerGuard } from 'src/guards/owner.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MidiFileConverterService } from './midiFileConverter.service';


@UseGuards(AuthGuard('jwt'))
@Controller('midiFile')
export class MidiFileController {
    constructor(
        private midiFileService: MidiFileService,
        private midiFileConverter: MidiFileConverterService
    ) { }
    @Post('/save/:name')
    @UseInterceptors(FileInterceptor('file'))
    async createNew(@Param('name') name, @UploadedFile() midiFile: any, @Req() req) {
        const data = midiFile.buffer.toString('utf-8')
        const midiFileDTO = new MidiFileDto({ name, midiChannels: JSON.parse(data) });
        const errors = await validate(midiFileDTO);
        if (errors.length) {
            throw new ValidationErrors(errors);
        }
        return this.midiFileService.createNew(midiFileDTO, req.user.userId);
    }
    @Get('/getFilenames')
    async getFilename(@Req() req) {
        return this.midiFileService.getFilenames(req.user.userId);
    }
    @Get('/all')
    async getAll(@Req() req) {
        return this.midiFileService.getAll(req.user.userId);
    }
    @Get(':id')
    async getOne(@Param('id') id) {
        return await this.midiFileService.findOne({ id });
    }
    @Put('/update/:id')
    @UseInterceptors(FileInterceptor('file'))
    async updateOne(@Param('id') id, @UploadedFile() midiFile) {
        const data = midiFile.buffer.toString('utf-8')
        return await this.midiFileService.updateOne({ id, midiChannels: JSON.parse(data) });
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
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        return this.midiFileConverter.convertToMidi(file)
    }
    @Post('/convert/:id/:ext')
    async convert(@Res() res, @Param('ext') ext, @Param('id') id,) {
        const midiFile = await this.midiFileService.findOne({ id });
        const filename = await this.midiFileConverter.convertFromMidi(midiFile, ext)
        res.sendFile(filename)
    }

}
