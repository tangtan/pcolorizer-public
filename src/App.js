import './App.css';
import { PaintBoard } from './components/PaintBoard';
import { ReferenceView } from './components/ReferenceView';
import { TimelineView } from './components/TimelineView';

function App() {

    return (
        <div className="App">
            <div className='App-header'>
                <span className='App-header-title'>PColorizor</span>
            </div>
            <div className='App-content'>
                <div className='App-part1'>
                    <div className='App-board'>
                        <PaintBoard />
                    </div>
                    <div className='App-timeline'>
                        <TimelineView />
                    </div>
                </div>
                <div className='App-part2'>
                    <div className='App-reference'>
                        <ReferenceView />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
