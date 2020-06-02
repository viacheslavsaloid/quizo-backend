import { Controller, UseGuards, Get, Query, Post, Body } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { QuestionsService } from 'src/app/services/game';
import { Question } from 'src/db/entities/question';
import { JwtAuthGuard } from 'src/app/guards';
import { Public } from 'src/app/utils/decorators';

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
  },
  query: {
    join: {
      round: {
        eager: true
      }
    }
  }
})
@Controller('questions')
export class QuestionsController implements CrudController<Question> {
  constructor(public service: QuestionsService) {}

  @Public()
  @Get('count')
  getCount(@Query() query) {
    return this.service.getCount(query);
  }

  @Post('sort')
  async sort(@Body() data: { questions: Question[] }) {
    return this.service.sort(data.questions);
  }
}
