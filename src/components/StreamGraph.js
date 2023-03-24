import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./StreamGraph.css"
import backendData from "../json/backend.json"
import { RGB216, arrMaxNormalization, arrNormalization, listNormalization } from "./utils";

const dynastyLabel = [
    0, 0, // 2
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 15
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 17
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, // 18
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, //25
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
]

const dynastyInterval = [
    37,
    289,
    53,
    319,
    97,
    276
]

const dynastyNames = ["隋", "唐", "五代", "宋", "元", "明"];

export const StreamGraph = ({
    colorBinData,
    colorPalette,
    inputBinMembers, 
    inputBinColors
}) => {
    const clipScoreData = backendData.text_scores;
    const clipScoreOverview = clipScoreData.ideorealm;
    // const clipScoreDetail = clipScoreData.imageries;
    // console.log("test-print-colorBinData", colorBinData)

    const svgContRef = useRef(null);
    const [svgContWH, setSvgContWH] = useState([0, 0]);
    useEffect(() => {
        setSvgContWH([svgContRef.current?.clientWidth || 0, svgContRef.current?.clientHeight || 0])
    }, [svgContRef])

    const timelineHeight = 30;
    const arrowWidth = 12;

    // interactions
    const [selectedDynasty, setSelectedDynasty] = useState(-1);
    const handledDynastyChange = useCallback((newDynasty) => {
        console.log("test", newDynasty, selectedDynasty)
        if(selectedDynasty === -1) {
            setSelectedDynasty(newDynasty);
        } else {
            if(newDynasty === selectedDynasty) {
                setSelectedDynasty(-1);
            } else {
                setSelectedDynasty(newDynasty);
            }
        }
    }, [selectedDynasty])
    // console.log("test-print-selectedDynasty", selectedDynasty)

    const areaGraphs = useMemo(() => {
        // area width
        const normalizedWidth = arrNormalization(dynastyInterval);
        // console.log("test-print-normalizedWidth", normalizedWidth);

        // area height
        const scoreArr = [];
        dynastyInterval.forEach(_ => scoreArr.push([]));
        clipScoreOverview.forEach((v, idx) => scoreArr[dynastyLabel[idx]].push(v));
        // console.log("test-print-scoreArr", scoreArr);

        // max决定整体高度
        const scoreMaxArr = [];
        scoreArr.forEach((arr) => scoreMaxArr.push(Math.max(...arr)));
        const normalizedHeight = arrMaxNormalization(scoreMaxArr);
        const normalziedHeightScale = normalizedHeight.map(v => Math.sqrt(v));
        // console.log("test-print-normalizedHeight", normalizedHeight, normalziedHeightScale);

        // 四分位分数
        const quartileScore = [];
        scoreArr.forEach((arr, idx) => {
            const maxScore = scoreMaxArr[idx];
            const arrSort = arr.sort((a, b) => b - a);
            const index34 = Math.floor(arrSort.length / 4);
            const index14 = Math.floor(3 * arrSort.length / 4);
            const score34 = arrSort[index34];
            const score14 = arrSort[index14];
            quartileScore.push([score14 / maxScore, score34 / maxScore])
        })
        // console.log("test-print-quartileScore", quartileScore);
        
        // area ratio - 每个朝代单独统计
        const areaDynasty = [];
        dynastyInterval.forEach(_ => areaDynasty.push([]));
        for(let i = 0; i < inputBinColors.length; i++) {
            const areaBins = inputBinMembers[i];

            for(let k = 0; k < areaDynasty.length; k++) {
                areaDynasty[k].push(0);
                const currentDynasty = k;
                const currentDynastyColors = []
                for(let m = 0; m < colorBinData.length; m++) {
                    if(dynastyLabel[m] === currentDynasty) {
                        currentDynastyColors.push(colorBinData[m].overview);
                    }
                }

                // 只要areaBins里的颜色
                // console.log("test-print-currentDynastyColors", currentDynastyColors);
                // console.log("test-print-areaBins", areaBins);

                for(let m = 0; m < currentDynastyColors.length; m++) {
                    const normalizedColors = listNormalization(currentDynastyColors[m]);
                    for(let n = 0; n < normalizedColors.length; n++) {
                        const color = normalizedColors[n][0];
                        const colorIndex = areaBins.indexOf(color);
                        if(colorIndex !== -1) {
                            areaDynasty[k][i] += normalizedColors[n][1];
                        }
                    }
                }
            }
        }

        for(let i = 0; i < areaDynasty.length; i++) {
            areaDynasty[i] = arrNormalization(areaDynasty[i]);
        }

        // console.log("test-print-areaDynasty", areaDynasty);

        const areaGraphs = [];
        const areaGraphHeights = [];
        const width = svgContWH[0] - arrowWidth;
        const baseHeight = 1;
        const height = svgContWH[1] - timelineHeight;
        let xPos = 0;
        const dynastyX = normalizedWidth.map(v => {
            const x = xPos + 0.5 * v * width;
            xPos += v * width;
            return x
        });
        normalizedWidth.forEach(_ => areaGraphHeights.push(height));

        // mountain metaphor
        for(let i = 0; i < areaDynasty.length; i++) {
            const areas = []
            for(let k = 0; k < areaDynasty[i].length; k++) {
                const intervalWidth = normalizedWidth[i] * width * 0.5;
                const xStart = dynastyX[i] - intervalWidth;
                const xEnd = xStart + intervalWidth * 2;
                
                const height2 = height - k * baseHeight;
                let path = `M ${xStart} ${height2}`;
                const yGap = normalziedHeightScale[i] * areaDynasty[i][k] * height;
                const y = areaGraphHeights[i] - yGap;

                // lines
                // path += `L ${dynastyX[i]} ${y}`;
                // path += `L ${xEnd} ${height}`;
                // path += `L ${dynastyX[i]} ${areaGraphHeights[i]}`;
                // path += `L ${xStart} ${height} Z`;

                // curves        
                // path += `C ${xStart + quartileScore[i][0] * intervalWidth} ${height}, ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${y}, ${dynastyX[i]} ${y}`;
                // path += `C ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${y}, ${xEnd - quartileScore[i][0] * intervalWidth} ${height}, ${xEnd} ${height}`;
                // path += `C ${xEnd - quartileScore[i][0] * intervalWidth} ${height}, ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${dynastyX[i]} ${areaGraphHeights[i]}`;
                // path += `C ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${xStart + quartileScore[i][0] * intervalWidth} ${height}, ${xStart} ${height} Z`;

                // good
                const height1 = height - (k + 1) * baseHeight;
                path += `L ${xStart} ${height1}`;
                path += `C ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${y}, ${dynastyX[i]} ${y}`;
                path += `C ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${y}, ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${xEnd} ${height1}`;
                
                path += `L ${xEnd} ${height2}`;
                path += `C ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${dynastyX[i]} ${areaGraphHeights[i]}`;
                path += `C ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${xStart} ${height2} Z`;

                areaGraphHeights[i] -= yGap;
    
                const areaColor = inputBinColors[k];
                areas.push(<path d={path} fill={RGB216(`rgb(${areaColor[0]},${areaColor[1]},${areaColor[2]})`)} key={`path-${i}-${inputBinColors[k]}`}/>)
            }
            areaGraphs.push(
                <g key={`mountain-${i}`}>
                    {areas}
                </g>
            )
        }

        return areaGraphs
    }, [
        colorBinData, 
        inputBinMembers, 
        inputBinColors,
        clipScoreOverview, 
        svgContWH
    ])

    // dynastyButton
    const dynastyButtons = useMemo(() => {
        const normalizedWidth = arrNormalization(dynastyInterval);
        return normalizedWidth.map((v, idx) => {
            return <div className="Dynasty-button"
                    key={`dynasty-button-${idx}`}
                    style={{
                        width:`${v * svgContWH[0]}px`
                    }}
                    onClick={() => handledDynastyChange(idx)}
                >
                    {
                        idx === dynastyInterval.length - 1 ? 
                            <div style={{
                                width: "calc(100% - 2px)",
                                height: "100%",
                                display: "flex",
                            }}>
                                <div
                                    style={{
                                        width:"100%",
                                        height: "100%",
                                        backgroundColor: '#b5996f',
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "2px 0px 0px 2px"
                                    }}
                                >
                                    <span>{dynastyNames[idx]}</span>
                                </div>
                                <div
                                    style={{
                                        width: "12px",
                                        height: "0px",
                                        borderStyle: "solid",
                                        borderWidth: "12px 0px 12px 12px",
                                        borderColor: "transparent transparent transparent #b5996f"
                                    }}
                                />
                            </div> 
                        :
                            <div
                                style={{
                                    width:`${v * svgContWH[0] - 2}px`,
                                    height: "100%",
                                    backgroundColor: '#b5996f',
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "2px"
                                }}
                            >
                                <span>{dynastyNames[idx]}</span>
                            </div>
                    }
            </div>
        })
    }, [svgContWH, handledDynastyChange])

    return <div className="StreamGraph-container" ref={svgContRef}>
        <svg 
            width={svgContWH[0] > 0 ? svgContWH[0] - arrowWidth : 0} 
            height={svgContWH[1] > 0 ? svgContWH[1] - timelineHeight : 0}
        >
            {areaGraphs}
        </svg>
        <div className="StreamGraph-dynasty-buttons">
            {dynastyButtons}
        </div>
    </div>
}