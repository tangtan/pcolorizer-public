import "./IndentPanel.css";
import OpenCloseSVG from "../icons/open_close.svg";
import { useMemo, useState } from "react";

// Image Gallery
export const IndentPanel = ({
    iconSize,
    restoredImages,
    displayOne,
    displayTwo,
    handleImageClick,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const galleryImages = useMemo(() => {
        return restoredImages.map((imgSrc, idx) => {
            let borderColor = "none";
            let width = 240;
            let height = 90;

            if(idx === displayOne || idx === displayTwo) {
                width = 270;
                height = 100;
                borderColor = "5px solid #fff6dc";
            }

            return <div key={`gallery-image-${idx}`}
                style={{
                    width: `${width}px`,
                    height: `calc(${height}% - 10px)`,
                    marginLeft: idx !== 0 ? "16px" : "0px",
                    position: "relative"
                }}
                onClick={() => handleImageClick(idx)}
            >
                <img className="Gallery-image"
                    src={imgSrc}
                    alt={""}
                    style={{
                        border: borderColor,
                    }}
                />
                {
                    idx === displayOne && <div className="Select-title">
                        <span>1st Window</span>
                    </div>
                }
                {
                    idx === displayTwo && <div className="Select-title">
                        <span>2nd Window</span>
                    </div>
                }
            </div>
        })
    }, [restoredImages, displayOne, displayTwo, handleImageClick])

    return <div className="IndentPanel-container">
        <div className={isOpen ? "IndentPanel-horizontal" : "IndentPanel-horizontal-hidden"} onClick={() => setIsOpen(!isOpen)}>
            <div
                style={{
                    background: `url(${OpenCloseSVG}) no-repeat`,
                    backgroundSize: 'contain',
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    transform: isOpen ? "rotate(270deg)" : "rotate(90deg)",
                    cursor: "pointer"
                }}
            />
        </div>
        <div className={isOpen ? "IndentPanel-horizontal-content" : "IndentPanel-horizontal-content-hidden"}>
            <div className="IndentPanel-gallery">
                {galleryImages}
            </div>
        </div>
    </div>
    
}