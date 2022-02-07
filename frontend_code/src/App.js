import React, { useState, useRef, useEffect } from 'react';
import CanvasDraw from "react-canvas-draw";

import './App.css';

function App() {
  const [chatVal, setChatVal] = useState("")
  const [chatList, setChatList] = useState([{
    "senderName": "UserX", "message": "Welcome, start your conversation here people."
  }]);
  const [newLogin, setNewLogin] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [newWidth, setNewWidth] = useState(4);

  const newUserRef = useRef("");
  const inputRef = useRef(0);
  const ws = useRef(null);
  const canvasRef = useRef();

  useEffect(() => {
    // web socket connections
    ws.current = new WebSocket("ws://localhost:8080");
    ws.current.onopen = () => { console.log("new Connection opened"); }
    ws.current.onclose = () => { console.log("connection closed"); }
    ws.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg["type"] === "message") { addMessage(msg["body"]); }
      if (msg["type"] === "board") {
        if (msg["from"] !== newUserRef.current) {
          canvasRef.current.loadSaveData(msg["body"]);
        }
      }
    }

    // interactive actions
    const focusListener = document.addEventListener("keypress", (e) => {
      if ((newUserRef.current !== "") && (inputRef !== 0) && (e.key === "/")) {
        e.preventDefault();
        setTimeout(() => { inputRef.current.focus() }, 100);
      }
    })
    return () => {
      document.removeEventListener("keypress", focusListener);
      if ((ws.current !== null) && (ws.current.readyState === WebSocket.OPEN)) {
        ws.current.close()
      }
    }
  }, []);

  useEffect(() => { newUserRef.current = userName }, [userName]);

  function addMessage(body) { setChatList((prev) => [body, ...prev]) }
  function sendMessage(newMessage) {
    if ((ws.current !== null) && (ws.current.readyState === WebSocket.OPEN)) {
      ws.current.send(JSON.stringify({ type: "message", "body": newMessage }));
    } else {
      alert("The Connection had be severed, please connect again.");
    }
  }
  function sendBoard(newMessage) {
    if ((ws.current !== null) && (ws.current.readyState === WebSocket.OPEN)) {
      ws.current.send(JSON.stringify({ type: "board", from: userName, "body": newMessage }));
    } else {
      alert("The Connection had be severed, please connect again.");
    }
  }

  return (
    <div className="p-6">
      <div>
        <nav className='my-3 px-6 flex justify-between'>
          <h1 className='my-2 text-xl'>WhiteBoard Screen</h1>
          <span className='my-2'>Welcome {userName}</span>
        </nav>
        <div className='rounded flex my-3 px-6 flex'>
          <div className='border rounded mr-3 my-2 p-2'>
            <CanvasDraw canvasWidth={1000}
              canvasHeight={600}
              ref={canvasRef}
              brushRadius={newWidth}
              lazyRadius={0}
            />
            <div className='flex'>
              <button className='my-2 px-3 py-1 mx-2 border rounded hover:bg-black hover:text-white duration-300'
                onClick={() => { canvasRef.current.eraseAll() }}>Clean</button>
              <input className='my-2 px-1 py-1 mx-2 border w-20' type={"number"} value={newWidth} onChange={e => {
                setNewWidth(Number(e.target.value))
              }} />
              <button className='my-2 px-3 py-1 mx-2 border rounded hover:bg-black hover:text-white duration-300'
                onClick={() => {
                  const board = canvasRef.current.getSaveData()
                  // console.log(board);
                  // canvasRef.current.eraseAll();
                  // canvasRef.current.loadSaveData(board);
                  sendBoard(board);
                }}>Share</button>
            </div>
          </div>
          <div className='rounded ml-3 my-2 px-2 w-full'>
            <div className='rounded mb-5'>
              <div className='text-2xl mb-4'>Chat Section</div>
              <div className='max-h-150 overflow-y-auto'>
                {chatList.map((item, k) => {
                  return (
                    <div key={k}
                      className='border rounded py-1 px-3 mb-2 w-full text-ellipsis'>
                      {item?.senderName ?? "Unknown"} : {item?.message ?? ""}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='mt-3 flex'>
              <input type="text" className='border px-3 py-1 rounded w-full'
                value={chatVal} onChange={e => { setChatVal(e.target.value) }}
                placeholder='Enter your text please...' ref={inputRef}
              />
              <button className='w-1/6 border ml-2 rounded duration-300 hover:text-white hover:bg-black'
                onClick={() => {
                  sendMessage({ message: chatVal, senderName: userName });
                  setChatVal("");
                }}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <div className={
        `absolute top-0 left-0 h-screen w-screen z-1 bg-black/20 ${userName !== "" ? "hidden" : ""}`
      }>
        <div className='flex bg-white text-black w-1/2 py-2 px-3 opacity-100 rounded'
          style={{ "marginLeft": "25%", "marginTop": "18%" }}
        >
          <input className='border px-3 py-1 rounded w-full' type="text" value={newLogin}
            onChange={(e) => { setNewLogin(e.target.value) }} placeholder='Enter Name Please' />
          <button className='border ml-2 rounded duration-300 hover:text-white hover:bg-black px-3 opacity-100'
            onClick={() => {
              if (newLogin !== "") {
                setUserName(newLogin[0].toUpperCase() + newLogin.slice(1))
                setNewLogin("")
              } else {
                setPreviewMessage("Enter a valid unique name please");
              }
            }}
          >Lets Go</button>
        </div>
        <div className='text-red-500 px-3' style={{ "marginLeft": "25%" }}>
          {previewMessage}
        </div>
      </div>
    </div>
  );
}

export default App;
