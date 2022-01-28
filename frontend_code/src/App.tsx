import { useState, useEffect } from 'react';
import './App.css';
// import { io } from "socket.io-client";

function App() {

  // const socket = io("ws://localhost:5000");

  useEffect(() => {
    window.WebSocket = window.WebSocket;
    var connection = new WebSocket('ws://127.0.0.1:5050');
    connection.onopen = function () {
      console.log("connection is ready");
    };
  }, [])

  return (
    <div className="App">
      <div>Socket io sample app</div>
    </div>
  );
}

export default App;
