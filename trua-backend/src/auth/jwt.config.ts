import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

const options = {
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '30d' },
};

export default JwtModule.register(options);
