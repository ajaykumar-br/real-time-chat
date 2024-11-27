import { connection, server as WebSocketServer } from "websocket";
import { createServer } from "http";
import { UserManager } from "./UserManager";
import { IncomingMessage, SupportedMessage } from "./messages/incomingMessages";
import { SupportedMessage as OutgoingSupportedMessages, OutgoingMessage } from "./messages/outgoingMessages";
import { InMemoryStore } from "./store/InMemoryStore";

const server = createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

const userManager = new UserManager();
const store = new InMemoryStore();

server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

function originIsAllowed(origin: string) {
  return true;
}

wsServer.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  var connection = request.accept("echo-protocol", request.origin);
  console.log(new Date() + " Connection accepted.");
  connection.on("message", function (message) {
    // todo add rate limiting logic
    
    if (message.type === "utf8") {
        try {
            messageHandler(connection, JSON.parse(message.utf8Data));
        } catch (e) {
            console.error("Check message type");
        }
    }
  });
});

function messageHandler(ws: connection, message: IncomingMessage) {
    if(message.type == SupportedMessage.JoinRoom) {
      const payload = message.payload;
      userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }
    
    if(message.type == SupportedMessage.SendMessage) {
      const payload = message.payload;
      const user = userManager.getUser(payload.roomId, payload.userId);
      if(!user) {
        console.error("User not found in the db");
        return;
      }
      let chat = store.addChat(payload.userId, payload.roomId, user.name, payload.message);
      if(!chat) {
        return;
      }

      // Todo add broadcast logic here
      const outgoingPayload = {
        type: OutgoingSupportedMessages.AddChat,
        payload: {
          chatId: chat.id,
          roomId: payload.roomId,
          message: payload.message,
          name: user.name,
          upvotes: 0,
        },
      };
      userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }

    if(message.type === SupportedMessage.UpvoteMessage) {
      const payload = message.payload;
      const chat = store.upvote(payload.userId, payload.roomId, payload.chatId);
      
      if(!chat) {
        return;
      }

      const outgoingPayload: OutgoingMessage = {
        type: OutgoingSupportedMessages.UpdateChat,
        payload: {
          chatId: payload.chatId,
          roomId: payload.roomId,
          upvotes: chat.upvotes.length,
        },
      };
      console.log("inside upvote 3");
      userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    }
}