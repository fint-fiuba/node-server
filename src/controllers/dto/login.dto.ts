import { IsString } from 'class-validator';

class LogInDto {
  @IsString()
  public mail!: string;

  @IsString()
  public password!: string;
}

export default LogInDto;
