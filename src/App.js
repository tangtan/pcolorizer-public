import { useState } from 'react';
import './App.css';
import { DemoPaintBoard } from './demo-version/PaintBoard';
import { DemoReferenceView } from './demo-version/ReferenceView';
import { DemoTimelineView } from './demo-version/TimelineView';
import case2Query from "./images/case2/query.jpg";
// import case2Restored1 from "../images/case2/restored1.jpg";

function App() {

    const [referenceImages, setReferenceImages] = useState([]);
    const [colorizedVersions, setColorizedVersions] = useState([case2Query]);

    // console.log("test-print-colorizedVersions", colorizedVersions)

    return (
        <div className="App">
            <div className='App-header'>
                <span className='App-header-title'>PColorizor</span>
            </div>
            <div className='App-content'>
                <div className='App-part1'>
                    <div className='App-board'>
                        <DemoPaintBoard restoredImages={colorizedVersions} />
                    </div>
                    <div className='App-timeline'>
                        <DemoTimelineView 
                            currentImages={referenceImages} 
                            changeReferenceImages={(newImages) => setReferenceImages(newImages)}
                        />
                    </div>
                </div>
                <div className='App-part2'>
                    <div className='App-reference'>
                        <DemoReferenceView 
                            referenceImages={referenceImages} 
                            changeColorizedVersions={(newVersion) => {
                                const imageUrl = URL.createObjectURL(newVersion);
                                console.log("test-print", newVersion, imageUrl);

                                colorizedVersions.push(imageUrl);
                                setColorizedVersions(JSON.parse(JSON.stringify(colorizedVersions)));
                            }}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
