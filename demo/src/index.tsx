import React from "react";
import { ReactScratchTicket } from "../../src/index"; // Use for local demo
// import { ReactScratchTicket } from "react-scratch-ticket"; // Use for npm package
import ReactDOM from "react-dom/client";
import useIndexController from "./hook/useIndexController";
import './style.scss';

const App = () => {
  const { prizeInfo, scratchTicketRef, completeHandler, initDoneHandler, resetDoneHandler, clickResetBtnHandler, clickClearCardBtnHandler } = useIndexController();

  return (
    <div className="container">
      <h2 className="font-bold">React Scratch Ticket Demo</h2>
      <p className="container__title">100X</p>
      <div className="content">
        <ReactScratchTicket
          ref={scratchTicketRef}
          containerClassName="scratch-ticket-container"
          brushSize={10}
          width={309}
          height={52}
          childrenCenter
          maskingLayerImg='https://picsum.photos/309/52'
          maskingLayerColor="yellow"
          finishPercent={70}
          onComplete={completeHandler}
          onInitDone={initDoneHandler}
          onResetDone={resetDoneHandler}
        >
          {prizeInfo.name}
        </ReactScratchTicket>
      </div>
      <div className="buttons">
        <button onClick={clickResetBtnHandler} className="button">Reset</button>
        <button onClick={clickClearCardBtnHandler} className="button">Clear Card</button>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
