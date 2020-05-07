import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { AnswersService } from 'src/app/services/game';
import { JwtAuthGuard } from 'src/app/shared/guards';
import { Answer } from 'src/db/entities/answer';

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
