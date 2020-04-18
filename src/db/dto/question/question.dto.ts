import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Question, User } from 'src/db/entities';
import { Round } from 'src/db/entities/round';

export class QuestionDto implements Readonly<QuestionDto> {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  logo: string;

  static toDatabase(data: QuestionDto, round: Round): Question {
    const toDb = new Question();
    if (data.id) {
      toDb.id = data.id;
    }
    toDb.round = round;
    return toDb;
  }
}
