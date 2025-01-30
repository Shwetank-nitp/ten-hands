class RoomManager {
  #userSockets = new Map();
  #roomSubscriptions = new Map();
  #userRooms = new Map();

  addUser(userId, roomId, ws) {
    try {
      this.#userSockets.set(userId, ws);

      if (!this.#roomSubscriptions.has(roomId)) {
        this.#roomSubscriptions.set(roomId, new Set());
      }
      this.#roomSubscriptions.get(roomId).add(userId);

      if (!this.#userRooms.has(userId)) {
        this.#userRooms.set(userId, new Set());
      }
      this.#userRooms.get(userId).add(roomId);
    } catch (error) {
      console.error(`Error adding user ${userId} to room ${roomId}:`, error);
      throw error;
    }
  }

  unsubUser(userId, roomId) {
    try {
      if (this.#roomSubscriptions.has(roomId)) {
        this.#roomSubscriptions.get(roomId).delete(userId);

        if (this.#roomSubscriptions.get(roomId).size === 0) {
          this.#roomSubscriptions.delete(roomId);
        }
      }

      if (this.#userRooms.has(userId)) {
        this.#userRooms.get(userId).delete(roomId);
      }
    } catch (error) {
      console.error(
        `Error unsubscribing user ${userId} from room ${roomId}:`,
        error
      );
      throw error;
    }
  }

  cleanUp(userId) {
    try {
      if (this.#userRooms.has(userId)) {
        this.#userRooms.get(userId).forEach((roomId) => {
          this.unsubUser(userId, roomId);
        });
        this.#userRooms.delete(userId);
      }

      this.#userSockets.delete(userId);
    } catch (error) {
      console.error(`Error cleaning up user ${userId}:`, error);
      throw error;
    }
  }

  broadcastToRoom(roomId, message, senderId) {
    try {
      if (!this.#roomSubscriptions.has(roomId)) return;

      const recipients = this.#roomSubscriptions.get(roomId);
      console.log(message);
      const messageString = JSON.stringify({
        message: { ...message },
        senderId,
        timestamp: new Date().toISOString(),
      });

      recipients.forEach((userId) => {
        const ws = this.#userSockets.get(userId);
        if (ws?.readyState === ws.OPEN) {
          ws.send(messageString);
        }
      });
    } catch (error) {
      console.error(`Error broadcasting to room ${roomId}:`, error);
      throw error;
    }
  }
}

export { RoomManager };
