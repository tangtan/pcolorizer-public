import { useEffect, useMemo, useState } from "react";
import "./TimelineView.css"
import { RGB216, listMaxNormalization, listNormalization } from "./utils";
import color_bins from "../json/backend_color.json"
import color_palette from "../json/color_palette.json"
import { StreamGraph } from "./StreamGraph";

const clusterLabels = [
   5, 5, 5, 12, 0, 
   5, 0, 2, 0, 12, 
   2, 15, 11, 10, 2, 
   15, 15, 2, 0, 9, 
   0, 0, 9, 2, 2, 
   0, 14, 12, 7, 2, 
   13, 9, 2, 4, 9, 
   14, 9, 9, 13, 14, 
   8, 9, 2, 4, 10, 
   9, 6, 10, 14, 1, 
   14, 11, 11, 6, 6, 
   4, 14, 6, 13, 9, 
   10, 4, 11, 4, 14, 
   13, 13, 8, 7, 10, 
   5, 4, 4, 8, 5, 
   7, 1, 15, 15, 13, 
   14, 2, 14, 7, 6, 
   1, 0, 10, 3, 5, 
   7, 0, 12, 14, 6, 
   1, 1, 8, 4, 2, 
   3, 5, 11, 7, 12, 
   13, 8, 7, 12, 5, 
   6, 0, 9, 10, 4, 
   6, 8, 15, 6, 15, 
   15, 11, 7, 3, 7, 
   15, 1, 0, 10, 8, 
   11, 3, 1, 8, 13, 
   4, 3, 9, 6, 1, 
   1, 6, 15, 1, 8, 
   15, 1, 9, 8, 13, 
   10, 2, 1, 13, 11, 
   8, 1, 5, 3, 
]

const clusterCenterRGB = [[150, 155, 146], [113, 46, 17], [70, 71, 47], [21, 19, 13], [209, 159, 62], [146, 87, 72], [39, 76, 95], [180, 104, 31], [53, 38, 15], [234, 212, 164], [70, 107, 121], [99, 99, 35], [208, 126, 82], [148, 74, 24], [43, 44, 42], [86, 129, 82]]

export const TimelineView = ({
    // colorBinData,
}) => {
    const colorBinData = color_bins.color_bins;
    const colorPalette = color_palette.color_palette;

    // console.log("test-print-colorBinData", colorBinData);
    // console.log("test-print-colorPalette", colorPalette);

    // 统计总体颜色分布
    const colorBinOverviewData = useMemo(() => {
        const colorBinOverviewData = [];
        for(let i = 0; i < colorBinData.length; i++) {
            const singleImage = listNormalization(colorBinData[i].overview);
            // const singleImage = colorBinData[i].overview;
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

        const normalizedDatawithn1 = (listMaxNormalization(colorBinOverviewData)).sort((a, b) => b[1] - a[1]);
        const normalizedData = [];
        normalizedDatawithn1.forEach((v) => {
            // bug: v[0]会等于-1
            if(v[0] === -1) return null

            // 有些bin的颜色在RGB空间下是一样的 => 合并
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
            if(!isContained) normalizedData.push([v[0], v[1], tempColorRGB])
        })

        // console.log("test-print-normalizedData", normalizedData) // len: 159

        // const color_bins = [];
        // for(let i = 80; i < normalizedData.length; i++) {
        //     color_bins.push(normalizedData[i][0])
        // }
        // console.log("color_bins: ", color_bins)

        return normalizedData;
    }, [colorBinData, colorPalette])

    // console.log("test-print-colorBinOverviewData", colorBinOverviewData);

    const {colorOverviewBars, clusterMember, clusterNum} = useMemo(() => {
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

        // console.log("clusterNum: ", clusterNum);
        const barHeight = 10;
        const overviewBars = clusterNum.map((n, idx) => {
            const barColor = clusterCenterRGB[n[0]];
            return <div
                key={`overview-bar-${idx}`}
                style={{
                    width: "100%",
                    height: `${barHeight * n[2]}px`,
                    background: RGB216(`rgb(${barColor[0]},${barColor[1]},${barColor[2]})`)
                }}
            />
        })
        return {
            colorOverviewBars: overviewBars,
            clusterMember: clusterMember,
            clusterNum: clusterNum
        }
    }, [colorBinOverviewData, clusterCenterRGB, clusterLabels])

    // console.log("test-print-clusterMember", clusterMember)

    const colorDetailBars = useMemo(() => {
        const colorDetailBars = [];
        for(let i = 0; i < clusterNum.length; i++) {
            const binIndexes = clusterMember[clusterNum[i][0]];
            const binData = [];
            binIndexes.forEach((v) => binData.push(colorBinOverviewData[v]));
            binData.sort((a, b) => b[1] - a[1]);
            // console.log("test-print", binData)
            const singleDetailBars = binData.map((v) => {
                return <div 
                    className="Color-bars" 
                    key={`color-bar-${v[0]}`}
                    style={{
                        width: `${20 + Math.sqrt(v[1]) * 80}%`, // 1 - 30000 = [20 - 100]%
                        background: v[2]
                    }} 
                />
            })
            colorDetailBars.push(
                <div className="Color-bars-container" key={`detail-${i}`}>
                    {singleDetailBars}
                </div>
            )
        }

        return colorDetailBars
    }, [colorBinOverviewData, colorPalette, clusterMember, clusterNum])


    const [currentArea, setCurrentArea] = useState([4, 7, 11, 12]); // 这个顺序是clusterNum而不是clusterMember [2, 4, 6, 7, 8, 12]
    const {inputBinMembers, inputBinColors} = useMemo(() => {
        const binMembers = [];
        const binColors = [];
        if(clusterMember.length > 0) {
            currentArea.forEach((v) => {
                const memberIndexes = clusterMember[clusterNum[v][0]];
                const members = memberIndexes.map((v) => colorBinOverviewData[v][0])
                binMembers.push(members);
                binColors.push(clusterCenterRGB[clusterNum[v][0]]);
            });
        }

        // console.log("test-print-binColors", binColors)

        return {
            inputBinMembers: binMembers, 
            inputBinColors: binColors,
        }
    }, [currentArea, clusterMember, clusterNum, clusterCenterRGB, colorBinOverviewData])

    return <div className="Timeline">
        <div className="Timeline-colorFilter">
            <div className="Timeline-colorFilter-Overview">
                {colorOverviewBars}
            </div>
            <div className="Timeline-colorFilter-Detail">
                {colorDetailBars}
            </div>
        </div>
        <div className="Timeline-streamGraph">
            <StreamGraph 
                colorBinData={colorBinData}
                colorPalette={colorPalette}
                inputBinMembers={inputBinMembers}
                inputBinColors={inputBinColors}
            />
        </div>
    </div>
}
