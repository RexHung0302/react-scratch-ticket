import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * @description brushType
 */
export type BrushType = 'circle' | 'square';

interface Props {
  brushSize: number;
  brushType: BrushType;
  finishPercent: number;
  maskingLayerImg?: string;
  maskingLayerColor: string;
  animationDuration: number;
  onInitDone: () => void;
  onComplete: () => void;
  onResetDone: () => void;
}

const useReactScratchTicketController = ({ brushSize, brushType, finishPercent, maskingLayerImg, maskingLayerColor, animationDuration, onInitDone, onComplete, onResetDone }: Props) => {
  const reactScratchTicketRef = useRef<HTMLCanvasElement>(null);
  const isCompletedRef = useRef(false);
  const isInitDoneCalled = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * @description Completed handler, show hole image
   */
  const completedHandler = useCallback(() => {
    const canvas = reactScratchTicketRef.current;
    if (!canvas) {
      console.error('Canvas is not supported or not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas 2d is not supported or not found');
      return;
    }

    const { width, height } = canvas;

    if (animationDuration > 0) {
      let alpha = 1.0;
      const fadeOut = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(0, 0, width, height);
        alpha -= 0.05;
        if (alpha > 0) {
          requestAnimationFrame(fadeOut);
        } else {
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = 'transparent';
          ctx.fillRect(0, 0, width, height);
        }
      };

      fadeOut();
    } else {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, width, height);
    }
  }, [animationDuration]);

  /**
   * @description Check the scratch completion
   */
  const checkScratchCompletion = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (isCompletedRef.current) return;

      const imageData = ctx.getImageData(0, 0, width, height);
      let count = 0;

      // Because the image data is in the format of [r, g, b, a, r, g, b, a, ...]
      // so we need to check the alpha value, which is the 4th value in the array
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] === 0) {
          count++;
        }
      }

      // Calculate the percentage of the scratched area
      if ((count / (width * height)) * 100 > 100 - finishPercent) {
        isCompletedRef.current = true;
        completedHandler();

        // Call the complete callback
        onComplete();
      }
    },
    [completedHandler, finishPercent, onComplete]
  );

  /**
   * @description Scratch handler
   */
  const scratchHandler = useCallback(
    ({ e, canvas, ctx }: { e: MouseEvent | Touch; canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }) => {
      ctx.beginPath();
      const { left, top } = canvas.getBoundingClientRect();
      let x = 0;
      let y = 0;
      if (e instanceof TouchEvent) {
        x = e.touches[0].clientX - left;
        y = e.touches[0].clientY - top;
      } else {
        x = e.clientX - left;
        y = e.clientY - top;
      }
      ctx.globalCompositeOperation = 'destination-out';
      ctx.closePath();
      if (brushType === 'circle') {
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      } else {
        ctx.clearRect(x - brushSize, y - brushSize, brushSize * 2, brushSize * 2);
      }
      ctx.fill();

      checkScratchCompletion(ctx, canvas.width, canvas.height);
    },
    [brushSize, brushType, checkScratchCompletion]
  );

  /**
   * @description Init the scratch ticket
   */
  const initScratchTicket = useCallback(
    ({ reset = false }: { reset?: boolean } = {}) => {
      const canvas = reactScratchTicketRef.current;
      if (!canvas) {
        console.error('Canvas is not supported or not found');
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas 2d is not supported or not found');
        return;
      }

      const { width, height } = canvas;
      ctx.globalCompositeOperation = 'source-over';
      if (!maskingLayerImg) {
        ctx.fillStyle = maskingLayerColor;
      } else {
        ctx.fillStyle = '#ddd';
      }
      ctx.fillRect(0, 0, width, height);

      if (maskingLayerImg) {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // avoid tainted canvas
        img.src = maskingLayerImg;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          setIsInitialized(true);
        };
      } else {
        ctx.fillStyle = maskingLayerColor;
        ctx.fillRect(0, 0, width, height);
        setIsInitialized(true);
      }

      if (reset) {
        isCompletedRef.current = false; // reset the completed flag
        onResetDone();
      }
    },
    [maskingLayerColor, maskingLayerImg]
  );

  /**
   * @description Init the scratch ticket
   */
  useEffect(() => {
    const canvas = reactScratchTicketRef.current;
    if (!canvas) {
      console.error('Canvas is not supported or not found');
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas 2d is not supported or not found');
      return;
    }

    initScratchTicket();

    let isScratching = false;

    const startScratching = () => {
      if (!isInitialized) return;
      isScratching = true;
    };
    const stopScratching = () => (isScratching = false);
    const scratchingHandler = (e: MouseEvent) => {
      if (isScratching) {
        scratchHandler({ e, canvas, ctx });
      }
    };
    const touchMoveHandler = (e: TouchEvent) => {
      if (isScratching && e.touches.length > 0) {
        scratchHandler({ e: e.touches[0], canvas, ctx });
      }
    };

    canvas.addEventListener('mousedown', startScratching);
    canvas.addEventListener('touchstart', startScratching);
    canvas.addEventListener('mouseup', stopScratching);
    canvas.addEventListener('touchend', stopScratching);
    canvas.addEventListener('mousemove', scratchingHandler);
    canvas.addEventListener('touchmove', touchMoveHandler);

    if (!isInitDoneCalled.current) {
      onInitDone();
      isInitDoneCalled.current = true;
    }

    return () => {
      canvas.removeEventListener('mousedown', startScratching);
      canvas.removeEventListener('touchstart', startScratching);
      canvas.removeEventListener('mouseup', stopScratching);
      canvas.removeEventListener('touchend', stopScratching);
      canvas.removeEventListener('mousemove', scratchingHandler);
      canvas.removeEventListener('touchmove', touchMoveHandler);
    };
  }, [initScratchTicket, maskingLayerColor, maskingLayerImg, scratchHandler, onInitDone, isInitialized]);

  /**
   * @description Reset handler
   */
  const resetHandler = () => {
    if (!reactScratchTicketRef.current) {
      console.error('Canvas is not supported or not found');
      return;
    }

    if (!isInitialized) {
      console.error('The scratch ticket is not initialized');
      return;
    }

    setIsInitialized(false);
    initScratchTicket({ reset: true });
  };

  /**
   * @description Clean all handler
   */
  const cleanCardHandler = () => {
    if (!reactScratchTicketRef.current) {
      console.error('Canvas is not supported or not found');
      return;
    }

    if (!isInitialized) {
      console.error('The scratch ticket is not initialized');
      return;
    }
    
    completedHandler()
  };

  return {
    isInitialized,
    reactScratchTicketRef,
    resetHandler,
    cleanCardHandler,
  };
};

export default useReactScratchTicketController;
