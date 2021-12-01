import { IsString } from 'class-validator';

class NextMatch {
    @IsString()
    public mail!: string;

    @IsString()
    public otherMail!: string;
}

export default NextMatch;