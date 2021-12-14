import { IsString } from 'class-validator';

class GetUser {
    @IsString()
    public mail!: string;
}

export default GetUser;
