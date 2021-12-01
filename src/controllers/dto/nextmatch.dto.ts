import { IsString } from 'class-validator';

class NextMatch {
    @IsString()
    public mail!: string;
}

export default NextMatch;