import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private roleService: RolesService) { }

    @Post('/create')
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto)
    }
}
