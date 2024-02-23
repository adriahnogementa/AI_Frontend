import React, { useState } from 'react';
import "../styles/main.css";
import "../styles/normalize.css";

const App = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [mode, setMode] = useState('dark');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setChatLog([...chatLog, { user: "me", message: input }]);
    setInput("");

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: 'mistral',
          messages: [{
            role: 'user',
            content: input
          }],
          stream: false
        })
      });

      const data = await response.json();
      console.log(data);

      if (data.message) {
        setChatLog(prev => [...prev, { user: "mistral", message: data.message.content }]);
      } else {
        // Wenn 'choices' nicht vorhanden ist oder leer ist, handle den Fall entsprechend
        console.error('No choices available in API response');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  }

  const clearChat = () => {
    setChatLog([]);
  }

  const changeMode = () => {
    setMode(mode === 'dark' ? 'white' : 'dark');
  }


  return (
    <div className='app'>
      <aside className='side-menu'>
        <div className='side-menu-newChat' onClick={clearChat}>
          <span className='plus'>+</span> New chat
        </div>
        <div className='side-menu-bottom'>
          <hr />
          <div className='side-menu-newChat' onClick={changeMode}>
            <span className='plus'>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></span>
            Light Mode
          </div>
        </div>
      </aside>
      <section className={`chatbox ${mode === 'dark' ? 'bg-dark' : 'bg-white'}`} >




        <div className='chat-log'>
          {chatLog.length > 0 ?
            chatLog.map((el, i) => {
              return <ChatMessage key={i} message={el} mode={mode} />
            })
            :

            <h1 className='start-converstion' >
              <img src="..\assets\AirITSystems-Logo.png" alt="Logo" className="logo" />
              <br></br>
              <br></br>
              KI Chat Bot<br />
              <span className='sub-text'>Gebe eine Frage ein und ich werde dir schon helfen!</span>
            </h1>
          }
        </div>






        <div className={`chat-input blur`} >
          <div className={`chat-input-div`} >
            <form onSubmit={handleSubmit}>
              <input
                placeholder='Start hier zu schreiben...'
                className={`chat-input-box ${mode === 'dark' ? 'bg-dark' : 'bg-white'}`}
                value={input}
                disabled={loading}
                onChange={(e) => { setInput(e.target.value) }}
              />
            </form>
            <span className='chat-input-icon'>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1" height="1.13em" width="1.13em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
export default App

const ChatMessage = ({ message, mode }) => {
  return (
    <div className={`chat-message ${mode === 'dark' ? 'bg-dark' : 'bg-white'}`} >
      <div className='chat-message-center'>
        <div className={`avatar ${message.user === 'chatgpt' && 'chatGPT'}`}>
          {
            message.user === 'chatgpt' &&
            <svg width="30" height="30" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" class="h-6 w-6">
            </svg>

          }
        </div>
        <div className='message' >
          {/* Hier können Sie die Nachricht formatieren */}
          <p>{message.message}</p>
        </div>
      </div>
    </div>
  )
}
