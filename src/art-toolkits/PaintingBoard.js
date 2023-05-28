import { defaultHasBottomPannel, defaultPBPaintingNavigatorHeight, defaultPBToolNavigatorWidth, defaultPBToolTypes, PaintingBoardToolTypeEnum } from "./PaintingBoardConfig.js"

// import BrushSVG from "../icons/brush.svg";
// import { IconButton } from "./IconButton";

/**
 * 
 * @param {Array<string>} toolkitList 
 * @param {number} toolNavigatorWidth
 * @param {number} paintingNavigatorHeight
 * @param {boolean} hasBottomPanel
 * @returns 
 */
export function PaintingBoard ({
    toolkitList = defaultPBToolTypes,
    toolNavigatorWidth = defaultPBToolNavigatorWidth,
    paintingNavigatorHeight = defaultPBPaintingNavigatorHeight,
    hasBottomPanel = defaultHasBottomPannel,
}) {

    // console.log("test-print", toolkitList);

    // 不更新

    return <div className={"w-full h-full flex"}>
        <div className={`w-[${toolNavigatorWidth}px] h-full bg-primary border-ps rounded-l-lg`}>

        </div>
        <div className={`w-[calc(100%-${toolNavigatorWidth}px)] h-full border-ps-l-0 rounded-r-lg`}>
            <div className={`w-full h-[${paintingNavigatorHeight}px] bg-primary border-b-3 border-colorOne rounded-tr`}>

            </div>
            <div className={`w-full h-[calc(100%-${(hasBottomPanel?2:1)*paintingNavigatorHeight}px)]`}>

            </div>
            {
                hasBottomPanel && 
                <div className={`w-full h-[${paintingNavigatorHeight}px] bg-primary border-t-3  border-colorOne rounded-br`}>

                </div>
            }
        </div>
    </div>
}