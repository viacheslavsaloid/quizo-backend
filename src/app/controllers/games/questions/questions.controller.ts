import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { QuestionsService } from 'src/app/services/game';
import { Question } from 'src/db/entities/question';
import { JwtAuthGuard } from 'src/app/guards';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Question
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true
    }
  }
})
@Controller('questions')
export class QuestionsController implements CrudController<Question> {
  constructor(public service: QuestionsService) {}
}
