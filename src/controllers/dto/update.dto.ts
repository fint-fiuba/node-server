import { IsString, IsNumber } from 'class-validator';

class UpdateUser {
    @IsString()
    public firstName!: string;

    @IsString()
    public lastName!: string;

    @IsString()
    public mail!: string;


    @IsString()
    petCategory!: string;

    @IsString()
    petName!: string;

    @IsString()
    petSex!: string;

    @IsString()
    image!: string;

    @IsString()
    petAge!: string;

}

export default UpdateUser;
