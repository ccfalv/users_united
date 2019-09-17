import { storage, PersistentVector } from "near-runtime-ts";
import { PostedMessage, VectorMessage } from "./model";
const v2 = new PersistentVector<VectorMessage>("v2");
const m = new PersistentVector<PostedMessage>("m");
export function addMessageMock(
  text = "test",
  id = "test",
  name = "test",
  photo = "test",
  email = "test",
  date = "test"
): void {
  const pMsg: PostedMessage = {
    index: v2.length,
    id,
    text,
    name,
    photo,
    date,
    email
  };
  const vMsg: VectorMessage = { id, text, name, photo, date };
  if (storage.get<PostedMessage>(id) === null) {
    storage.set<PostedMessage>(id, pMsg);
    v2.push(vMsg);
  }
}

export function mPopAdd(): PostedMessage {
  const me = m.pop();
  const text: string = me.text,
    id: string = me.id,
    name: string = me.name,
    photo: string = me.photo,
    email: string = me.email,
    date: string = me.date;
  addMessageMock(text, id, name, photo, email, date);
  return me;
}

export function mPop(): PostedMessage {
  return m.pop();
}

export function v2Pop(): VectorMessage {
  return v2.pop();
}

export function oldM(): Array<PostedMessage> {
  const res = Array.create<PostedMessage>(m.length);
  for (let i = 0; i < m.length; i++) {
    res[i] = m[i];
  }
  return res;
}

export function oldV2(): Array<VectorMessage> {
  const res = Array.create<VectorMessage>(v2.length);
  for (let i = 0; i < v2.length; i++) {
    res[i] = v2[i];
  }
  return res;
}
