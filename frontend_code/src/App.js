import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [chatVal, setChatVal] = useState("")
  const [chatList, setChatList] = useState([{
    "senderName": "userx", "message": "sample message 1"
  }]);
  const [userName, setUserName] = useState("");
  const [newLogin, setNewLogin] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");
  const inputRef = useRef(0);

  useEffect(() => {
    const focusListener = document.addEventListener("keypress", (e) => {
      console.log(inputRef, userName, e.key);
      if ((userName !== '') && (inputRef !== 0) && (e.key === "/")) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
    })
    return () => { document.removeEventListener("keypress", focusListener); }
  }, [])


  function addMessage(body) { setChatList([body, ...chatList]) }

  return (
    <div className="p-6">
      <div className={
        `absolute top-0 left-0 h-screen w-screen z-1 bg-white ${userName !== "" ? "hidden" : ""}`
      }>
        <div className='flex bg-white text-black w-1/2 py-2 px-3 opacity-100 rounded'
          style={{ "marginLeft": "25%", "marginTop": "18%" }}
        >
          <input className='border px-3 py-1 rounded w-full' type="text" value={newLogin}
            onChange={(e) => { setNewLogin(e.target.value) }} placeholder='Enter Name Please' />
          <button className='border ml-2 rounded duration-300 hover:text-white hover:bg-black px-3 opacity-100'
            onClick={() => {
              if (newLogin !== "") { setUserName(newLogin || "UserUnknown") } else {
                setPreviewMessage("Enter a valid unique name please");
              }
            }}
          >Lets Go</button>
        </div>
        <div className='text-red-500 px-3' style={{ "marginLeft": "25%" }}>
          {previewMessage}
        </div>
      </div>
      <nav className='my-3 px-6 flex justify-between'>
        <h1 className='my-2 text-xl'>WhiteBoard Screen</h1>
        <span className='my-2'>Welcome {userName}</span>
      </nav>
      <div className='rounded my-3 px-6 flex'>
        <div className='border rounded w-4/6 mr-3 my-2 p-2'> Whiteboard Block, Live soon ;) </div>
        <div className='rounded w-2/6 ml-3 my-2 px-2'>
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
                addMessage({ message: chatVal, senderName: userName });
                setChatVal("");
              }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
