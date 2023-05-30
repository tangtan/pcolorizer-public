import { useEffect, useMemo, useRef, useState } from "react";
import "./TimelineView.css"
import { RGB216, arrNormalization, listMaxNormalization, listNormalization } from "./utils";
import color_bins from "../json/backend_color.json"
import color_palette from "../json/color_palette.json"
import backendData from "../json/backend.json"

const clusterLabels = [
    13, 13, 8, 6, 8, 8, 8, 4, 8, 4, 4, 1, 6, 1, 1, 12, 1, 12, 6, 1, 1, 4, 12, 6, 6, 6, 12, 0, 4, 12, 13, 14, 13, 6, 0, 12, 5, 11, 6, 6, 3, 0, 11, 2, 11, 2, 5, 6, 9, 4, 4, 10, 0, 1, 3, 14, 14, 1, 4, 9, 9, 0, 5, 0, 6, 5, 3, 3, 14, 5, 14, 13, 5, 2, 0, 8, 2, 13, 4, 13, 5, 10, 15, 14, 1, 12, 3, 10, 3, 0, 9, 3, 9, 10, 13, 1, 8, 9, 11, 15, 10, 15, 2, 5, 14, 12, 10, 7, 4, 8, 11, 13, 11, 2, 11, 6, 4, 9, 3, 5, 9, 5, 9, 2, 1, 9, 12, 14, 14, 7, 11, 1, 15, 8, 1, 2, 7, 15, 2, 3, 7, 6, 9, 15, 15, 0, 1, 8, 11, 7, 15, 2, 1, 15, 6, 2, 13, 9, 12, 15, 3, 14, 2, 15, 7, 10, 8, 
]

const clusterCenterRGB = [
    [43, 48, 51], [99, 138, 109], [53, 39, 16], [110, 69, 19], [105, 72, 68], [218, 167, 66], [220, 205, 171], [16, 17, 14], [177, 122, 111], [37, 88, 107], [28, 28, 24], [183, 101, 24], [65, 87, 59], [171, 91, 52], [123, 119, 42], [116, 44, 18]
]

const dynastyNames = ["唐", "五代", "宋", "元", "明", "清"];

const dynastyLabel = [
    0, 0, // 2
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 15
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 17
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // 18
    3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, // 25
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, // 32
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 // 30
]

const dynastyInterval = [
    289,
    53,
    319,
    97,
    276,
    268,
]

// const case2MingScatters = [
//     [ // Ming
//         [0.25151798, 0.45730233],
//         [0.28024116, 0.65040994],
//         [0.52426845, 0.51267689],
//         [0.84904999, 0.76787478],
//         [0.93249816, 0.86758554],
//         [0.51215694, 0.29498489],
//         [0.57830828, 0.31706148],
//         [0.048587196, 0.48525175],
//         [0.15947007, 0.79974115],
//         [0.74999678, 0.73722881],
//         [0.63388073, 0.092878297],
//         [0.30837256, 0.56753922],
//         [0.47098598, 0.19718274],
//         [0.81390321, 0.12948835],
//         [0.41776448, 0.90548331],
//         [0.71989661, 0.4290491],
//         [0.93759251, 0.5224938],
//         [0.80595483, 0.94795698],
//         [0.12560055, 0.54027665],
//         [0.0, 0.16411157],
//         [0.55104244, 0.052229248],
//         [1.0, 0.40143466],
//         [0.15067466, 0.37355584],
//         [0.39075053, 1.0],
//         [0.19156273, 0.70726991],
//         [0.78122061, 0.28797475],
//         [0.44439542, 0.3452743],
//         [0.22202611, 0.8326453],
//         [0.36350581, 0.0],
//         [0.089124285, 0.25845814],
//         [0.33599511, 0.67831808],
//         [0.88769192, 0.22825295],
//     ]
// ];

export const DemoTimelineView = ({
    currentImages,
    changeReferenceImages,
}) => {
    const colorBinData = color_bins.color_bins;
    const colorPalette = color_palette.color_palette;
    const clipScoreData = backendData.clip_scores;
    const clipScoreOverview = clipScoreData.ideorealm;
    // const clipScoreDetail = clipScoreData.imageries;

    // console.log("test-print", colorBinData);

    // 统计总体颜色分布
    const colorBinOverviewData = useMemo(() => {
        const colorBinOverviewData = [];
        for(let i = 0; i < colorBinData.length; i++) {
            // 分布归一化
            const singleImage = listNormalization(colorBinData[i].overview);
            for(let k = 0; k < singleImage.length; k++) {
                const singColor = singleImage[k];
                let isContained = false;
                for(let m = 0; m < colorBinOverviewData.length; m++) {
                    if(colorBinOverviewData[m][0] === singColor[0]) {
                        colorBinOverviewData[m][1] += singColor[1];
                        isContained = true;
                        break
                    }
                }
                if(!isContained) colorBinOverviewData.push(singColor);
            }
        }

        const normalizedDatawithn1 = colorBinOverviewData.sort((a, b) => b[1] - a[1]);
        const normalizedData = [];
        normalizedDatawithn1.forEach((v) => {
            if(v[0] === -1) return null // 数据处理时存在的bug: v[0]会等于-1

            // 因为色彩空间转换问题，有些bin的颜色在RGB空间下是一样的 => 合并
            const tempColor = colorPalette[v[0]];
            const tempColorRGB = RGB216(`rgb(${tempColor[0]},${tempColor[1]},${tempColor[2]})`);
            let isContained = false;
            for(let m = 0; m < normalizedData.length; m++) {
                if(tempColorRGB === normalizedData[m][2]) {
                    normalizedData[m][1] += v[1];
                    isContained = true;
                    break;
                }
            }
            if(!isContained) normalizedData.push([v[0], v[1], tempColorRGB, tempColor])
        })

        // 对统计后的bin值进行归一化（最大值为1，方便encoding）
        const normalizedDataNorm = listMaxNormalization(normalizedData);

        return normalizedDataNorm;
    }, [colorBinData, colorPalette])

    // console.log("test-print-colorBinOverviewData", colorBinOverviewData);

    // svg - color stream
    const svgContRef = useRef(null);
    const [svgContWH, setSvgContWH] = useState([0, 0]);
    useEffect(() => {
        setSvgContWH([svgContRef.current?.clientWidth || 0, svgContRef.current?.clientHeight || 0])
    }, [svgContRef])

    // color distribution
    const [hiddenBars, setHiddenBars] = useState([0, 1, 2, 4, 6, 8, 9, 10, 11, 13, 14, 15]);
    const [hiddenDetailBars, setHiddenDetailBars] = useState([]); // 被取消掉的bars

    // console.log("test-print-hiddenDetailBars", hiddenDetailBars);  

    const {colorOverviewBars, clusterMember, clusterNum} = useMemo(() => {
        if(svgContWH[0] > 0) {
            // 统计每个cluster的颜色分布值，记录相关的成员
            const clusterNum = [];
            const clusterMember = [];
            clusterCenterRGB.forEach((_, idx) => {
                clusterNum.push([idx, 0, 0]);
                clusterMember.push([]);
            });
            clusterLabels.forEach((label, idx) => {
                clusterNum[label][1] += colorBinOverviewData[idx][1];
                clusterNum[label][2] += 1;
                clusterMember[label].push(idx);
            });
            clusterNum.sort((a, b) => b[1] - a[1]);

            // the height of the overview bar is equal to timelineHeight
            const hiddenWidth = 20; // px
            const currentWidthforhidden = hiddenWidth * hiddenBars.length;
            const divGap = 2;
            const remainWidth = svgContWH[0] - currentWidthforhidden - divGap * 15; // remain width
            const currentRatio = clusterNum.map((n, idx) => {
                const index = hiddenBars.indexOf(idx);
                if(index === -1) {
                    return n[2]
                } else {
                    return 0
                }
            })
            const currentRatioNorm = arrNormalization(currentRatio);
            
            const overviewBars = clusterNum.map((n, idx) => {
                const barColor = clusterCenterRGB[n[0]];
                const index = hiddenBars.indexOf(idx);
                const barWidth = index === -1 ? remainWidth * currentRatioNorm[idx] : hiddenWidth;
                const barOpacity = index === -1 ? 1 : 1;

                // detail bars
                const detailBars = [];
                if(index === -1) {
                    const binIndexes = clusterMember[n[0]];
                    const binData = [];
                    binIndexes.forEach((v) => binData.push(colorBinOverviewData[v]));
                    binData.sort((a, b) => b[1] - a[1]);

                    const detailWidth = barWidth / binData.length;
                    binData.forEach((v) => {
                        const detailIndex = hiddenDetailBars.indexOf(v[0]);
                        detailBars.push(
                            <div
                                id={`detail-bin-${idx}-${v[0]}`}
                                key={`detail-bin-${idx}-${v[0]}`}
                                style={{
                                    width: `${detailWidth}px`,
                                    height: `${20 + 80 * Math.sqrt(v[1])}%`,
                                    background: `rgba(${v[3][0]},${v[3][1]},${v[3][2]},${detailIndex === -1 ? 1 : 0.3})`,
                                    cursor: "pointer",
                                    borderRadius: "0px 0px 2px 2px"
                                }}
                                onClick={() => {
                                    if(detailIndex === -1) {
                                        hiddenDetailBars.push(v[0])
                                    } else {
                                        hiddenDetailBars.splice(detailIndex, 1)
                                    }
                                    setHiddenDetailBars(JSON.parse(JSON.stringify(hiddenDetailBars)))
                                }}
                            />
                        )
                    })
                } else {
                    const binIndexes = clusterMember[n[0]];
                    let totalRatio = 0;
                    binIndexes.forEach((v) => totalRatio += colorBinOverviewData[v][1]);
                    const detailHeight = totalRatio / binIndexes.length;
                    detailBars.push(
                        <div 
                            key={`detail-bin-${idx}-hidden`} 
                            style={{width: "100%", height: `${20 + 80 * Math.sqrt(detailHeight)}%`, background: `rgba(${barColor[0]},${barColor[1]},${barColor[2]},${barOpacity})`, borderRadius: "2px"}}
                        />
                    )
                }

                return <div
                    key={`bar-container-${idx}`}
                    style={{
                        marginLeft: `${idx === 0 ? 0 : divGap}px`,
                        width: `${barWidth}px`, // bin个数的比例
                        height: "100%",
                    }}
                >
                    <div 
                        key={`overview-bar-${idx}`} 
                        style={{width: "100%", height: "20px", background: `rgba(${barColor[0]},${barColor[1]},${barColor[2]},${barOpacity})`, cursor: "pointer", borderRadius: "2px"}}
                        onClick={() => {
                            if(index === -1) {
                                hiddenBars.push(idx);
                            } else {
                                hiddenBars.splice(index, 1)
                            }
                            setHiddenBars(JSON.parse(JSON.stringify(hiddenBars)))
                        }}
                    />

                    <div key={`detail-bar-${idx}`} style={{marginTop: "2px", width: "100%", height: "calc(100% - 20px - 2px)", display: "flex"}}>
                        {detailBars}
                    </div>
                </div>
            })

            return {
                colorOverviewBars: overviewBars,
                clusterMember: clusterMember,
                clusterNum: clusterNum
            }
        }

        // default return
        return {
            colorOverviewBars: [],
            clusterMember: [],
            clusterNum: []
        }
    }, [colorBinOverviewData, hiddenBars, svgContWH, hiddenDetailBars])

    // console.log("test-print-clusterNum", clusterNum)
    // console.log("test-print-clusterMember", clusterMember)

    const [selectedArea, setSelectedArea] = useState(-1); // clusterNum的index
    const [selectedDynasty, setSelectedDynasty] = useState(-1);

    // color evolution => 实现点击进入二级
    const areaGraphs = useMemo(() => {
        if(svgContWH[0] > 0) {
            // area width
            const normalizedWidth = arrNormalization(dynastyInterval);

            // area height
            const scoreArr = [];
            dynastyInterval.forEach(_ => scoreArr.push([]));
            clipScoreOverview.forEach((v, idx) => scoreArr[dynastyLabel[idx]].push(v));

            // max决定整体高度 => 变成数量            
            const scoreMaxArr = [];
            const scoreMinArr = [];
            scoreArr.forEach((arr) => {
                scoreMaxArr.push(Math.max(...arr));
                scoreMinArr.push(Math.min(...arr));
            });

            // new height
            const heightArr = [];
            dynastyInterval.forEach(_ => heightArr.push(0));
            const binIndexArr = colorBinOverviewData.map((v) => v[0]);

            const currentImages = [];
            for(let idx = 0; idx < colorBinData.length; idx++) {
                const v = colorBinData[idx];
                const paintingColors = v.overview;
                let isHiddenColor = true;

                for(let m = 0; m < paintingColors.length; m++) {
                    if(paintingColors[m][0] === -1) continue
                    // 属于哪个bin
                    const colorIndex = binIndexArr.indexOf(paintingColors[m][0]);

                    const wrongClusterId = clusterLabels[colorIndex];
                    let clusterID = -1;
                    for(let k = 0; k < clusterNum.length; k++) {
                        if(clusterNum[k][0] === wrongClusterId) {
                            clusterID = k;
                            break;
                        }
                    }
                    
                    const clusterIsHidden = hiddenBars.indexOf(clusterID);
                    if(clusterIsHidden === -1) {
                        const binIsHidden = hiddenDetailBars.indexOf(paintingColors[m][0]);
                        if(binIsHidden === -1) {
                            if(idx >= 77 && idx < 109) currentImages.push(idx)
                            isHiddenColor = false;
                            break
                        }
                    }
                }
                if(isHiddenColor === false) heightArr[dynastyLabel[idx]] += 1; // dynastyLabel
            }

            const maxNum = 32; // 召回结果中统计各朝代的数量
            const normalziedHeightScale = heightArr.map((v) => 0.2 + 0.8 * (v / maxNum));
            // console.log("test-print-normalziedHeightScale", hiddenDetailBars, heightArr, normalziedHeightScale, clusterMember);

            // 四分位分数
            const quartileScore = [];
            scoreArr.forEach((_, idx) => {
                const maxScore = scoreMaxArr[idx];
                quartileScore.push([scoreMinArr[idx], maxScore])
            })
  
            if(selectedArea === -1) {
                // area ratio - 每个朝代单独统计
                const inputBinColors = [];
                const binNum = 16;
                for(let i = 0; i < binNum; i++) {
                    if(hiddenBars.indexOf(i) === -1) inputBinColors.push(i); // 只是overview状态
                }

                const areaDynasty = [];
                dynastyInterval.forEach(_ => areaDynasty.push([]));
                for(let i = 0; i < inputBinColors.length; i++) {
                    const sortedBinIndex = clusterMember[clusterNum[inputBinColors[i]][0]]; // 写复杂了
                    // const areaBins = sortedBinIndex.map((v) => colorBinOverviewData[v][0])
                    const areaBins = [];
                    sortedBinIndex.forEach((v) => {
                        const binIndex = colorBinOverviewData[v][0];
                        if(hiddenDetailBars.indexOf(binIndex) === -1) areaBins.push(binIndex)
                    });

                    for(let k = 0; k < areaDynasty.length; k++) {
                        areaDynasty[k].push(0);
                        const currentDynastyColors = []
                        for(let m = 0; m < colorBinData.length; m++) {
                            if(dynastyLabel[m] === k) {
                                currentDynastyColors.push(colorBinData[m].overview);
                            }
                        }

                        for(let m = 0; m < currentDynastyColors.length; m++) {
                            const normalizedColors = listNormalization(currentDynastyColors[m]);
                            for(let n = 0; n < normalizedColors.length; n++) {
                                const colorBinIndex = normalizedColors[n][0];

                                if(areaBins.indexOf(colorBinIndex) !== -1) {
                                    areaDynasty[k][i] += normalizedColors[n][1];
                                }
                            }
                        }
                    }
                }

                for(let i = 0; i < areaDynasty.length; i++) {
                    if(areaDynasty[i].length === 1 && areaDynasty[i][0] === 0) areaDynasty[i] = [0]
                    else areaDynasty[i] = arrNormalization(areaDynasty[i]);
                }

                const areaGraphs = [];
                const areaGraphHeights = [];
                const width = svgContWH[0];
                const baseHeight = 1; // 无数据的Area的基础宽度
                const height = svgContWH[1];
                let xPos = 0;
                const dynastyX = normalizedWidth.map(v => {
                    const x = xPos + 0.5 * v * width;
                    xPos += v * width;
                    return x
                });
                normalizedWidth.forEach(_ => areaGraphHeights.push(height));

                // mountain metaphor
                for(let k = 0; k < inputBinColors.length; k++) {
                    const areas = []
                    for(let i = 0; i < areaDynasty.length; i++) {
                        // if(selectedDynasty.indexOf(i) !== -1) continue

                        const intervalWidth = normalizedWidth[i] * width * 0.5;
                        const xStart = dynastyX[i] - intervalWidth;
                        const xEnd = xStart + intervalWidth * 2;
                        
                        const height2 = height - k * baseHeight;
                        let path = `M ${xStart} ${height2}`;
                        const yGap = normalziedHeightScale[i] * areaDynasty[i][k] * height;
                        const y = areaGraphHeights[i] - yGap;

                        // good
                        const height1 = height - (k + 1) * baseHeight;
                        path += `L ${xStart} ${height1}`;
                        path += `C ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${y}, ${dynastyX[i]} ${y}`;
                        path += `C ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${y}, ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${xEnd} ${height1}`;
                        
                        path += `L ${xEnd} ${height2}`;
                        path += `C ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${dynastyX[i]} ${areaGraphHeights[i]}`;
                        path += `C ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${xStart} ${height2} Z`;

                        areaGraphHeights[i] -= yGap;
            
                        // console.log("print-inputBinColors", inputBinColors[k], clusterNum[inputBinColors[k]][0])

                        const areaColor = clusterCenterRGB[clusterNum[inputBinColors[k]][0]];
                        areas.push(<path d={path} fill={`rgb(${areaColor[0]},${areaColor[1]},${areaColor[2]})`} key={`path-${i}-${inputBinColors[k]}`} />)
                    }
                    areaGraphs.push(
                        <g key={`area-${k}`} onClick={() => setSelectedArea(inputBinColors[k])} style={{cursor: "pointer"}}>
                            {areas}
                        </g>
                    )
                }

                return areaGraphs
            } else {
                // 查看某一个细粒度的bin
                // console.log("test-print-selectedArea", selectedArea)

                const inputBinColors = [];
                const binNum = 16;
                for(let i = 0; i < binNum; i++) {
                    if(hiddenBars.indexOf(i) === -1) inputBinColors.push(i); // 只是overview状态
                }

                const areaDynasty = [];
                const areaDynastyDetail = [];
                dynastyInterval.forEach(_ => {
                    areaDynasty.push([]);
                    areaDynastyDetail.push([])
                });

                for(let i = 0; i < inputBinColors.length; i++) {
                    if(inputBinColors[i] !== selectedArea) { // 不是选中区域的照常计算
                        // console.log("test-print-inputBinColors", inputBinColors[i])
                        const sortedBinIndex = clusterMember[clusterNum[inputBinColors[i]][0]]; // 写复杂了
                        const areaBins = sortedBinIndex.map((v) => colorBinOverviewData[v][0]);

                        for(let k = 0; k < areaDynasty.length; k++) {
                            areaDynasty[k].push(0);
                            const currentDynastyColors = []
                            for(let m = 0; m < colorBinData.length; m++) {
                                if(dynastyLabel[m] === k) {
                                    currentDynastyColors.push(colorBinData[m].overview);
                                }
                            }

                            for(let m = 0; m < currentDynastyColors.length; m++) {
                                const normalizedColors = listNormalization(currentDynastyColors[m]);
                                for(let n = 0; n < normalizedColors.length; n++) {
                                    const colorBinIndex = normalizedColors[n][0];

                                    if(areaBins.indexOf(colorBinIndex) !== -1) {
                                        areaDynasty[k][i] += normalizedColors[n][1];
                                    }
                                }
                            }
                        }
                    } else {
                        // new code
                        for(let k = 0; k < areaDynasty.length; k++) { // 为了上面index不报错
                            areaDynasty[k].push(0);
                        }

                        const sortedBinIndex = clusterMember[clusterNum[inputBinColors[i]][0]];
                        const areaBinsAll = [];
                        sortedBinIndex.forEach((v) => {
                            const binIndex = colorBinOverviewData[v][0];
                            if(hiddenDetailBars.indexOf(binIndex) === -1) areaBinsAll.push(binIndex)
                        });
                        // console.log("test-print-areaBinsAll", areaBinsAll)

                        for(let t = 0; t < areaBinsAll.length; t++) {
                            const areaBins = [areaBinsAll[t]]; // 每个bin单独一个area

                            for(let k = 0; k < areaDynastyDetail.length; k++) {
                                areaDynastyDetail[k].push(0);
                                const currentDynastyColors = []
                                for(let m = 0; m < colorBinData.length; m++) {
                                    if(dynastyLabel[m] === k) {
                                        currentDynastyColors.push(colorBinData[m].overview);
                                    }
                                }
    
                                for(let m = 0; m < currentDynastyColors.length; m++) {
                                    const normalizedColors = listNormalization(currentDynastyColors[m]);
                                    for(let n = 0; n < normalizedColors.length; n++) {
                                        const colorBinIndex = normalizedColors[n][0];
    
                                        if(areaBins.indexOf(colorBinIndex) !== -1) {
                                            areaDynastyDetail[k][t] += normalizedColors[n][1];
                                        }
                                    }
                                }
                            }
                        }

                        for(let i = 0; i < areaDynastyDetail.length; i++) {
                            if(areaDynastyDetail[i].length === 1 && areaDynastyDetail[i][0] === 0) areaDynastyDetail[i] = [0]
                            areaDynastyDetail[i] = arrNormalization(areaDynastyDetail[i]);
                        }
                    }
                }

                // combine areaDynasty and areaDynastyDetail
                for(let i = 0; i < areaDynasty.length; i++) {
                    if(areaDynasty[i].length === 1 && areaDynasty[i][0] === 0) areaDynasty[i] = [0]
                    else areaDynasty[i] = arrNormalization(areaDynasty[i]);
                }

                const areaGraphs = [];
                const areaGraphHeights = [];
                const width = svgContWH[0];
                const baseHeight = 1; // 无数据的Area的基础宽度
                const height = svgContWH[1];
                let xPos = 0;
                const dynastyX = normalizedWidth.map(v => {
                    const x = xPos + 0.5 * v * width;
                    xPos += v * width;
                    return x
                });
                normalizedWidth.forEach(_ => areaGraphHeights.push(height));

                const detailRatio = 0.8;
                const selectedIndex = inputBinColors.indexOf(selectedArea);
                const selectedAreaLen = areaDynastyDetail[0].length;

                // mountain metaphor
                for(let k = 0; k < inputBinColors.length; k++) {
                    if(inputBinColors[k] !== selectedArea) {
                        const areas = []
                        for(let i = 0; i < areaDynasty.length; i++) {
                            // if(selectedDynasty.indexOf(i) !== -1) continue
                            const intervalWidth = normalizedWidth[i] * width * 0.5;
                            const xStart = dynastyX[i] - intervalWidth;
                            const xEnd = xStart + intervalWidth * 2;
                            
                            const height2 = k < selectedIndex ? (height - k * baseHeight) : (height - (k - 1) * baseHeight - selectedAreaLen * baseHeight);
                            let path = `M ${xStart} ${height2}`;
                            const yGap = normalziedHeightScale[i] * areaDynasty[i][k] * height * (1 - detailRatio);
                            const y = areaGraphHeights[i] - yGap;

                            // good
                            const height1 = k < selectedIndex ? (height - (k + 1) * baseHeight) : (height - (k) * baseHeight - selectedAreaLen * baseHeight);
                            path += `L ${xStart} ${height1}`;
                            path += `C ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${y}, ${dynastyX[i]} ${y}`;
                            path += `C ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${y}, ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${xEnd} ${height1}`;
                            
                            path += `L ${xEnd} ${height2}`;
                            path += `C ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${dynastyX[i]} ${areaGraphHeights[i]}`;
                            path += `C ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${xStart} ${height2} Z`;

                            areaGraphHeights[i] -= yGap;
                
                            // console.log("print-inputBinColors", inputBinColors[k], clusterNum[inputBinColors[k]][0])

                            const areaColor = clusterCenterRGB[clusterNum[inputBinColors[k]][0]];
                            areas.push(<path d={path} fill={`rgba(${areaColor[0]},${areaColor[1]},${areaColor[2]}, 0.3)`} key={`path-${i}-${inputBinColors[k]}`} />)
                        }
                        areaGraphs.push(
                            <g key={`area-${k}`} onClick={() => setSelectedArea(inputBinColors[k])} style={{cursor: "pointer"}}>
                                {areas}
                            </g>
                        )
                    } else {

                        const sortedBinIndex = clusterMember[clusterNum[inputBinColors[k]][0]];
                        const areaBinsAll = [];
                        sortedBinIndex.forEach((v) => {
                            const binIndex = colorBinOverviewData[v][0];
                            if(hiddenDetailBars.indexOf(binIndex) === -1) areaBinsAll.push(binIndex)
                        });
                            
                            for(let t = 0; t < selectedAreaLen; t++) {
                                const areas = []; 

                                for(let i = 0; i < areaDynastyDetail.length; i++) {
                                    // if(selectedDynasty.indexOf(i) !== -1) continue
                                    const intervalWidth = normalizedWidth[i] * width * 0.5;
                                    const xStart = dynastyX[i] - intervalWidth;
                                    const xEnd = xStart + intervalWidth * 2;

                                    const height2 = height - (k + t) * baseHeight
                                    let path = `M ${xStart} ${height2}`;
                                    const yGap = normalziedHeightScale[i] * areaDynastyDetail[i][t] * height * detailRatio;
                                    const y = areaGraphHeights[i] - yGap;
        
                                    // good
                                    const height1 = height - (k + t + 1) * baseHeight
                                    path += `L ${xStart} ${height1}`;
                                    path += `C ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${y}, ${dynastyX[i]} ${y}`;
                                    path += `C ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${y}, ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${xEnd} ${height1}`;
                                    
                                    path += `L ${xEnd} ${height2}`;
                                    path += `C ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${dynastyX[i]} ${areaGraphHeights[i]}`;
                                    path += `C ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${xStart} ${height2} Z`;
        
                                    areaGraphHeights[i] -= yGap;
                        
        
                                    const areaColor = colorPalette[areaBinsAll[t]];
                                    // console.log("print-areaColor", areaColor)
                                    areas.push(<path d={path} fill={`rgb(${areaColor[0]},${areaColor[1]},${areaColor[2]})`} key={`path-${i}-${inputBinColors[k]}-${t}`} />)
                                }

                                // console.log("print-t", t, areas.length)

                                areaGraphs.push(
                                    <g key={`area-${k}-${t}`} onClick={() => setSelectedArea(-1)} style={{cursor: "pointer"}}>
                                        {areas}
                                    </g>
                                )
                            }
                        
                    }
                }
                return areaGraphs
            }
        }
        return []

    }, [
        selectedArea,
        svgContWH,
        hiddenBars,
        colorBinOverviewData,
        clusterMember,
        clusterNum,
        clipScoreOverview,
        colorBinData,
        colorPalette,
        hiddenDetailBars,
        // selectedDynasty
    ])

    const referenceImages = useMemo(() => {
        const currentImages = [];
        if(colorBinOverviewData.length > 0) {
            const currentBins = [];
            for(let i = 0; i < clusterNum.length; i++) {
                if(hiddenBars.indexOf(i) === -1) {
                    const cluterIndex = clusterNum[i][0];
                    const clusterBins = clusterMember[cluterIndex];

                    const hiddenIndex = [];
                    for(let k = 0; k < hiddenDetailBars.length; k++) {
                        const binIndex = hiddenDetailBars[k];
                        for(let m = 0; m < colorBinOverviewData.length; m++) {
                            if(colorBinOverviewData[m][0] === binIndex) {
                                hiddenIndex.push(m);
                                break
                            }
                        }
                    }

                    for(let k = 0; k < clusterBins.length; k++) {
                        if(hiddenIndex.indexOf(clusterBins[k]) === -1) {
                            currentBins.push(clusterBins[k]);
                        }
                    }
                }
            }

            for(let i = 0; i < colorBinData.length; i++) {
                if(dynastyLabel[i] === selectedDynasty) {
                    const imageBins = colorBinData[i].overview;
                    for(let k = 0; k < imageBins.length; k++) {
                        const binIndex = imageBins[k][0];

                        let index = -1;
                        for(let m = 0; m < colorBinOverviewData.length; m++) {
                            if(colorBinOverviewData[m][0] === binIndex) {
                                index = m;
                                break
                            }
                        }

                        if(index !== -1) {
                            if(currentBins.indexOf(index) !== -1) {
                                currentImages.push(i);
                                break
                            }
                        }
                    }
                }
            }
        }

        return currentImages;
    }, [colorBinOverviewData, clusterMember, clusterNum, hiddenBars, hiddenDetailBars, colorBinData, selectedDynasty])

    // console.log("test-print-referenceImages", referenceImages)

    useEffect(() => {
        // console.log("test-print", currentImages.length, referenceImages.length)
        if(currentImages.length !== referenceImages.length) changeReferenceImages(referenceImages) 
    }, [currentImages, referenceImages, changeReferenceImages])

    // dynastyButton
    const dynastyButtons = useMemo(() => {
        const normalizedWidth = arrNormalization(dynastyInterval);
        return normalizedWidth.map((v, idx) => {
            // const backColor = selectedDynasty.length === 0 ? "#b5996f" : (selectedDynasty.indexOf(idx) !== -1 ? "#b5996f" : "rgba(181,153,111,0.5)")
            const backColor = selectedDynasty === -1 ? "#b5996f" : (selectedDynasty === idx ? "#b5996f" : "rgba(181,153,111,0.5)");
            return <div className="Dynasty-button"
                    key={`dynasty-button-${idx}`}
                    style={{
                        width:`${v * svgContWH[0]}px`
                    }}
                >
                    {
                        idx === dynastyInterval.length - 1 ? 
                            <div
                                style={{
                                    width:`${v * svgContWH[0]}px`,
                                    height: "100%",
                                    backgroundColor: backColor,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "2px",
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    if(selectedDynasty === idx) setSelectedDynasty(-1)
                                    else {
                                        setSelectedDynasty(idx);
                                    }
                                }}
                            >
                                <span>{dynastyNames[idx]}</span>
                            </div>
                        :
                            <div
                                style={{
                                    width:`${v * svgContWH[0] - 2}px`,
                                    height: "100%",
                                    backgroundColor: backColor,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "2px",
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    if(selectedDynasty === idx) setSelectedDynasty(-1)
                                    else {
                                        setSelectedDynasty(idx);
                                    }
                                }}
                            >
                                <span>{dynastyNames[idx]}</span>
                            </div>
                    }
            </div>
        })
    }, [svgContWH, selectedDynasty, setSelectedDynasty])

    return <div className="Timeline">
        <div className="Visualization-container">
            <div className="Color-evolution" >
                <div ref={svgContRef} style={{width: "100%", height: "calc(100% - 26px)"}}>
                    <svg
                        id="svg-color-stream"
                        width={svgContWH[0]} 
                        height={svgContWH[1]}
                    >
                        {areaGraphs}
                    </svg>
                </div>
                <div className="StreamGraph-dynasty-buttons">
                    {dynastyButtons}
                </div>  
            </div>
            <div className="Color-sanky">

            </div>
            <div className="Color-distribution">
                <div className="Distribution-overview">
                    {colorOverviewBars}
                </div>
            </div>
        </div>
    </div>
}
