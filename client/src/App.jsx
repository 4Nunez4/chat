import io, { Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
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
      <div className="container mx-auto px-4 py-8  bg-gray-900  w-6/12 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">Chat</h1>
        <div className="bg-white h-96 w-full shadow-md rounded-lg p-6 mb-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.from === "yo" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`px-4 py-2 rounded-lg w-5/12 table ${
                  message.from === "yo"
                    ? "bg-blue-700 text-white ml-auto"
                    : "bg-blue-700  text-white "
                }`}
              >
                {" "}
                <span className=" text-xs table text-white text-left">
                  {message.from}
                </span>

                <span className=" text-sm">{message.body}</span>
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="envia un mensaje ..."
            className="flex-grow px-4 py-2 mr-2 border rounded-lg focus:outline-none"
          />
          <Button color="primary" variant="ghost" type="submit">
            enviar
          </Button>
        </form>
      </div>
    </>
  );
}

export default App;
