import { useState } from 'react'


import './App.css'
import myVideo  from './assets/nhu-ngoc.mp4'
import HeartCanvas from "./HeartCanvas";


const NO_PHRASES = [
  "No 💔",
  "Pretty please? 🥺",
  "But we'd be so cute together! 💕",
  "One more chance, pookie?",
  "Don't break my heart :(",
  "What about a maybe?",
  "Please don't do this to me, I'm fragile",
];

function App() {
  const [noClicks, setNoClicks] = useState(0);
  const [isValentine, setIsValentine] = useState(false);

  const yesButtonSize = Math.min(noClicks * 20 + 16, 120);

  return (
    <div className="app">
      {!isValentine ? (
        <>
          {/* <video
            src={myVideo}
            autoPlay
            loop
            muted
            playsInline
            className="video"
          /> */}
          <HeartCanvas />
          <h1>Em biết em và toán học giống nhau chỗ nào không? Đó là rất khó hiểu nên người ta thường dành cả 1 đời ra để học, chị cũng thế, muốn dành cả đời để hiểu em hơn <br></br>
            Nên là em có muốn làm Valentine của chị không? 💘
          </h1>
          <div className="buttons">
            <button
              className="yes-btn"
              style={{ fontSize: `${yesButtonSize}px` }}
              onClick={() => setIsValentine(true)}
            >
              Yes
            </button>

            <button
              className="no-btn"
              onClick={() => setNoClicks((c) => c + 1)}
            >
              {noClicks === 0
                ? "No"
                : NO_PHRASES[Math.min(noClicks - 1, NO_PHRASES.length - 1)]}
            </button>
          </div>
        </>
      ) : (
        <>
          <video
            src={myVideo}
            autoPlay
            loop
            muted
            playsInline
            className="video"
          />
          <div className="result">Yay!!! 💖🎉</div>
        </>
      )}
    </div>
  );
}

export default App;