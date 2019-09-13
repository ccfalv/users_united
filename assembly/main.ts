import { storage, PersistentVector } from "near-runtime-ts";
import { PostedMessage, VectorMessage } from "./model";
const messages = new PersistentVector<VectorMessage>("v");
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
  storage.set<PostedMessage>(id, pMsg);
  messages.push(vMsg);
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

export function messagesPop(): i32 {
  messages.pop();
  return messages.length;
}
