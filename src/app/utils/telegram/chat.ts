import { Repository } from 'typeorm';
import { User } from 'src/db/entities';
import { AppContext } from 'src/app/models/telegram/context.model';

interface Props {
  ctx: AppContext;
  repository?: Repository<User>;
  force?: boolean;
  deleteCurrent?: boolean;
  savePrevious?: number;
}

export async function clearChat(props: Props) {
  const { ctx, force, deleteCurrent = true, savePrevious = 0 } = props;

  const { messages = [] } = ctx.session;

  const messagesForDelete = messages
    .slice(0, messages.length - savePrevious) // * Deleate all except Save Previous from end
    .filter(x => x.remove || force);

  if (deleteCurrent) {
    await ctx.deleteMessage();
  }

  for (let i = 0; i < messagesForDelete.length; i++) {
    try {
      await ctx.deleteMessage(messagesForDelete[i].id);
    } catch (err) {}
  }

  ctx.session.messages = messages.filter(def => !messagesForDelete.some(del => del.id === def.id));
}
