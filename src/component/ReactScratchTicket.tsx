
import React from 'react';
import { forwardRef, useImperativeHandle } from 'react';

import useReactScratchTicketController, { BrushType } from '../hook/useReactScratchTicketController';

/**
 * @description ScratchTicket Props
 */
interface Props {
  width: number;
  height: number;
  children: React.ReactNode;
  brushType?: BrushType;
  brushSize?: number;
  finishPercent?: number;
  maskingLayerImg?: string;
  maskingLayerColor?: string;
  animationDuration?: number;
  containerClassName?: string;
  childrenCenter?: boolean;
  onComplete?: () => void;
  onInitDone?: () => void;
  onResetDone?: () => void;
}

/**
 * @description ScratchTicket imperative type
 * @typedef {object} ScratchTicketImperative
 * @property {() => void} reset - Reset the scratch ticket
 * @property {() => void} clearCard - Clean all the scratch ticket
 */
export interface ScratchTicketImperative {
  reset: () => void;
  clearCard: () => void;
}

/**
 * @description ReactScratchTicket Component
 * @param {number} width - The width of the scratch ticket
 * @param {number} height - The height of the scratch ticket
 * @param {React.ReactNode} children - The children of the scratch ticket
 * @param {BrushType} brushType - The type of the brush
 * @param {number} brushSize - The size of the brush
 * @param {number} finishPercent - The finish percent of the scratch ticket
 * @param {string} maskingLayerImg - The image of the masking layer, when use maskingLayerImg, maskingLayerColor will be default to #ddd
 * @param {string} maskingLayerColor - The color of the masking layer, when use maskingLayerImg, maskingLayerColor will be default to #ddd
 * @param {number} animationDuration - The animation duration of the scratch ticket
 * @param {string} containerClassName - The class name of the container
 * @param {boolean} childrenCenter - The children center
 * @param {() => void} onComplete - The complete callback
 * @param {() => void} onInitDone - The init done callback
 * @param {() => void} onResetDone - The reset done callback
 * @returns {React.ReactElement} The ReactScratchTicket component
 */
const ReactScratchTicket = forwardRef(
  (
    {
      width,
      height,
      children,
      brushType = 'circle',
      brushSize = 20,
      finishPercent = 50,
      maskingLayerImg,
      maskingLayerColor = '#ddd',
      animationDuration = 50,
      containerClassName,
      childrenCenter = false,
      onComplete = () => {},
      onInitDone = () => {},
      onResetDone = () => {},
    }: Props,
    ref
  ) => {
    const { isInitialized, reactScratchTicketRef, resetHandler, cleanCardHandler } = useReactScratchTicketController({
      brushSize,
      brushType,
      finishPercent,
      maskingLayerImg,
      maskingLayerColor,
      animationDuration,
      onComplete,
      onInitDone,
      onResetDone,
    });

    useImperativeHandle(ref, () => ({
      reset: resetHandler,
      clearCard: cleanCardHandler,
    }));

    return (
      <div
        className={containerClassName}
        style={{
          width,
          height,
          position: 'relative',
          display: childrenCenter ? 'flex' : 'block',
          alignItems: childrenCenter ? 'center' : 'initial',
          justifyContent: childrenCenter ? 'center' : 'initial',
        }}>
          <canvas
            ref={reactScratchTicketRef}
            width={width}
            height={height}
              style={{
                position: 'absolute',
                left: 0,
                zIndex: 1,
              }}
          />
        {isInitialized ? children : null}
      </div>
    );
  }
);

export default ReactScratchTicket;
