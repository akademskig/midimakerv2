import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
class ValidationErrors extends BadRequestException {
    constructor(validationMessage: ValidationError[]) {
        const message = validationMessage
        .map(vm => Object.values(vm.constraints)
        .map((item: string) => {
            const mChars = item.split('');
            mChars.splice(0, 1,  mChars[0].toUpperCase());
            return mChars.join('');
        }))
        .join('');
        super(message);
    }
}

export default ValidationErrors;
