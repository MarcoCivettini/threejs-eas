import { useEffect, useState } from "preact/hooks";
import { Message } from "../models/store.model";
import { JSX } from "preact/jsx-runtime";

export const Chat = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState<string>('');

  const handleNewMessage = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewMsg(e.currentTarget?.value);
  }

  const onSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages((previous) => {
      if (previous.length > 20) {
        previous.shift();
      }
      previous.push({ userName: 'test', message: newMsg });
      return previous;
    });
    setNewMsg('');
  }

  return (
    <form className="absolute z-50 h-16 w-1/2 bg-black bottom-2 left-2 overflow-y-auto" onSubmit={onSubmit}>
      {messages.map((m, index) => <div key={index}>{m.userName}{m.message}</div>)}
      <input type="text" onKeyDown={(e) => e.stopPropagation()} value={newMsg} onChange={(e) =>  handleNewMessage(e)} />
      <button className="bg-white" type="submit">Send</button>
    </form>
  );
};