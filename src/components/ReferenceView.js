import "./ReferenceView.css";
import case2Color1 from "../images/case2/heatmap/c-1.jpg";
import case2Origin1 from "../images/case2/heatmap/o-1.jpg";

import case2Color2 from "../images/case2/heatmap/c-2.jpg";
import case2Origin2 from "../images/case2/heatmap/o-2.jpg";

import case2Color3 from "../images/case2/heatmap/c-3.jpg";
import case2Origin3 from "../images/case2/heatmap/o-3.jpg";

import case2Color4 from "../images/case2/heatmap/c-4.jpg";
import case2Origin4 from "../images/case2/heatmap/o-4.jpg";

import case2Color5 from "../images/case2/heatmap/c-5.jpg";
import case2Origin5 from "../images/case2/heatmap/o-5.jpg";

import case2Color6 from "../images/case2/heatmap/c-6.jpg";
import case2Origin6 from "../images/case2/heatmap/o-6.jpg";

import case2Color7 from "../images/case2/heatmap/c-7.jpg";
import case2Origin7 from "../images/case2/heatmap/o-7.jpg";

import case2Color8 from "../images/case2/heatmap/c-8.jpg";
import case2Origin8 from "../images/case2/heatmap/o-8.jpg";

import case2Color9 from "../images/case2/heatmap/c-9.jpg";
import case2Origin9 from "../images/case2/heatmap/o-9.jpg";

import case2Color10 from "../images/case2/heatmap/c-10.jpg";
import case2Origin10 from "../images/case2/heatmap/o-10.jpg";

import backendData from "../json/backend.json"

import { useMemo, useState } from "react";
import { arrMaxNormalization } from "./utils";

const referenceImages = [
    [case2Color1, case2Origin1],
    [case2Color2, case2Origin2],
    [case2Color3, case2Origin3],
    [case2Color4, case2Origin4],
    [case2Color5, case2Origin5],
    // [case2Color6, case2Origin6],
    [case2Color7, case2Origin7],
    // [case2Color8, case2Origin8],
    // [case2Color9, case2Origin9],
    // [case2Color10, case2Origin10],
]

const referenceImageIndexes = [94, 98, 66, 2, 93, 95]

export const ReferenceView = ({

}) => {

    const clipScoreData = backendData.text_scores;
    const clipScoreOverview = arrMaxNormalization(clipScoreData.ideorealm);

    // console.log("test-print-clipScoreOverview", clipScoreOverview)

    const [currentDetail, setCurrentDetial] = useState(-1);

    const referenceItems = useMemo(() => {
        return referenceImages.map((images, idx) => {
            const backgroundColor = idx === currentDetail ? "#594d3a" : "#fff6dc";
            const fontColor = idx === currentDetail ? "#fff6dc" : "#594d3a";
            return <div className="Reference-image-item" key={`reference-image-${idx}`}>
                <div className="Reference-list-index-content"
                    style={{
                        backgroundColor: backgroundColor,
                        color: fontColor,
                    }}
                >
                    <div className="Reference-index-div" onClick={() => {
                        if(idx === currentDetail) {
                            setCurrentDetial(-1);
                        } else {
                            setCurrentDetial(idx);
                        }
                    }}>
                        <span>{`[${idx}]`}</span>
                    </div>
                </div>
                <div className="Reference-list-score-content"
                    style={{
                        backgroundColor: backgroundColor,
                        color: fontColor,
                    }}
                >
                    <span>{`${clipScoreOverview[referenceImageIndexes[idx]].toFixed(3)}`}</span>
                </div>
                <div className="Reference-list-origin-content"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                >
                    <img className="Reference-image"
                        src={images[1]}
                        alt={""}
                    />
                </div>
                <div className="Reference-list-heatmap-content"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                >
                    <img className="Reference-image"
                        src={images[0]}
                        alt={""}
                    />
                </div>
            </div>
        })
    }, [clipScoreOverview, currentDetail])

    return <div className="ReferenceView-container">
        <div className="ReferenceView-content">
            <div className="Reference-canvas">
                <div className="Reference-title">
                    <span>Reference Window</span>
                </div>
                <div className="Reference-canvas-container">
                    <img
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                        src={referenceImages[currentDetail][1]}
                        alt={""}
                    />
                </div>
            </div>
            <div className="Reference-list">
                <div className="Reference-title" style={{borderRadius: "4px"}}>
                    <span>Reference Image List</span>
                </div>
                <div className="Reference-list-container">
                    <div className="Reference-list-title">
                        <div className="Reference-list-index-title">
                            <span>Index</span>
                        </div>
                        <div className="Reference-list-score-title">
                            <span>Score</span>
                        </div>
                        <div className="Reference-list-origin-title">
                            <span>Original Painting</span>
                        </div>
                        <div className="Reference-list-heatmap-title">
                            <span>Ideorealm Analysis</span>
                        </div>
                    </div>
                    <div className="Reference-list-content">
                        {referenceItems}
                    </div>
                </div>
            </div>
        </div>
    </div>
}