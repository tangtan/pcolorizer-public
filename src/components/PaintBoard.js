import "./PaintBoard.css";
import RecallActiveSVG from "../icons/recall_active.svg";
import RecallUnactiveSVG from "../icons/recall_unactive.svg";
import BrushSVG from "../icons/brush.svg";
import ColorPickerSVG from "../icons/color_picker.svg";
import SelectSVG from "../icons/select.svg";
import { useCallback, useMemo, useState } from "react";
import { IndentPanel } from "./IndentPanel";
import case2Query from "../images/case2/query.jpg";
import case2Restored1 from "../images/case2/restored1.jpg";
import { CanvasPainter } from "./CanvasPainter";
import { MetaPanel } from "./MetaPanel";

export const PaintBoard = ({

}) => {
    const iconSizeLevel1 = 24;
    const iconSizeLevel2 = 36;
    const activeColor = "#fff6dc";
    const unactiveColor = "#b09872";

    // console.log("print-test-case2Query", case2Query) // 静态地址

    const [selectedTool, setSelectedTool] = useState(-1);
    const handleToolChange = useCallback((newTool) => {
        if(selectedTool === -1) {
            setSelectedTool(newTool);
        } else {
            if(newTool === selectedTool) {
                setSelectedTool(-1);
            } else {
                setSelectedTool(newTool);
            }
        }
    }, [selectedTool])

    const [currentDisplayOne, setCurrentDisplayOne] = useState(0);
    const [currentDisplayTwo, setCurrentDisplayTwo] = useState(-1);
    const [restoredImages, setRestoredImages] = useState([case2Query, case2Restored1]);

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
                            if(v === 150) {
                                const newScale = Math.min(maxScale, currentScale * 1.25);
                                setCurrentScale(newScale);
                            } else if (v === -150) {
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
        <div className="Board-navigator">
                <div className="Board-tool-recall">
                    <div className="Board-tool-icon"
                        style={{
                            background: `url(${RecallActiveSVG}) no-repeat`,
                            backgroundSize: 'contain',
                            width: `${iconSizeLevel1}px`,
                            height: `${iconSizeLevel1}px`,
                        }}
                    />
                    <div className="Board-tool-icon"
                        style={{
                            marginLeft: "6px",
                            background: `url(${RecallUnactiveSVG}) no-repeat`,
                            backgroundSize: 'contain',
                            border: "2px solid #74644c",
                            width: `${iconSizeLevel1}px`,
                            height: `${iconSizeLevel1}px`,
                            transform: "rotateY(180deg)",
                        }}
                    />
                </div>
                <div className="Board-tool-painting">
                        <div style={{width: "100%"}}>
                            <div className="Board-tool-container">
                                <div className="Board-tool-icon"
                                    style={{
                                        marginLeft: "-4px",
                                        background: `url(${BrushSVG}) no-repeat`,
                                        backgroundSize: 'contain',
                                        backgroundColor: `${selectedTool === 0 ? activeColor : unactiveColor}`,
                                        width: `${iconSizeLevel2}px`,
                                        height: `${iconSizeLevel2}px`,
                                    }}
                                    onClick={() => handleToolChange(0)}
                                />
                            </div>
                            <div className="Board-tool-container">
                                <div className="Board-tool-icon"
                                    style={{
                                        marginLeft: "-4px",
                                        marginTop: "36px",
                                        background: `url(${SelectSVG}) no-repeat`,
                                        backgroundSize: 'contain',
                                        backgroundColor: `${selectedTool === 1 ? activeColor : unactiveColor}`,
                                        width: `${iconSizeLevel2}px`,
                                        height: `${iconSizeLevel2}px`,
                                    }}
                                    onClick={() => handleToolChange(1)}
                                />
                            </div>
                            <div className="Board-tool-container">
                                <div className="Board-tool-icon"
                                    style={{
                                        marginLeft: "-4px",
                                        marginTop: "72px", // 好奇怪的BUG
                                        background: `url(${ColorPickerSVG}) no-repeat`,
                                        backgroundSize: 'contain',
                                        backgroundColor: `${selectedTool === 2 ? activeColor : unactiveColor}`,
                                        width: `${iconSizeLevel2}px`,
                                        height: `${iconSizeLevel2}px`,
                                    }}
                                    onClick={() => handleToolChange(2)}
                                />
                            </div>

                            <div className="Board-tool-container">
                                <div className="Board-tool-icon"
                                    style={{
                                        marginLeft: "-4px",
                                        marginTop: "108px",
                                        backgroundColor: `${"#1a7f7f"}`,
                                        width: `${iconSizeLevel2}px`,
                                        height: `${iconSizeLevel2}px`,
                                    }}
                                />
                            </div>
                        </div>
                </div>
        </div>
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

// const imageTitle = useMemo(() => {
//     return restoredImages.map((name) => {
//         return <div className="Image-title" key={`image-title-${name}`}>
//             <div className="Tixing-div"/>
//             <div className="Image-title-text">
//                 <span>{name}</span>
//             </div>
//         </div>
//     })
// }, [restoredImages]);

// 初始化canvas => TODO: 1) scale; 2) drawing
// useEffect(() => {
//     if(canvasSize[0] > 0) {
//         const canvasWidth = canvasSize[0] - 24;
//         const canvasHeight = canvasSize[1];
//         const borderWidth = 10;
//         const restoredImage = new Image();
//         restoredImage.src = case2Query;
//         restoredImage.onload = () => {
//             const canvas = document.getElementById('painting-canvas');
//             const canvasCont = canvas.getContext('2d');
//             const imageWHRatio = restoredImage.width / restoredImage.height;
//             // console.log("test-print", restoredImage.width, restoredImage.height);
//             const displayHeight = canvasHeight - 2 * borderWidth;
//             canvasCont.drawImage(restoredImage, borderWidth, borderWidth, displayHeight * imageWHRatio, displayHeight);
//         }
//     }
// }, [canvasSize])