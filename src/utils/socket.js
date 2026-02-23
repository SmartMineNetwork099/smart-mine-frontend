import { io } from "socket.io-client";
import { normalizeWalletAddress } from "./func";

let socket;

export const initSocket = (walletAddress) => {
  walletAddress = normalizeWalletAddress(walletAddress) || '';
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_BASE, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      if (walletAddress) {
        socket.emit("join", walletAddress);
        console.log("📌 Joined room with walletAddress:", walletAddress);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err.message);
    });
  } else if (walletAddress) {
    // ⚠️ agar socket already bana hua hai to bhi join emit kara do
    socket.emit("join", walletAddress);
    console.log("🔄 Re-joined room with walletAddress:", walletAddress);
  }
  return socket;
};


export const getSocket = () => socket;
