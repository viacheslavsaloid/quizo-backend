import { Controller, UseGuards, Logger, Param } from '@nestjs/common';
import { Crud, CrudController, Override, ParsedRequest, ParsedBody, CrudRequest } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/shared';
import { QuestionsService } from 'src/game/services';
import { Question, QuestionDto, RoundRepository } from 'src/db';

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Question
  }
})
@Controller('questions')
export class QuestionsController implements CrudController<Question> {
  private logger = new Logger('Quest Rounds Controller');

  constructor(public service: QuestionsService, public roundRepository: RoundRepository) {}

  get base(): CrudController<Question> {
    return this;
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: QuestionDto,
    @Param('questId') questId: string
  ) {
    const round = await this.roundRepository.findOne(questId);
    return this.base.createOneBase(req, QuestionDto.toDatabase(dto, round));
  }
}
