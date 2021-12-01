import { IsString } from 'class-validator';

class Match {
    @IsString()
    public mail!: string;

    @IsString()
    public otherMail!: string;
}

export default Match;