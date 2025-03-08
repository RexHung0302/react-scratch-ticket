<h1 align="center">Welcome to react-scratch-ticket 👋</h1>
<p>
  <img src="https://img.shields.io/badge/npm-%3E%3D10.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg" />
  <a href="https://github.com/RexHung0302/react-scratch-ticket#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/RexHung0302/react-scratch-ticket/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/RexHung0302/react-scratch-ticket/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/RexHung0302/react-scratch-ticket" />
  </a>
</p>

[En](README.md) | [繁中](README-tw.md) | [簡中](README-cn.md)

> This is a scratch ticket component, basic on React

## 🚨🚨 Readme First Please 🚨🚨

這個套件的啟發為 **[react-scratchcard-v2](https://github.com/dopey2/react-scratchcard-v2)** 和 **[scratch-card](https://github.com/1587315093/scratch-card)**，在剛開始安裝時，發現前者無法在手機上使用，後者則是沒有一鍵刮開所有蒙層的功能，在幾經思索之下自行使用 Canvas 和 React 製作了這個刮刮卡套件。

在考量到手機使用的部分，使用了 `canvas.addEventListener('touchstart', startScratching);`、`canvas.addEventListener('touchend', startScratching);` 和 `canvas.addEventListener('touchmove', touchMoveHandler)`；在一鍵刮開的部分則是直接使用 `ctx.clearRect(0, 0, width, height);` 揭開畫布蒙層。

如果後續你有更多想法，想要在這個套件上使用，歡迎至 **[issues](https://github.com/RexHung0302/react-scratch-ticket/issues)** 留下你的想法，作者也會在之後更新更多想法，**[todo-list](#todo-list)** 將會在下方，最後希望這個套件能夠讓您使用的愉快，感謝，祝你有美好的一天。

### 🏠 [Homepage](https://github.com/RexHung0302/react-scratch-ticket#readme)

![With Color Demo](./with-bg-color-demo.gif)
> 使用 Prop maskingLayerColor 傳入蒙層顏色

![With Bg Demo](./with-bg-demo.gif)
> 使用 Prop maskingLayerImg 傳入蒙層圖片

![With Bg Demo](./reset-and-clear-function-demo.gif)
> 重置 及 一鍵清空 功能


## 需求

- npm >=10.0.0
- node >=20.0.0

## 安裝

```sh
npm i react-scratch-ticket
```

```sh
yarn i react-scratch-ticket
```

```sh
pnpm i react-scratch-ticket
```

## 使用

### 在你的元件內使用

```tsx
import React from "react";
import { ReactScratchTicket } from "react-scratch-ticket";
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
        <ScratchTicket
          ref={scratchTicketRef}
          containerClassName="rounded-[10px] my-4"
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
        </ScratchTicket>
      </div>
      <div className="flex gap-4 mt-4">
        <button onClick={clickResetBtnHandler} className="button">Reset</button>
        <button onClick={clickClearCardBtnHandler} className="button">Clear Card</button>
      </div>
    </div>
  );
};
```

### useIndexController.tsx

```ts
import { useEffect, useRef, useState } from "react";
import { ScratchTicketImperative } from "react-scratch-ticket";

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
```

## Type

### Props

|  Name   | Type  | Required | Default |
|  ----  | ----  | ----  | ----  |
| width  | `number` | ✅ | |
| height  | `number` | ✅ | |
| children  | `React.ReactNode` | ✅ | |
| brushType  | `'circle' \| 'square'` |  | `'circle'` |
| brushSize  | `number` |  | `20` |
| finishPercent  | `number` |  | `50` |
| maskingLayerImg  | `string` |  | |
| maskingLayerColor  | `string` |  | `#ddd` |
| animationDuration  | `number` |  | `50` |
| containerClassName  | `string` |  | |
| childrenCenter  | `boolean` |  | `false` |
| onComplete  | `() => void` |  | `() => {}` |
| onInitDone  | `() => void` |  | `() => {}` |
| onResetDone  | `() => void` |  | `() => {}` |

### Ref

|  Name   | Type  | Description |
|  ----  | ----  | ----  |
| reset | `() => void` | 重置刮刮卡，恢復為未刮開的狀態，允許再次刮開。 |
| clearCard | `() => void` | 立即刮開刮刮卡，顯示底下的獎品內容。 |

## todo-list

> 請查看 [En](README.md)，待辦清單將會在英文的 **README.md** 一次性更新

## 作者

👤 **RexHung0302**

* Website: https://rexhung0302.github.io/
* Github: [@RexHung0302](https://github.com/RexHung0302)
* LinkedIn: [@https:\/\/www.linkedin.com\/in\/chiatse-hung-908b72204\/](https://linkedin.com/in/https:\/\/www.linkedin.com\/in\/chiatse-hung-908b72204\/)

## 🤝 貢獻

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/RexHung0302/react-scratch-ticket/issues). You can also take a look at the [contributing guide]( ).

## 提供你的支持

請別吝嗇給我一顆 ⭐️ 如果這個專案幫助到你！

## 📝 License

Copyright © 2025 [RexHung0302](https://github.com/RexHung0302).<br />
This project is [MIT](https://github.com/RexHung0302/react-scratch-ticket/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_