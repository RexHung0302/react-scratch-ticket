import { useEffect, useRef, useState } from "react";
import { ScratchTicketImperative } from "../../../src/index"; // Use for local demo
// import { ScratchTicketImperative } from "react-scratch-ticket"; // Use for npm package

/**
 * @description Fake Prize Array
 */
const fakePrizeArray = [
  { name: "You will have a nice day" },
  { name: "Keep up the good work" },
  { name: "You are awesome, win $9999 cash" },
  { name: "You are the best, win a car" },
  { name: "$1000 cash" },
  { name: "$5000 cash" },
];

const useIndexController = () => {
  const scratchTicketRef = useRef<ScratchTicketImperative>(null);
  const [prizeInfo, setPrizeInfo] = useState({ name: "Keep up the good work" });

  /**
   * @description init done handler
   */
  const initDoneHandler = () => console.log("init done");

  /**
   * @description complete handler
   */
  const completeHandler = () => console.log("complete");

  /**
   * @description reset done handler
   */
  const resetDoneHandler = () => console.log("reset done");

  /**
   * @description click reset button handler
   */
  const clickResetBtnHandler = () => {
    scratchTicketRef.current?.reset()
  };

  /**
   * @description click clean card button handler
   */
  const clickClearCardBtnHandler = () => scratchTicketRef.current?.clearCard();

  /**
   * @description Init Random Prize
   */
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * fakePrizeArray.length);
    setPrizeInfo(fakePrizeArray[randomIndex]);
  }, []);

  return {
    prizeInfo,
    scratchTicketRef,
    completeHandler,
    initDoneHandler,
    resetDoneHandler,
    clickResetBtnHandler,
    clickClearCardBtnHandler,
  }
};

export default useIndexController;