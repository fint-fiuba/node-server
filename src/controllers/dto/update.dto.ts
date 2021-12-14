import { IsString } from 'class-validator';

class UpdateUser {
    @IsString()
    public firstName?: string;

    @IsString()
    public lastName?: string;

    @IsString()
    public mail?: string;


    @IsString()
    petCategory?: string;

    @IsString()
    petName?: String;

    @IsString()
    petSex?: String;

    @IsString()
    image?: String;

}

export default UpdateUser;
