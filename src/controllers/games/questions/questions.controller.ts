import { Controller, UseGuards } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { QuestionsService } from 'src/services/game';
import { JwtAuthGuard } from 'src/guards';
import { Question } from 'src/db/entities/question';

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
