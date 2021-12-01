import { IsString } from 'class-validator';

class MutualMatches {
    @IsString()
    public mail!: string;
}

export default MutualMatches;
