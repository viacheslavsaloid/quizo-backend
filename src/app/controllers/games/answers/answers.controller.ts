import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { AnswersService } from 'src/app/services/game';
import { Answer } from 'src/db/entities/answer';
import { JwtAuthGuard } from 'src/app/guards';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Answer
  }
})
@Controller('answers')
export class AnswersController implements CrudController<Answer> {
  constructor(public service: AnswersService) {}
}
