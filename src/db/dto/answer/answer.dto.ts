import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Answer, Question } from 'src/db/entities';

export class AnswerDto implements Readonly<AnswerDto> {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  static toDatabase(data: AnswerDto, question: Question): Answer {
    const toDb = new Answer();
    if (data.id) {
      toDb.id = data.id;
    }
    toDb.question = question;
    return toDb;
  }
}
