import { Controller, Get } from "@nestjs/common";
import { UseGuards } from "@nestjs/common/decorators/core/use-guards.decorator";
import { Patch, Put } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { Body } from "@nestjs/common/decorators/http/route-params.decorator";
import { GetUser } from "./decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { UserService } from "./user.service";


@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get('/all')
    async getAll() {
        return await this.userService.findAll();
    }

    @Get('leaderboard')
    async getLeaderboard() {
        return await this.userService.findAll({
            order: {
                credit: 'DESC'
            }
        });
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async update(
        @GetUser() user: User,
        @Body() body: UpdateUserDto
    ) {
        return await this.userService.update(user.id, body);
    }

    @Patch('/increase-credit')
    @UseGuards(JwtAuthGuard)
    async increaseCredit(
        @GetUser() user: User,
        @Body() { credit }: UpdateUserDto
    ) {        
        return await this.userService.update(user.id, {
            credit: user.credit + credit || 0
        } as UpdateUserDto);
    }

    @Patch('/decrease-credit')
    @UseGuards(JwtAuthGuard)
    async decreaseCredit(
        @GetUser() user: User,
        @Body() { credit }: UpdateUserDto
    ) {
        return await this.userService.update(user.id, {
            credit: user.credit - credit || 0
        } as UpdateUserDto);
    }

    @Patch('/buy-storage')
    @UseGuards(JwtAuthGuard)
    async increaseStorage(
        @GetUser() user: User,
        @Body() { storage }: UpdateUserDto
    ) {
        return await this.userService.update(user.id, {
            storage: user.storage + storage || 0,
            credit: user.credit - storage * 10 || 0
        } as UpdateUserDto);
    } 

}