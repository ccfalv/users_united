import { storage, PersistentVector } from "near-runtime-ts";
import { PostedMessage, VectorMessage } from "./model";
const messages = new PersistentVector<VectorMessage>("v");
const m = new PersistentVector<PostedMessage>("m");
export function addMessage(
  text: string,
  id: string,
  name: string,
  photo: string,
  email: string,
  date: string
): void {
  const pMsg: PostedMessage = {
    index: messages.length,
    id,
    text,
    name,
    photo,
    date,
    email
  };
  const vMsg: VectorMessage = { id, text, name, photo, date };
  if (!storage.get<PostedMessage>(id)) {
    storage.set<PostedMessage>(id, pMsg);
    messages.push(vMsg);
  }
}

export function getRangeMessages(start: i32 = 0): Array<VectorMessage> {
  let numMessages: i32 = messages.length < start ? 0 : messages.length - start;
  let result = Array.create<VectorMessage>(numMessages);
  if (numMessages > 0) {
    for (let i = 0; i < numMessages; i++) {
      result[i] = messages[i + start];
    }
  }
  return result;
}

export function hasCommented(id: string): PostedMessage | null {
  return storage.get<PostedMessage>(id);
}

export function mPopAdd(): PostedMessage {
  const me = m.pop();
  const text: string = me.text,
    id: string = me.id,
    name: string = me.name,
    photo: string = me.photo,
    email: string = me.email,
    date: string = me.date;
  addMessage(text, id, name, photo, email, date);
  return me;
}

export function mPop(): PostedMessage {
  return m.pop();
}

export function oldM(): Array<PostedMessage> {
  const res = Array.create<PostedMessage>(m.length);
  for (let i = 0; i < m.length; i++) {
    res[i] = m[i];
  }
  return res;
}
