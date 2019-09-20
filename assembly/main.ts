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
  if (!storage.contains(id)) {
    const yearMonth = date.substring(0, 7);
    const counter = storage.getPrimitive<i32>(yearMonth, 0);
    storage.set<i32>(yearMonth, counter + 1);
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

export function hasCommented(id: string): bool {
  return storage.contains(id);
}
export function getProfile(id: string): PostedMessage | null {
  if (storage.contains(id)) {
    return storage.get<PostedMessage>(id);
  } return null;
}

export function getMonthCounter(yearMonth: string): i32 {
  return storage.getPrimitive<i32>(yearMonth, 0);
}
export function getContainsId(id: string = "test"): bool {
  return storage.contains(id);
}

export function setMonthCounter(date: string): bool {
  const yearMonth = date.substring(0, 7);
  if (storage.contains(yearMonth)) {
    const counter = storage.getPrimitive<i32>(yearMonth, 0);
    storage.set<i32>(yearMonth, counter + 1);
    return true;
  }
  return false;
}

export function monthCounters(yearMonth6: string): Array<i32> {
  const months = yearMonth6.split(",");
  // const res = Array.create<i32>(6);
  return months.map<i32>((m: string, i) => storage.getPrimitive<i32>(m, 0))
  // return res;
}

export function vPop(): VectorMessage {
  return messages.pop();
}