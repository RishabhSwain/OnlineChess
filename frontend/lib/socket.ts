import { io, Socket } from "socket.io-client"

const SocketBackendURL = process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || "http://localhost:5000"

export const socket: Socket = io(SocketBackendURL, {
    withCredentials: true,
    autoConnect: false
})

socket.on("join-result", (success: boolean) => {
    // if (success) {
    //     alert("Successfully joined the game!")
    // } else {
    //     alert("Failed to join the game.")
    // }
})

