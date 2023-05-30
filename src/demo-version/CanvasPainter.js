import { useEffect, useRef, useState } from "react";
import "./CanvasPainter.css";
import { adaptWH } from "./utils";

export const CanvasPainter = ({
    imgSrc,
    state = 0,
    index,
    sharedMove,
    changeSharedMove,
    sharedScale,
    changeSharedScale,
}) => {

    const canvasRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState([0, 0]);
    useEffect(() => {
        setCanvasSize([
            canvasRef.current?.clientWidth || 0,
            canvasRef.current?.clientHeight || 0
        ]);
    }, [canvasRef, state])

    const [currentWH, setCurrentWH] = useState([0, 0]);
    useEffect(() => {
        if(imgSrc !== "" && canvasSize[0] > 0) {
            const inputImage = new Image();
            inputImage.src = imgSrc;
            inputImage.onload = () => {
                const tagSize = adaptWH([inputImage.width, inputImage.height], canvasSize);
                const left = (canvasSize[0] - tagSize[0]) / 2;
                const top = (canvasSize[1] - tagSize[1]) / 2;
                setCurrentWH(tagSize);
                changeSharedMove([left, top]);
            }
        }
    }, [imgSrc, canvasSize])

    // 缩放
    // const [currentScale, setCurrentScale] = useState(1);
    // const maxScale = 10;
    // const handleWheelChange = useCallback((v) => {
    //     if(v === 150) {
    //         const newScale = Math.min(maxScale, currentScale * 1.25);
    //         setCurrentScale(newScale);
    //     } else if (v === -150) {
    //         const newScale = Math.max(1, currentScale / 1.25);
    //         setCurrentScale(newScale);
    //     }
    // }, [currentScale])

    // 拖拽 => 复用之前的代码 => 有时间的话加个移动边界限制
    const [isMaskDrag, setIsMaskDrag] = useState(false);
    const [maskMoveP, setMaskMoveP] = useState([0, 0]);

    const handleDragStart = (e) => {
        setIsMaskDrag(true);
        setMaskMoveP([
            e.clientX,
            e.clientY,
        ]);
    }

    const handleDragMove = (e) => {
        if(isMaskDrag) {
            if(e.clientX !== maskMoveP[0] || e.clientY !== maskMoveP[1]) {
                changeSharedMove([
                    sharedMove[0] + e.clientX - maskMoveP[0],
                    sharedMove[1] + e.clientY - maskMoveP[1],
                ]);
                setMaskMoveP([
                    e.clientX,
                    e.clientY
                ])
            }
        }
    }

    const handleDragEnd = (e) => {
        if(isMaskDrag) {
            setIsMaskDrag(false);
            setMaskMoveP([0, 0]);
        }
    }

    return <div className="CanvasPainter-container" ref={canvasRef}>
        <div 
            key={`canvas-image-${index}`}
            style={{
                width: `${currentWH[0] * sharedScale}px`,
                height: `${currentWH[1] * sharedScale}px`,
                position: "absolute",
                zIndex: "100",
                left: `${sharedMove[0]}px`,
                top: `${sharedMove[1]}px`,
                backgroundImage: `url(${imgSrc})`,
                backgroundSize: '100% 100%',
            }}
            onWheel={(e) => changeSharedScale(e.deltaY)}
            onMouseDown={(e) => handleDragStart(e)}
            onMouseMove={(e) => handleDragMove(e)}
            onMouseUp={(e) => handleDragEnd(e)}
        >
                
        </div>
    </div>
}