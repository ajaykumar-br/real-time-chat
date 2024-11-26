import { Chat, Store, UserId } from "./store/Store";

let globalChatId = 0;

interface room {
  roomId: string;
  chats: Chat[];
}

export class InMemoryStore implements Store {
  private store: Map<string, room>;
  constructor() {
    this.store = new Map<string, room>();
  }

  initRoom(roomId: string) {
    this.store.set(roomId, { roomId, chats: [] });
  }

  getChats(roomId: string, limit: number, offset: number) {
    const room = this.store.get(roomId);
    if (!room) {
      return [];
    }
    return room.chats
      .reverse()
      .slice(0, offset)
      .slice(-1 * limit);
  }

  addChat(userId: UserId, roomId: string, name: string, message: string) {
    const room = this.store.get(roomId);
    if (!room) {
      return null;
    }

    const chat = {
      id: (globalChatId++).toString(),
      userId,
      name,
      message,
      upvotes: [],
    };

    room.chats.push(chat);
    return chat;
  }

  upvote(userId: UserId, roomId: string, chatId: string) {
    const room = this.store.get(roomId);
    if (!room) {
      return;
    }
    // Todo: Make this faster
    const chat = room.chats.find(({ id }) => id === chatId);

    if (chat) {
      chat.upvotes.push(userId);
    }

    return chat;
  }
}
