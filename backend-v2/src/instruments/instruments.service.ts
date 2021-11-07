import { Injectable } from '@nestjs/common';
import Instrument from 'src/database/entity/instrument.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class InstrumentsService { 
    
    async findOne(query): Promise<Instrument | undefined> {
        return await getConnection()
        .getRepository(Instrument)
        .findOne(query)
      }
    
      async createNew({ name, player }: Instrument): Promise<Instrument> {
        const existingInstrument = await this.findOne({ name });
        if (existingInstrument) {
          return;
        }
        const instrument = new Instrument({ name, player });
        const qR = getConnection().createQueryRunner();
        if (qR) {
          return qR.manager.save(instrument);
        }
      }
}
