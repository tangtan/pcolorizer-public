import { useEffect, useMemo, useRef, useState } from "react";
import "./TimelineView.css"
import { RGB216, arrNormalization, listMaxNormalization, listNormalization } from "./utils";
import color_bins from "../json/backend_color.json"
import color_palette from "../json/color_palette.json"
import backendData from "../json/backend.json"
// import { saveAs } from 'file-saver';

const clusterLabels = [
    // 7334
    // 13, 13, 13, 4, 0, 0, 0, 2, 0, 2, 2, 3, 4, 3, 9, 2, 8, 2, 4, 0, 0, 1, 2, 9, 4, 9, 2, 1, 12, 1, 3, 7, 10, 4, 1, 12, 9, 7, 4, 4, 10, 1, 7, 12, 10, 12, 9, 4, 8, 2, 2, 5, 1, 8, 12, 3, 3, 8, 1, 11, 11, 1, 9, 1, 4, 7, 10, 10, 7, 9, 3, 13, 9, 15, 1, 8, 15, 13, 13, 13, 9, 5, 12, 3, 8, 8, 10, 5, 12, 1, 11, 10, 8, 5, 13, 0, 0, 11, 7, 6, 5, 6, 15, 7, 10, 2, 5, 14, 13, 0, 7, 7, 10, 15, 10, 4, 13, 11, 10, 9, 8, 9, 11, 15, 8, 11, 3, 3, 3, 14, 7, 3, 6, 0, 8, 12, 14, 6, 15, 10, 14, 4, 11, 6, 6, 11, 3, 13, 7, 14, 12, 15, 8, 6, 4, 15, 13, 8, 11, 6, 10, 3, 15, 6, 14, 5, 0

    // 0
    // 13, 13, 13, 6, 1, 1, 6, 13, 1, 2, 2, 4, 6, 4, 6, 4, 4, 7, 8, 6, 6, 2, 2, 6, 8, 6, 2, 14, 2, 2, 13, 1, 3, 8, 14, 15, 12, 10, 8, 8, 3, 14, 10, 15, 3, 15, 12, 8, 7, 2, 7, 14, 14, 7, 15, 3, 4, 6, 2, 11, 7, 11, 12, 14, 8, 12, 3, 3, 10, 12, 4, 13, 12, 5, 14, 7, 5, 13, 2, 13, 12, 14, 15, 10, 4, 7, 9, 14, 15, 14, 7, 15, 7, 0, 13, 6, 1, 11, 10, 9, 0, 9, 5, 10, 3, 7, 0, 0, 13, 1, 10, 1, 3, 5, 3, 6, 2, 11, 3, 12, 7, 12, 11, 5, 4, 11, 4, 4, 4, 0, 10, 4, 9, 6, 7, 15, 0, 9, 5, 3, 0, 8, 11, 9, 9, 11, 4, 13, 10, 0, 15, 5, 4, 9, 8, 5, 13, 7, 11, 9, 3, 4, 5, 9, 0, 5, 1, 

    // 2
    13, 13, 8, 6, 8, 8, 8, 4, 8, 4, 4, 1, 6, 1, 1, 12, 1, 12, 6, 1, 1, 4, 12, 6, 6, 6, 12, 0, 4, 12, 13, 14, 13, 6, 0, 12, 5, 11, 6, 6, 3, 0, 11, 2, 11, 2, 5, 6, 9, 4, 4, 10, 0, 1, 3, 14, 14, 1, 4, 9, 9, 0, 5, 0, 6, 5, 3, 3, 14, 5, 14, 13, 5, 2, 0, 8, 2, 13, 4, 13, 5, 10, 15, 14, 1, 12, 3, 10, 3, 0, 9, 3, 9, 10, 13, 1, 8, 9, 11, 15, 10, 15, 2, 5, 14, 12, 10, 7, 4, 8, 11, 13, 11, 2, 11, 6, 4, 9, 3, 5, 9, 5, 9, 2, 1, 9, 12, 14, 14, 7, 11, 1, 15, 8, 1, 2, 7, 15, 2, 3, 7, 6, 9, 15, 15, 0, 1, 8, 11, 7, 15, 2, 1, 15, 6, 2, 13, 9, 12, 15, 3, 14, 2, 15, 7, 10, 8, 
]

const clusterCenterRGB = [
    // [173, 136, 120], [51, 51, 51], [88, 85, 70], [110, 121, 55], [223, 210, 181], [28, 28, 24], [124, 43, 19], [201, 120, 36], [68, 119, 118], [207, 172, 84], [127, 77, 19], [32, 77, 92], [74, 56, 22], [160, 85, 63], [16, 17, 14], [50, 36, 14]

    // [18, 19, 16], [201, 125, 90], [90, 70, 58], [126, 81, 21], [95, 126, 70], [49, 34, 13], [158, 162, 144], [62, 103, 108], [240, 219, 183], [126, 45, 20], [189, 117, 29], [30, 72, 88], [215, 169, 71], [161, 90, 64], [41, 41, 40], [76, 56, 19]

    [43, 48, 51], [99, 138, 109], [53, 39, 16], [110, 69, 19], [105, 72, 68], [218, 167, 66], [220, 205, 171], [16, 17, 14], [177, 122, 111], [37, 88, 107], [28, 28, 24], [183, 101, 24], [65, 87, 59], [171, 91, 52], [123, 119, 42], [116, 44, 18]
]

const dynastyNames = ["唐", "五代", "宋", "元", "明", "清"]; // 从唐开始

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
    // 37,
    289,
    53,
    319,
    97,
    276,
    268,
]

const case2MingScatters = [
    [ // Ming
        [0.25151798, 0.45730233],
        [0.28024116, 0.65040994],
        [0.52426845, 0.51267689],
        [0.84904999, 0.76787478],
        [0.93249816, 0.86758554],
        [0.51215694, 0.29498489],
        [0.57830828, 0.31706148],
        [0.048587196, 0.48525175],
        [0.15947007, 0.79974115],
        [0.74999678, 0.73722881],
        [0.63388073, 0.092878297],
        [0.30837256, 0.56753922],
        [0.47098598, 0.19718274],
        [0.81390321, 0.12948835],
        [0.41776448, 0.90548331],
        [0.71989661, 0.4290491],
        [0.93759251, 0.5224938],
        [0.80595483, 0.94795698],
        [0.12560055, 0.54027665],
        [0.0, 0.16411157],
        [0.55104244, 0.052229248],
        [1.0, 0.40143466],
        [0.15067466, 0.37355584],
        [0.39075053, 1.0],
        [0.19156273, 0.70726991],
        [0.78122061, 0.28797475],
        [0.44439542, 0.3452743],
        [0.22202611, 0.8326453],
        [0.36350581, 0.0],
        [0.089124285, 0.25845814],
        [0.33599511, 0.67831808],
        [0.88769192, 0.22825295],
    ]

    // [
    //     [0.40021423, 0.45730233] ,
    //     [0.62171233, 0.65040994] ,
    //     [0.22750829, 0.51267689] ,
    //     [0.59345132, 0.76787478] ,
    //     [0.73974705, 0.86758554] ,
    //     [0.53793162, 0.59498489] ,
    //     [0.42767143, 0.31706148] ,
    //     [0.25797978, 0.48525175] ,
    //     [0.9500407, 0.79974115] ,
    //     [0.45529574, 0.73722881] ,
    //     [1.0, 0.092878297] ,
    //     [0.80254698, 0.56753922] ,
    //     [0.90830177, 0.19718274] ,
    //     [0.091153771, 0.12948835] ,
    //     [0.34461001, 0.90548331] ,
    //     [0.28761062, 0.4290491] ,
    //     [0.48291996, 0.6224938] ,
    //     [0.67971677, 0.94795698] ,
    //     [0.31633219, 0.54027665] ,
    //     [0.19600929, 0.16411157] ,
    //     [0.77065504, 0.052229248] ,
    //     [0.65082139, 0.40143466] ,
    //     [0.3725504, 0.37355584] ,
    //     [0.16312657, 1.0] ,
    //     [0.87072003, 0.70726991] ,
    //     [0.0, 0.28797475] ,
    //     [0.12846814, 0.3452743] ,
    //     [0.51050824, 0.8326453] ,
    //     [0.049664792, 0.0] ,
    //     [0.83575475, 0.25845814] ,
    //     [0.70956415, 0.67831808] ,
    //     [0.56554335, 0.22825295] ,
    // ]
];

const hardCodeColorBins = [5411, 6611, 6211, 5791, 5391, 5790, 5390, 4990, 5811, 6190, 5810, 5410, 6191, 5010, 4590, 6591, 5389, 5789, 7010, 7410, 6610, 6990, 6210, 5770, 5769];

export const TimelineView = ({
    // colorBinData,
}) => {
    const colorBinData = color_bins.color_bins;
    const colorPalette = color_palette.color_palette;
    const clipScoreData = backendData.clip_scores;
    const clipScoreOverview = clipScoreData.ideorealm;
    const clipScoreDetail = clipScoreData.imageries;
    // console.log("test-print-clipScoreDetail", clipScoreDetail);

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

            // 输出94.jpg的颜色
            if(i === 93) {
                const requiredColorBins = singleImage.map(v => v[0]);
                console.log("test-print-requiredColorBins", requiredColorBins)
                // 5411, 6611, 6211, 5791, 5391, 5790, 5390, 4990, 5811, 6190, 5810, 5410, 6191, 5010, 4590, 6591, 5389, 5789, 7010, 7410, 6610, 6990, 6210, 5770, 5769
            }
        }

        const normalizedDatawithn1 = colorBinOverviewData.sort((a, b) => b[1] - a[1]);
        const normalizedData = [];
        normalizedDatawithn1.forEach((v) => {
            // bug: v[0]会等于-1
            if(v[0] === -1) return null

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
        // console.log("test-print-normalizedData", normalizedDataNorm) // len: 159 => 167

        // 输出到后端算cluster结果
        // const color_bins = [];
        // for(let i = 80; i < normalizedDataNorm.length; i++) {
        //     color_bins.push(normalizedDataNorm[i][0])
        // }
        // console.log("color_bins: ", color_bins)

        return normalizedDataNorm;
    }, [colorBinData, colorPalette])

    // console.log("test-print-clipScoreOverview", clipScoreOverview); // 139

    // 计算每个painting schemes => 给后端
    // const mingPaintings = [77, 109];
    // const colorFeatures = [];
    // for(let i = mingPaintings[0]; i < mingPaintings[1]; i++) {
    //     const colorschemes = colorBinData[i].overview;
    //     // console.log("test-print-colorshceme: ", i, colorschemes)
    //     const colorfeatureIndex = [];
    //     const colorfeatures = [];
    //     colorBinOverviewData.forEach(v => {
    //         colorfeatureIndex.push(v[0])
    //         colorfeatures.push(0)
    //     })
    //     // console.log("test-print-colorfeatures: ", colorfeatureIndex, colorfeatures)
    //     colorschemes.forEach(v => {
    //         const binIndex = colorfeatureIndex.indexOf(v[0]);
    //         colorfeatures[binIndex] = v[1]
    //     })
    //     colorFeatures.push(arrMaxNormalization(colorfeatures))
    // }

    // useEffect(() => {
    //     if(colorFeatures.length > 0) {
    //         console.log("test-print-colorFeatures", colorFeatures)
    //         const jsonData = JSON.stringify({
    //             "color_features": colorFeatures,
    //         })
    
    //         const blobData = new Blob([jsonData], {type: "application/json"});
    //         saveAs(blobData, 'colorfeatures.json');
    //     }
    // }, [colorFeatures])


    // svg - color stream
    const svgContRef = useRef(null);
    const [svgContWH, setSvgContWH] = useState([0, 0]);
    useEffect(() => {
        setSvgContWH([svgContRef.current?.clientWidth || 0, svgContRef.current?.clientHeight || 0])
    }, [svgContRef])

    // console.log("test-print-svgContWH", svgContWH);

    // color distribution
    const [hiddenBars, setHiddenBars] = useState([0, 1, 2, 4, 6, 8, 9, 10, 11, 13, 14, 15]);  // 当前显示：3,5,7,12
    const [hiddenDetailBars, setHiddenDetailBars] = useState([]);

    console.log("hardcode-data", hiddenDetailBars) // 6190, 5769, 4990, 5389 => 

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

            // console.log("test-print-clusterNum + clusterMember: ", clusterNum, clusterMember)

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
            // console.log("test-print-currentRatioNorm: ", currentRatioNorm)

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
                    // console.log("test-print-binData", binData)
                    const detailWidth = barWidth / binData.length;
                    binData.forEach((v) => {
                        const detailIndex = hiddenDetailBars.indexOf(v[0]);

                        // hardcode

                        detailBars.push(
                            <div
                                key={`detail-bin-${idx}-${v[0]}`}
                                style={{
                                    width: `${detailWidth}px`,
                                    height: `${20 + 80 * Math.sqrt(v[1])}%`,
                                    background: `rgba(${v[3][0]},${v[3][1]},${v[3][2]},${detailIndex === -1 ? 1 : 0.3})`,

                                    // background: hardCodeColorBins.indexOf(v[0]) !== -1 ? `rgba(${v[3][0]},${v[3][1]},${v[3][2]},${1})` : "#ccc",

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

    const [selectedArea, setSelectedArea] = useState(-1); // clusterNum的index

    const [selectedDynasty, setSelectedDynasty] = useState([]);

    // color evolution => 实现点击进入二级
    const areaGraphs = useMemo(() => {
        if(svgContWH[0] > 0) {
            // area width
            const normalizedWidth = arrNormalization(dynastyInterval);
            // console.log("test-print-normalizedWidth", normalizedWidth);

            // area height
            const scoreArr = [];
            dynastyInterval.forEach(_ => scoreArr.push([]));
            clipScoreOverview.forEach((v, idx) => scoreArr[dynastyLabel[idx]].push(v));
            // console.log("test-print-scoreArr", scoreArr);

            // max决定整体高度 => 变成数量            
            const scoreMaxArr = [];
            const scoreMinArr = [];
            scoreArr.forEach((arr) => {
                scoreMaxArr.push(Math.max(...arr));
                scoreMinArr.push(Math.min(...arr));
            });
            // const normalizedHeight = arrMaxNormalization(scoreMaxArr);
            // const normalziedHeightScale = normalizedHeight.map(v => {
            //     const scaleV = Math.sqrt(v);
            //     return 0.1 + 0.9 * scaleV
            // });

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
                    // console.log("colorIndex", colorIndex)

                    const wrongClusterId = clusterLabels[colorIndex];
                    let clusterID = -1;
                    for(let k = 0; k < clusterNum.length; k++) {
                        if(clusterNum[k][0] === wrongClusterId) {
                            clusterID = k;
                            break;
                        }
                    }
                    
                    const clusterIsHidden = hiddenBars.indexOf(clusterID);
                    if(clusterIsHidden === -1) { // cluster没有hidden
                        // console.log("test-print-01", idx, clusterID)
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

            // console.log("back-end-currentImages: ", currentImages)

            const maxNum = 32; // 召回结果中统计各朝代的数量
            const normalziedHeightScale = heightArr.map((v) => 0.2 + 0.8 * (v / maxNum));
            // console.log("test-print-normalziedHeightScale", hiddenDetailBars, heightArr, normalziedHeightScale, clusterMember);

            // 四分位分数
            const quartileScore = [];
            scoreArr.forEach((arr, idx) => {
                const maxScore = scoreMaxArr[idx];
                // const arrSort = arr.sort((a, b) => b - a);
                // const index34 = Math.floor(arrSort.length / 4);
                // const index14 = Math.floor(3 * arrSort.length / 4);
                // const score34 = arrSort[index34];
                // const score14 = arrSort[index14];
                // quartileScore.push([score14 / maxScore, score34 / maxScore])

                quartileScore.push([scoreMinArr[idx], maxScore])
                // quartileScore.push([1, 0])
            })
            // console.log("test-print-quartileScore", quartileScore);

            // {
            // // // 来啦 请叫我hardcode之神 => 为每个子bin画一条area
            // // const targetBins = [6190]; // [6190, 5769, 4990, 5389]
            // // const areaDynasty = []
            // // dynastyInterval.forEach(_ => areaDynasty.push([]));
            // // for(let i = 0; i < targetBins.length; i++) {
            // //     for(let k = 0; k < areaDynasty.length; k++) {
            // //             areaDynasty[k].push(0);
            // //             const currentDynastyColors = []
            // //             for(let m = 0; m < colorBinData.length; m++) {
            // //                 if(dynastyLabel[m] === k) {
            // //                     currentDynastyColors.push(colorBinData[m].overview);
            // //                 }
            // //             }

            // //             for(let m = 0; m < currentDynastyColors.length; m++) {
            // //                 const normalizedColors = listNormalization(currentDynastyColors[m]);
            // //                 for(let n = 0; n < normalizedColors.length; n++) {
            // //                     const colorBinIndex = normalizedColors[n][0];

            // //                     if(colorBinIndex === targetBins[i]) {
            // //                         areaDynasty[k][i] += normalizedColors[n][1];
            // //                     }
            // //                 }
            // //             }
            // //     }
            // // }

            // // for(let i = 0; i < areaDynasty.length; i++) {
            // //     if(areaDynasty[i].length === 1 && areaDynasty[i][0] === 0) areaDynasty[i] = [0]
            // //     else areaDynasty[i] = arrNormalization(areaDynasty[i]);
            // // }

            // // const areaGraphs = [];
            // // const areaGraphHeights = [];
            // // const width = svgContWH[0];
            // // const baseHeight = 1; // 无数据的Area的基础宽度
            // // const height = svgContWH[1];
            // // let xPos = 0;
            // // const dynastyX = normalizedWidth.map(v => {
            // //     const x = xPos + 0.5 * v * width;
            // //     xPos += v * width;
            // //     return x
            // // });
            // // normalizedWidth.forEach(_ => areaGraphHeights.push(height));

            // // // mountain metaphor
            // // for(let k = 0; k < targetBins.length; k++) {
            // //     const areas = []
            // //     for(let i = 0; i < areaDynasty.length; i++) {
            // //         if(selectedDynasty.indexOf(i) !== -1) continue

            // //         const intervalWidth = normalizedWidth[i] * width * 0.5;
            // //         const xStart = dynastyX[i] - intervalWidth;
            // //         const xEnd = xStart + intervalWidth * 2;
                    
            // //         const height2 = height - k * baseHeight;
            // //         let path = `M ${xStart} ${height2}`;
            // //         const yGap = normalziedHeightScale[i] * areaDynasty[i][k] * height;
            // //         const y = areaGraphHeights[i] - yGap;

            // //         // good
            // //         const height1 = height - (k + 1) * baseHeight;
            // //         path += `L ${xStart} ${height1}`;
            // //         path += `C ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${y}, ${dynastyX[i]} ${y}`;
            // //         path += `C ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${y}, ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height1}, ${xEnd} ${height1}`;
                    
            // //         path += `L ${xEnd} ${height2}`;
            // //         path += `C ${xEnd - (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${dynastyX[i] + quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${dynastyX[i]} ${areaGraphHeights[i]}`;
            // //         path += `C ${dynastyX[i] - quartileScore[i][1] * intervalWidth} ${areaGraphHeights[i]}, ${xStart + (1 - quartileScore[i][0]) * intervalWidth} ${height2}, ${xStart} ${height2} Z`;

            // //         areaGraphHeights[i] -= yGap;

            // //         const areaColor = colorPalette[targetBins[k]];
            // //         console.log("test-print-areaColor", areaColor)
            // //         areas.push(<path d={path} fill={`rgb(${areaColor[0]},${areaColor[1]},${areaColor[2]})`} key={`path-${i}-${k}`} />)
            // //     }
            // //     areaGraphs.push(
            // //         <g key={`area-${k}`} style={{cursor: "pointer"}}>
            // //             {areas}
            // //         </g>
            // //     )
            // // }

            // // return areaGraphs
            // }


            if(selectedArea === -1) {
                // area ratio - 每个朝代单独统计
                const inputBinColors = [];
                const binNum = 16;
                for(let i = 0; i < binNum; i++) {
                    if(hiddenBars.indexOf(i) === -1) inputBinColors.push(i); // 只是overview状态
                }
                // console.log("test-print-inputBinColors", inputBinColors)

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

                    // if(i === 0) console.log("test-print-areaBins", areaBins, colorBinData.length) // 存的是colorBinOverviewData中的index
                    // console.log("test-print-areaBins", areaBins); 

                    for(let k = 0; k < areaDynasty.length; k++) {
                        areaDynasty[k].push(0);
                        const currentDynastyColors = []
                        for(let m = 0; m < colorBinData.length; m++) { // colorBinData.length是画的数量 => 109
                            if(dynastyLabel[m] === k) {
                                currentDynastyColors.push(colorBinData[m].overview);
                            }
                        }
                        // console.log("test-print-currentDynastyColors", currentDynastyColors)

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

                // console.log("test-print-areaDynasty", inputBinColors, JSON.parse(JSON.stringify(areaDynasty)));

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

                // console.log("test-print-all", clusterNum, inputBinColors, areaDynasty)

                // mountain metaphor
                for(let k = 0; k < inputBinColors.length; k++) {
                    const areas = []
                    for(let i = 0; i < areaDynasty.length; i++) {
                        if(selectedDynasty.indexOf(i) !== -1) continue

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
                console.log("test-print-selectedArea", selectedArea)

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

                        console.log("test-print-areaDynastyDetail-01", JSON.parse(JSON.stringify(areaDynastyDetail)));

                        for(let i = 0; i < areaDynastyDetail.length; i++) {
                            if(areaDynastyDetail[i].length === 1 && areaDynastyDetail[i][0] === 0) areaDynastyDetail[i] = [0]
                            areaDynastyDetail[i] = arrNormalization(areaDynastyDetail[i]);
                        }

                        console.log("test-print-areaDynastyDetail", areaDynastyDetail);
                    }
                }

                // combine areaDynasty and areaDynastyDetail
                for(let i = 0; i < areaDynasty.length; i++) {
                    // areaDynasty[i] = arrNormalization(areaDynasty[i]);
                    if(areaDynasty[i].length === 1 && areaDynasty[i][0] === 0) areaDynasty[i] = [0]
                    else areaDynasty[i] = arrNormalization(areaDynasty[i]);
                }

                // for(let i = 0; i < areaDynastyDetail.length; i++) {
                //     // areaDynastyDetail[i] = arrNormalization(areaDynastyDetail[i]);
                //     if(areaDynastyDetail[i].length === 1 && areaDynastyDetail[i][0] === 0) areaDynastyDetail[i] = [0]
                //     else areaDynastyDetail[i] = arrNormalization(areaDynastyDetail[i]);
                // }

                // console.log("test-print-areaDynasty", areaDynasty);
                // console.log("test-print-areaDynastyDetail", areaDynastyDetail);

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
                            if(selectedDynasty.indexOf(i) !== -1) continue
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
                                    if(selectedDynasty.indexOf(i) !== -1) continue
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
        selectedDynasty
    ])

    // dynastyButton
    const dynastyButtons = useMemo(() => {
        const normalizedWidth = arrNormalization(dynastyInterval);
        return normalizedWidth.map((v, idx) => {
            const backColor = selectedDynasty.length === 0 ? "#b5996f" : (selectedDynasty.indexOf(idx) !== -1 ? "#b5996f" : "rgba(181,153,111,0.5)")
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
                                    else selectedDynasty(idx)
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
                                    const index = selectedDynasty.indexOf(idx);
                                    if(index === -1) selectedDynasty.push(idx)
                                    else selectedDynasty.splice(index, 1)
                                    setSelectedDynasty(JSON.parse(JSON.stringify(selectedDynasty)))
                                }}
                            >
                                <span>{dynastyNames[idx]}</span>
                            </div>
                    }
            </div>
        })
    }, [svgContWH, selectedDynasty])

    const scatterplot = useMemo(() => {
        const scatterPlot = [];
        const plotBorder = 6;
        const paintingIndex = [[77, 109]] // ming
        if(selectedDynasty.length > 0 && svgContWH[0] > 0) {
            const normalizedWidth = arrNormalization(dynastyInterval);
            for(let i = 0; i < selectedDynasty.length; i++) {
                let startX = 0;
                for(let j = 0; j < selectedDynasty[i]; j++) {
                    startX += normalizedWidth[j];
                }

                const startPx = startX * svgContWH[0] + plotBorder / 2;
                const startPy = plotBorder / 2;
                const rectWidth = normalizedWidth[selectedDynasty[i]] * svgContWH[0] - plotBorder;
                const rectHeight = svgContWH[1] - plotBorder;

                const padding = 30;
                const subRectStartX = startPx + padding / 2;
                const subRectStartY = startPy + padding / 2;
                const subRectWidth = rectWidth - padding;
                const subRectHeight = rectHeight - padding;
                const rectSize = 15;
                const rectPadding = 1;
                const querynum = 3;
                const opacityScale = 30;
                const singleRectHeight = rectSize / querynum; // 三个查询
                const scatters = case2MingScatters[i].map((pos, idx) => { // 变成三个rect好了
                    const rStartX = subRectStartX + pos[0] * subRectWidth - rectSize / 2;
                    const rStartY = subRectStartY + pos[1] * subRectHeight - rectSize / 2 - ((querynum - 1) / 2) * rectPadding;

                    return <g key={`rect-group-${selectedDynasty[i]}-${idx}`} onClick={() => console.log("print-click-painting", paintingIndex[i][0] + idx + 1)} style={{cursor: "pointer"}}>
                        <rect x={rStartX} y={rStartY} width={rectSize} height={singleRectHeight} fill={`rgba(181,153,111,${(clipScoreDetail[0][paintingIndex[i][0] + idx] * opacityScale) * 0.8 + 0.2})`} stroke={"none"} rx={1} ry={1}/>
                        <rect x={rStartX} y={rStartY + singleRectHeight + rectPadding} width={rectSize} height={singleRectHeight} fill={`rgba(181,153,111,${(clipScoreDetail[1][paintingIndex[i][0] + idx] * opacityScale) * 0.8 + 0.2})`} stroke={"none"} rx={1} ry={1}/>
                        <rect x={rStartX} y={rStartY + (singleRectHeight + rectPadding) * 2} width={rectSize} height={singleRectHeight} fill={`rgba(181,153,111,${(clipScoreDetail[2][paintingIndex[i][0] + idx] * opacityScale) * 0.8 + 0.2})`} stroke={"none"} rx={1} ry={1}/>
                    </g>

                    // return <circle 
                    //     key={`scatter-${selectedDynasty[i]}-${idx}`} 
                    //     cx={startPx + padding / 2 + (rectWidth - padding) * pos[0]}
                    //     cy={startPy + padding / 2 + (rectHeight - padding) * pos[1]}
                    //     fill={"#b5996f"}
                    //     r={10}
                    // >

                    // </circle>
                })

                scatterPlot.push(
                    <g key={`scatter-plot-${selectedDynasty[i]}`}>
                        <rect x={startPx} y={startPy} width={rectWidth} height={rectHeight} stroke={"#b5996f"} strokeWidth={plotBorder} rx={8} ry={8} fill={"none"} />
                        {scatters}
                    </g>
                )
            }
        }
        return scatterPlot
    }, [svgContWH, selectedDynasty, clipScoreDetail])

    // console.log("test-print-scatterplot", scatterplot.length)

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
                        {scatterplot}
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
