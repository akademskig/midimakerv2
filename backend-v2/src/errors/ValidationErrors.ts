import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

class ValidationErrors extends BadRequestException {
    message!: string;
    constructor(validationErrors: ValidationError[]) {
        const message = validationErrors
            .map(vm => Object.values(vm.constraints)
                .map((item: string) => {
                    const mChars = item.split('');
                    mChars.splice(0, 1, mChars[0].toUpperCase());
                    return mChars.join('');
                }))
            .join('. ');
        super(message);
        this.message = message;

    }
}

export default ValidationErrors;
