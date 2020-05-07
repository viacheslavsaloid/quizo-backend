import { Extra } from 'telegraf';

export function keyboard(msgs: string[]) {
  return Extra.markdown().markup(m => m.keyboard(msgs.map(msg => m.callbackButton(msg))).resize());
}
