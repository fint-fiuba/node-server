import { IsString } from 'class-validator';

class CreateUserDto {
  @IsString()
  public firstName!: string;

  @IsString()
  public lastName!: string;

  @IsString()
  public mail!: string;

  @IsString()
  public password!: string;

  @IsString()
  petCategory!: string;

  @IsString()
  petName?: String;

  @IsString()
  petSex!: String;
}

export default CreateUserDto;
