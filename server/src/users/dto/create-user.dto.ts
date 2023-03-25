import * as uuid from 'uuid';

export class CreateUserDto {
    readonly id: uuid;
    readonly name: string;
    readonly description: string;
    readonly email: string;
    readonly avatarSrc: string;
    readonly password: string;
    readonly createdDateTime: Date;
}