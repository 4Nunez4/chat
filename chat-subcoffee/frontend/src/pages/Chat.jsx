import io from "socket.io-client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";

const socket = io("http://localhost:4000", { path: "/user/socket.io" });

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [remitente, setRemitente] = useState(""); // Estado para almacenar el remitente
  const [idSubasta, setIdSubasta] = useState(1); // Estado para almacenar el ID de la subasta

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { mensaje: message, remitente, idSubasta });
    const newMessage = { body: message, from: remitente };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  useEffect(() => {
    const receiveMessage = (data) => {
      setMessages([...messages, data]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
    <>
    
        <div className="bg-white h-96 w-full shadow-md rounded-lg p-6 mb-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.from === remitente ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`px-4 py-2 rounded-lg w-5/12 table ${
                  message.from === remitente
                    ? "bg-blue-700 text-white ml-auto"
                    : "bg-blue-700 text-white "
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
        <div>
          <label htmlFor="remitente">Remitente:</label>
          <input
            type="text"
            id="remitente"
            value={remitente}
            onChange={(e) => setRemitente(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="idSubasta">ID de Subasta:</label>
          <input
            type="number"
            id="idSubasta"
            value={idSubasta}
            onChange={(e) => setIdSubasta(Number(e.target.value))}
          />
        </div>

    </>
  );
}

export default Chat;