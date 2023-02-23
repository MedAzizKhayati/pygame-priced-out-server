import { CreateAuthDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, Min, Validate } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateAuthDto) {
    @IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })
    @Min(0)
    @IsOptional()
    credit: number;

    @IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0,
    })
    @Min(2)
    @IsOptional()
    storage: number;

    @IsOptional()
    @Validate((value: any) => {
        for (const key in value) {
            if (typeof value[key] !== 'number' || value[key] < 0) {
                return false;
            }
        }
        return true;
    })
    items: { [key: string]: number };
}
