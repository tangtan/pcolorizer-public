import "./ReferenceView.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { adaptWH } from "./utils";
import { ExemplarBasedColorization } from "../api";

const imageTtiles = [
    ["顾恺之", "洛神赋图"],
    ["展子虔", "游春图"],
    ["李思训", "江帆楼阁图"],
    ["李思训", "九成避暑图"],
    ["李思训", "京畿瑞雪图"],
    ["李昭道", "春山行旅图"],
    ["李昭道", "明皇幸蜀图"],
    ["王维", "雪溪图"],
    ["王维", "辋川图"],
    ["孙位", "高逸图"],
    ["佚名", "宫苑图"],
    ["王维", "长江积雪图"],
    ["卢鸿", "草堂十志图（一）"],
    ["卢鸿", "草堂十志图（二）"],
    ["卢鸿", "草堂十志图（三）"],
    ["卢鸿", "草堂十志图（四）"],
    ["佚名", "春郊游骑图"],
    ["董源", "溪岸图"],
    ["董源", "夏景山口待渡图"],
    ["董源", "夏山图"],
    ["董源", "潇湘图"],
    ["董源", "平林霁色图卷"],
    ["荆浩", "匡庐图"],
    ["荆浩", "雪景山水图"],
    ["关仝", "关山行旅图"],
    ["关仝", "秋山晚翠图"],
    ["巨然", "万壑松风图"],
    ["巨然", "秋山问道图"],
    ["巨然", "萧翼赚兰亭图"],
    ["董源", "龙郊宿民图"],
    ["卫贤", "高士图"],
    ["佚名", "丹枫呦鹿图"],
    ["佚名", "秋林群鹿图"],
    ["赵嵒", "八达春游图"],
    ["王希孟", "千里江山图"],
    ["燕文贵", "溪山楼观图"],
    ["燕文贵", "江山楼观图"],
    ["许道宁", "关山密雪图"],
    ["许道宁", "渔父图"],
    ["郭熙", "早春图"],
    ["李成", "晴峦萧寺图"],
    ["佚名", "朱云折榄图"],
    ["佚名", "荷亭婴戏图"],
    ["马远", "雕台望云图"],
    ["佚名", "仙山楼阁图"],
    ["赵大亨", "薇省黄昏图"],
    ["赵伯驹", "江山秋色图"],
    ["赵伯啸", "万松金阙图"],
    ["赵伯驹", "汉宫春晓图"],
    ["赵伯驹", "春山云隐图"],
    ["赵伯驹", "莲舟新月图"],
    ["赵士雷", "湘乡小景图"],
    ["赵雍", "江堤晚景图"],
    ["赵孟頫", "洞庭东山图"],
    ["赵孟頫", "茅亭松籁图"],
    ["赵孟頫", "重江叠嶂图"],
    ["赵孟頫", "春山闲眺图"],
    ["赵孟頫", "水村图"],
    ["赵孟頫", "秋山仙奕图"],
    ["赵孟頫", "江村渔乐图"],
    ["黄公望", "九珠峰翠图"],
    ["黄公望", "富春山居图"],
    ["王蒙", "溪山风雨图"],
    ["王蒙", "葛稚川移居图"],
    ["王蒙", "花溪渔隐图之三"],
    ["王蒙", "太白山图"],
    ["王蒙", "长江万里图"],
    ["倪瓒", "倪瓒王蒙合作山水图"],
    ["倪瓒", "水竹居图"],
    ["吴镇", "洞庭渔隐图"],
    ["吴镇", "山窗听雨图"],
    ["吴镇", "清江春晓图"],
    ["吴镇", "秋江渔隐图"],
    ["商琦", "春山图"],
    ["钱选", "浮玉山居图"],
    ["钱选", "山居图"],
    ["钱选", "秋江待渡图"],
    ["唐寅", "秋山高士图"],
    ["唐寅", "事茗图"],
    ["文徵明", "曲港归舟图"],
    ["沈周", "京江送别图"],
    ["沈周", "柳荫坐钓图"],
    ["沈周", "仿黄公望富春山居图"],
    ["董其昌", "林和靖诗意图"],
    ["沈周", "落花诗意图"],
    ["朱端", "烟江远眺图"],
    ["朱端", "松院闲吟图"],
    ["仇英", "桃村草堂图"],
    ["仇英", "玉洞仙源图"],
    ["仇英", "莲溪渔隐图"],
    ["仇英", "归汾图"],
    ["仇英", "春山吟赏图"],
    ["仇英", "上林赋图"],
    ["仇英", "桃源仙境图"],
    ["仇英", "浔阳送别图"],
    ["仇英", "枫溪垂钓图"],
    ["仇英", "桃花源图"],
    ["仇英", "秋江待渡图"],
    ["仇英", "清明上河图"],
    ["周臣", "辟纑图"],
    ["周臣", "春山游骑图"],
    ["周臣", "春泉小隐图"],
    ["周臣", "松窗对奕图"],
    ["周臣", "水亭清兴图"],
    ["周臣", "北溟图"],
    ["周臣", "春泉小隐图"],
    ["仇英", "玉洞仙源图"],
    ["董其昌", "关山雪霁图"],
    ["董其昌", "昼锦堂图"],
    ["王鉴", "溪山仙馆图"],
    ["王鉴", "仿大痴山水图"],
    ["王鉴", "仿黄子久山水图"],
    ["王鉴", "溪山深秀图 "],
    ["王鉴", "仿黄公望烟浮远岫图"],
    ["王鉴", "远山岗峦图"],
    ["王鉴", "仿黄公望山水图"],
    ["王鉴", "秋山图"],
    ["王翚", "长江万里图"],
    ["王翚", "仿赵大年水村图"],
    ["王翚", "唐寅诗意图立轴"],
    ["王时敏", "西庐画跋"],
    ["王时敏", "南山积翠图"],
    ["王时敏", "松风叠嶂图"],
    ["王时敏", "仿王维江山雪霁轴"],
    ["王时敏", "秋山白云图轴"],
    ["王原祁", "富春山居图轴"],
    ["王原祁", "卢鸿草堂十志图册"],
    ["王原祁", "祁春云出岫图"],
    ["王原祁", "昌黎诗意图轴"],
    ["董邦达", "层峦耸翠图"],
    ["董邦达", "灞桥觅句图"],
    ["董邦达", "江关行旅轴"],
    ["董邦达", "浮岚暖翠图"],
    ["董邦达", "仙庐澄霁轴"],
    ["杨晋", "唐解元诗意图"],
    ["石涛", "对菊图轴"],
    ["石涛", "山水清音图"],
    ["萧晨", "桃源图"],
    ["查士标", "空山结屋图轴"],
]

export const DemoReferenceView = ({
    referenceImages,
    changeColorizedVersions
}) => {
    const [currentDetail, setCurrentDetial] = useState(-1);

    const canvasRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState([0, 0]);
    useEffect(() => {
        setCanvasSize([
            canvasRef.current?.clientWidth || 0,
            canvasRef.current?.clientHeight || 0
        ]);
    }, [canvasRef])

    const [currentWH, setCurrentWH] = useState([0, 0]);
    const [moveVector, setMoveVector] = useState([0, 0]);

    useEffect(() => {
        if(currentDetail !== -1 && canvasSize[0] > 0) {
            const inputImage = new Image();
            inputImage.src = `database/${referenceImages[currentDetail] + 1}.jpg`;
            inputImage.onload = () => {
                const tagSize = adaptWH([inputImage.width, inputImage.height], canvasSize);
                const left = (canvasSize[0] - tagSize[0]) / 2;
                const top = (canvasSize[1] - tagSize[1]) / 2;
                setCurrentWH(tagSize);
                setMoveVector([left, top])
            }
        }
    }, [currentDetail, referenceImages, canvasSize])


    const displayImages = useMemo(() => {

        return referenceImages.map((imgIdx, idx) => {
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

                <div className="Reference-list-meta-title"
                    style={{
                        backgroundColor: backgroundColor,
                        color: fontColor,
                    }}
                >
                    <div>
                        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>{`${imageTtiles[imgIdx][0]}`}</div>
                        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>{`${imageTtiles[imgIdx][1]}`}</div>
                    </div>
                </div>
                <div className="Reference-list-origin-content"
                    style={{
                        backgroundColor: backgroundColor,
                    }}
                >
                    <img className="Reference-image"
                        src={`database/${imgIdx + 1}.jpg`}
                        alt={""}
                    />
                </div>
            </div>
        })
    
    }, [referenceImages, currentDetail])

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
                setMoveVector([
                    moveVector[0] + e.clientX - maskMoveP[0],
                    moveVector[1] + e.clientY - maskMoveP[1],
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

    const [currentScale, setCurrentScale] = useState(1);
    const maxScale = 15;
    const handleWheelChange = useCallback((v) => {
        if(v > 0) {
            const newScale = Math.min(maxScale, currentScale * 1.25);
            setCurrentScale(newScale);
        } else if (v < 0) {
            const newScale = Math.max(1, currentScale / 1.25);
            setCurrentScale(newScale);
        }
    }, [currentScale])

    // console.log("test-print-wh", canvasSize, currentWH)


    return <div className="ReferenceView-container">
        <div className="ReferenceView-content">
            <div className="Reference-canvas">
                <div className="Reference-title">
                    <span>Reference Window</span>
                </div>
                <div className="Reference-canvas-container" ref={canvasRef}>
                    <div 
                        id = "single-canvas"
                        style={{
                            width: `${currentWH[0] * currentScale}px`,
                            height: `${currentWH[1] * currentScale}px`,
                            position: "absolute",
                            zIndex: "100",
                            left: `${moveVector[0]}px`,
                            top: `${moveVector[1]}px`,
                            backgroundImage: `url("database/${referenceImages[currentDetail] + 1}.jpg")`,
                            backgroundSize: '100% 100%',
                        }}
                        onWheel={(e) => handleWheelChange(e.deltaY)}
                        onMouseDown={(e) => handleDragStart(e)}
                        onMouseMove={(e) => handleDragMove(e)}
                        onMouseUp={(e) => handleDragEnd(e)}
                    />
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: "#b09872",
                            right: "10px",
                            bottom: "10px",
                            border: "3px solid #5a4e3b",
                            borderRadius: "8px",
                            position: "absolute",
                            zIndex: "120",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => 
                            ExemplarBasedColorization({
                                exampleIndex: referenceImages[currentDetail] + 1
                            })
                            .then(res => {
                                // console.log("test-print-res", res)
                                changeColorizedVersions(res)
                            }
                        )}
                    >
                        <div style={{fontSize: "24px", fontWeight: "600", color: "#5a4e3b"}}>C</div>   
                    </div>
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
                        <div className="Reference-list-meta-title">
                            <span>Meta</span>
                        </div>
                        <div className="Reference-list-origin-title">
                            <span>Original Painting</span>
                        </div>
                    </div>
                    <div className="Reference-list-content">
                        {displayImages}
                    </div>
                </div>
            </div>
        </div>
    </div>
}
