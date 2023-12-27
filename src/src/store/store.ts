import { createStore } from 'zustand/vanilla';
import { GameStore, Message } from '../models/store.model';

const store = createStore<GameStore>((set) => ({
  messages: [],
  addNewMessage: (message: Message) => set(state => {
    if (state.messages.length > 20) {
      state.messages.shift();
    }
    state.messages.push(message);
    return state;
  }) 
}));

const { getState, setState, subscribe } = store

export default store;