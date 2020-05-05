import { Repository } from 'typeorm';
import { User } from 'src/db/entities';
import { AppContext } from 'src/shared/models/telegram/context.model';

interface Props {
  ctx: AppContext;
  repository: Repository<User>;
  force?: boolean;
  deleteCurrent?: boolean;
}

export async function clearChat(props: Props) {
  const { ctx, force, repository, deleteCurrent = true } = props;

  const user = await repository.findOne(ctx.session.user.id);

  const messagesForDelete = user.telegramMessages.filter(msg => force || msg.remove);

  if (deleteCurrent) {
    await ctx.deleteMessage();
  }

  for (let i = 0; i < messagesForDelete.length; i++) {
    try {
      await ctx.deleteMessage(messagesForDelete[i].id);
    } catch (err) {}
  }

  const restMessages = user.telegramMessages.filter(def => !messagesForDelete.some(del => del.id === def.id));

  await repository.update({ id: user.id }, { telegramMessages: restMessages });
}
