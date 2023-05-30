import "./PaintBoard.css";
import { useCallback, useMemo, useState } from "react";
import { IndentPanel } from "./IndentPanel";
import { CanvasPainter } from "./CanvasPainter";
import { MetaPanel } from "./MetaPanel";

export const DemoPaintBoard = ({
    restoredImages
}) => {
    const iconSizeLevel1 = 24;

    const [currentDisplayOne, setCurrentDisplayOne] = useState(0);
    const [currentDisplayTwo, setCurrentDisplayTwo] = useState(-1);
    // const [restoredImages, setRestoredImages] = useState([case2Query, case2Restored1]);

    // onTouch没法区分左右键的点击 => 先绕一点吧 => 取消再点击
    const handleImageClick = useCallback((newIndex) => {
        if(newIndex === currentDisplayOne) {
            setCurrentDisplayOne(-1);
        } else {
            if(newIndex === currentDisplayTwo) {
                setCurrentDisplayTwo(-1);
            } else {
                if(currentDisplayOne === -1) {
                    setCurrentDisplayOne(newIndex);
                } else {
                    setCurrentDisplayTwo(newIndex);
                }
            }
        }
    }, [currentDisplayOne, currentDisplayTwo])

    // 拖拽 - 两个canvas共享
    const [currentLT, setCurrentLT] = useState([0, 0]);
    // 缩放 - 两个canvas共享
    const [currentScale, setCurrentScale] = useState(1);
    const maxScale = 10;

    const {imageTitles, imagePainters}= useMemo(() => {
        const imageTitles = [];
        const imagePainters = [];
        let num = 0;
        if(currentDisplayOne !== -1 && currentDisplayTwo === -1) {
            num = 1;
        } else if (currentDisplayOne !== -1 && currentDisplayTwo !== -1) {
            num = 2;
        }
        const width = num === 1 ? "100%" : (num === 2 ? "calc(50% - 1.5px)" : "0")
        for(let i = 0; i < num; i++) {
            const name = i === 0 ? "1st" : "2nd";
            imageTitles.push(
                <div className="Window-container" key={`window-container-${name}`} style={{width: width}}>
                    <div className="Image-title">
                        <div className="Tixing-div"/>
                        <div className="Image-title-text">
                            <span>{`${name} Window`}</span>
                        </div>
                    </div>
                </div>
            )

            const canvasImage = i === 0 ? restoredImages[currentDisplayOne] : (i === 1 ? restoredImages[currentDisplayTwo] : "")
            imagePainters.push(
                <div className="Canvas-container" key={`canvas-container-${name}`} style={{width: width, height: "100%"}}>
                    <CanvasPainter 
                        imgSrc={canvasImage} 
                        state={num} 
                        index={i}
                        sharedMove={currentLT}
                        changeSharedMove={(newLT) => {
                            if(newLT[0] !== currentLT[0] || newLT[1] !== currentLT[1]) setCurrentLT(newLT)
                        }}
                        sharedScale={currentScale}
                        changeSharedScale={(v => {
                            if(v > 0) {
                                const newScale = Math.min(maxScale, currentScale * 1.25);
                                setCurrentScale(newScale);
                            } else if (v < 0) {
                                const newScale = Math.max(1, currentScale / 1.25);
                                setCurrentScale(newScale);
                            }
                        })}
                    />
                </div>
            )
            if(num === 2 && i === 0) imagePainters.push(<div key={'canvas-split'} style={{width: "3px", height: "calc(100% + 1px)", backgroundColor: "#5a4e3b"}}/>)
        }
        return {
            imageTitles: imageTitles,
            imagePainters: imagePainters
        }
    }, [currentDisplayOne, currentDisplayTwo, restoredImages, currentLT, currentScale]) 

    return <div className="PaintBoard-container">
        <div className="Board-content">
            <div className="Board-painter">
                <div className="Painting-navigator">
                    {imageTitles}
                </div>
                <div className="Painting-canvas-container">
                    <div className="Painting-canvas">
                        {imagePainters}
                    </div>
                    <div className="Poem-panel">
                        <MetaPanel iconSize={iconSizeLevel1}/>
                    </div>
                </div>
            </div>
            <div className="Board-loader">
                <IndentPanel 
                    iconSize={iconSizeLevel1}
                    restoredImages={restoredImages}
                    displayOne={currentDisplayOne}
                    displayTwo={currentDisplayTwo}
                    handleImageClick={handleImageClick}
                />
            </div>
        </div>
    </div>
}
