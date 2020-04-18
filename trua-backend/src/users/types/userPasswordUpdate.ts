import { Length } from 'class-validator';

export default class UserPasswordUpdate {
    @Length(8)
    password: string;
    constructor(user) {
        const { password } = user;
        this.password = password;
    }
}
