import { Controller, UseGuards, Logger, Param } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/shared';
import { Answer, QuestionRepository } from 'src/db';
import { AnswersService } from 'src/game/services';
import { AnswerDto } from 'src/db/dto/';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Answer
  }
})
@Controller('answers')
export class AnswersController implements CrudController<Answer> {
  private logger = new Logger('Quest Rounds Controller');

  constructor(public service: AnswersService, public questionsRepository: QuestionRepository) {}

  get base(): CrudController<Answer> {
    return this;
  }

  @Override()
  async createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() dto: AnswerDto, @Param('questId') questId: string) {
    const question = await this.questionsRepository.findOne(questId);
    return this.base.createOneBase(req, AnswerDto.toDatabase(dto, question));
  }
}
