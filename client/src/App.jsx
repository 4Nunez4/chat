import io, { Socket } from "socket.io-client";
import { useState, useEffect } from "react";
const socket = new io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "yo",
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([...messages, message]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Chat</h1>
        <div className="bg-white h-3/5 w-3/5 shadow-md rounded-lg p-6 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.from === "yo" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`px-4 py-2 rounded-lg table ${
                  message.from === "yo"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 "
                }`}
              >
                {message.from}:{message.body}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            className="flex-grow px-4 py-2 mr-2 border rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
