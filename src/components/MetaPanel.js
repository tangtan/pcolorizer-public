import { useMemo, useState } from "react";
import "./MetaPanel.css";
import OpenCloseSVG from "../icons/open_close.svg";
import FilterTextSVG from "../icons/text.svg";
import SearchSVG from "../icons/search.svg";
import AddQuerySVG from "../icons/add.svg";
import case2Imagery1 from "../images/case2/imagery1.jpg";
import case2Imagery2 from "../images/case2/imagery2.jpg";

// "山势舒坦静若盼，矾头云卷烟霞间。树木葱茏争荫浓，江畔风吹枝叶飘。灯笼树梢点缀处，彩旗飘扬两舟前。欢笑数十人岸边，歌舞共和祥气鲜。路旁行人观美景，画中奇景在眼前。春雨沐草滋今生，盼龙喜兆降瑞年。"
const poem = [
    "山势舒坦静若盼，",
    "矾头云卷烟霞间。",
    "树木葱茏争荫浓，",
    "江畔风吹枝叶飘。",
    "灯笼树梢点缀处，",
    "彩旗飘扬两舟前。",
    "春雨沐草滋人生，",
    "祥龙喜兆降瑞年。"
]

export const MetaPanel = ({
    iconSize,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSelectText, setIsSelectText] = useState(false);
    const [selectedText, setSelectedText] = useState([[], [], [], [], [], [], [], [], [], [], [], []]); // hard code

    const textDivs = useMemo(() => {
        const textDivs = [];
        poem.forEach((sen, idx) => {
            const characterDivs = [];
            for(let i = 0; i < sen.length; i++) {
                // console.log("test-print", selectedText)
                const index = selectedText[idx].indexOf(i);
                characterDivs.push(
                    <div 
                        className="Character-container" 
                        key={`character-${idx}-${i}`}
                        style={{
                            marginLeft: `${i !== 0 ? 4 : 0}px`,
                            backgroundColor: index === -1 ? "#fff6dc" : "#5a4e3b",
                            color: index === -1 ? "#5a4e3b" : "#fff6dc"
                        }}
                        onClick={() => {
                            if(isSelectText) {
                                if(index === -1) {
                                    selectedText[idx].push(i);
                                } else {
                                    selectedText[idx].splice(index, 1);
                                }
                                setSelectedText(JSON.parse(JSON.stringify(selectedText)));
                            }
                        }}
                    >
                        {sen[i]}
                    </div>
                )
            }
            textDivs.push(
                <div className="Character-lines" key={`character-${idx}`}>
                    {characterDivs}
                </div>
            )
        })
        return textDivs
    }, [isSelectText, selectedText])

    const [queryList, setQueryList] = useState([
        {
            image: case2Imagery1,
            text: ["山势舒坦静若盼，", "矾头云卷烟霞间。"],
        },
        {
            image: case2Imagery2,
            text: ["树木葱茏争荫浓，",  "江畔风吹枝叶飘。"],
        }
    ])

    const queryItems = useMemo(() => {
        return queryList.map((item, idx) => {
            const textContent = item.text;
            const textSpans = textContent.map((t, idx) =>
                <div key={`query-span-${idx}`} className="Query-text">
                    <div>{t}</div>
                </div>
            )

            return <div key={`query-item-${idx}`}
                className="Query-list-content"
            >
                <div className="Query-index-content">
                    <span>{`[${idx}]`}</span>
                </div>
                <div className="Query-image-content">
                    {
                        item.image !== "" && 
                        <img className="Query-image"
                            src={item.image}
                            alt={""}
                        />
                    }
                </div>
                <div className="Query-text-content">
                    <div className="Query-text-content-container">
                        {textSpans}
                    </div>
                </div>
            </div>
        })
    }, [queryList])

    return <div className="MetaPanel-container">
        <div className={isOpen ? "Incident-vertical" : "Incident-vertical-hidden"} onClick={() => setIsOpen(!isOpen)}>
            <div
                style={{
                    background: `url(${OpenCloseSVG}) no-repeat`,
                    backgroundSize: 'contain',
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    transform: isOpen ? "rotateY(180deg)" : "",
                    cursor: "pointer"
                }}
            />
        </div>
        <div className={isOpen ? "Incident-vertical-content" : "Incident-vertical-content-hidden"}>
            <div className="Poem-container">
                <div className="Poem-navigator">
                    <div className="Poem-title-container">
                        {isOpen && <span style={{marginLeft: "6px"}}>Poem:</span>}
                    </div>
                    {
                        isOpen && <div
                            style={{
                                marginLeft: "4px",
                                background: `url(${FilterTextSVG}) no-repeat`,
                                backgroundSize: 'contain',
                                backgroundColor: isSelectText ? "#fff6dc" : "#b09872",
                                width: `${iconSize + 4}px`,
                                height: `${iconSize + 4}px`,
                                border: "2px solid #594d3a",
                                borderRadius: "4px",
                                boxSizing: "border-box",
                                cursor: "pointer"
                            }}
                            onClick={() => setIsSelectText(!isSelectText)}
                        />
                    }
                </div>
                <div className="Poem-content-container">
                    {textDivs}
                </div>
            </div>
            <div className="Query-container">
                <div className="Poem-navigator">
                    <div className="Poem-title-container">
                        {isOpen && <span style={{marginLeft: "6px"}}>Query:</span>}
                    </div>
                    {
                        isOpen && <div
                            style={{
                                marginLeft: "4px",
                                background: `url(${SearchSVG}) no-repeat`,
                                backgroundSize: 'contain',
                                backgroundColor: "#b09872",
                                width: `${iconSize + 4}px`,
                                height: `${iconSize + 4}px`,
                                border: "2px solid #594d3a",
                                borderRadius: "4px",
                                boxSizing: "border-box",
                                cursor: "pointer"
                            }}
                        />
                    }
                </div>
                <div className="Query-list-container">
                    <div className="Query-list-title">
                        <div className="Query-index-title">
                            {isOpen && <span>Index</span>}
                        </div>
                        <div className="Query-image-title">
                            {isOpen && <span>Painting Content</span>}
                        </div>
                        <div className="Query-text-title">
                            {isOpen && <span>Poem Content</span>}
                        </div>
                    </div>
                    <div style={{width: "100%"}}>
                        {isOpen && queryItems}
                    </div>
                </div>
                <div className="Query-add-button" >
                    {
                        isOpen && <div
                            style={{
                                background: `url(${AddQuerySVG}) no-repeat`,
                                backgroundSize: 'contain',
                                width: `${iconSize + 4}px`,
                                height: `${iconSize + 4}px`,
                            }}
                            onClick={() => {
                                queryList.push({
                                    image: "",
                                    text: []
                                })
                                setQueryList(JSON.parse(JSON.stringify(queryList)));
                            }}
                        />
                    }
                </div>
            </div>
            <div className="Meta-container">
                <div className="Query-title-container">
                    {isOpen && <span style={{marginLeft: "6px"}}>Meta:</span>}
                </div>
            </div>
        </div>
    </div>
}