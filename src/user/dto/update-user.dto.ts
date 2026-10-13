import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString({ message: 'Nome precisa ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  name?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;
}
