import React, { useState, useEffect } from 'react';
import "../styles/main.css";
import "../styles/normalize.css";
import "../styles/loader.css";

const App = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [mode, setMode] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [chatEntries, setChatEntries] = useState(getChatHistory().length-1);
  const [chatHistory, setChatHistory] = useState(getChatHistory());
  const [selectedChat, setselectedChat] = useState(getChatHistory()[chatHistory.length - 1]);

  useEffect(() => {
    const highestChatNumber = getHighestChatNumber();
    setselectedChat(chatHistory[chatHistory.length - 1]);
    if (highestChatNumber !== -1) {
      const chat = getChatByNumber(highestChatNumber);
      console.log('chat', chat);
      if (chat && chat.messages) {
        loadChat(chat);
      }
    }
  }, []);
  

  const getHighestChatNumber = () => {
    const storedChatHistory = getChatHistory();
    let highestChatNumber = storedChatHistory.length;
    return highestChatNumber;
  };

  const getChatByNumber = (chatNumber) => {
    const storedChatHistory = getChatHistory();
    return storedChatHistory[chatNumber - 1];
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setChatLog([...chatLog, { user: "me", message: input }]);
    setInput("");

    try {
      /*const response = await fetch('http://localhost:11434/api/chat', {
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
      */
      const data = {
        message: {
          content: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr"
        }
      }
      if (data.message) {
        setChatLog(prev => [...prev, { user: "mistral", message: data.message.content }]);
        saveToLocalStorage(input, data.message.content);
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

  const handleNewChatIconClick = () => {

    setChatEntries(prev => prev + 1);
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

    chatHistory.push({
      chatId: chatHistory.length,
      chatName: "Chat #" + chatHistory.length,
      messages: []
    });

    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    setChatHistory(chatHistory);
    clearChat();
  }
  


function getChatHistory() {
  return JSON.parse(localStorage.getItem("chatHistory")) || [];
}

  

function saveToLocalStorage(request, response) {
  if (!localStorage.getItem("chatHistory")) {
    localStorage.setItem("chatHistory", JSON.stringify([]));
    setChatEntries(prev => prev + 1);
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

    chatHistory.push({
      chatId: chatHistory.length,
      chatName: "Chat #" + chatHistory.length,
      messages: []
    });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    setChatHistory(chatHistory);

  } else{

  
  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];


  if (chatHistory.length === 0 || !chatHistory[chatHistory.length - 1].hasOwnProperty('messages')) {
    chatHistory.push({
      chatId: chatHistory.length,
      chatName: "Chat #" + chatHistory.length,
      messages: []
    });
  }

  chatHistory = chatHistory.find(chat => chat.chatId === selectedChat.chatId)



  chatHistory.messages.push({
    messageNumber: chatHistory.messages.length + 1,
    request: request,
    response: response
  });

  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

}

function loadChat(chat) {
  clearChat();
  console.log('loading chat', chat);
  
  for (let i = 0; i < chat.messages.length; i++) {
    const message = chat.messages[i];
    setChatLog(prev => [...prev, { user: "me", message: message.request }]);
    setChatLog(prev => [...prev, { user: "mistral", message: message.response }]);
  }

}

  
  

  return (
    <div className='app'>
      <aside className='side-menu'>
        <div className='side-menu-newChat' onClick={handleNewChatIconClick}>
          <span className='plus'>+</span> Neuer chat
        </div>
        <div className='chat-history'>
          <ul>
            {chatHistory.slice(0).reverse().map((chat, index) => (
            <li key={index}>
              <div className='side-menu-newChat' onClick={() => loadChat(chat)} id={chat.chatId}>
                {chat.chatName}
              </div>
            </li>
          ))}

          </ul>
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
                placeholder='Frage eingeben...'
                className={`chat-input-box ${mode === 'dark' ? 'bg-dark' : 'bg-white'}`}
                value={input}
                disabled={loading}
                onChange={(e) => { setInput(e.target.value) }}
              />
            </form>
            <span className='chat-input-icon'>
              {loading ? (
                <div className="loader"></div>
              ) : (
                <svg onClick={handleSubmit}  stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1" height="1.13em" width="1.13em" xmlns="http://www.w3.org/2000/svg">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
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
          <p>{message.message}</p>
        </div>
      </div>
    </div>
  )
}
