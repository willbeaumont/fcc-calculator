import { useState } from 'react';
import './App.css';

function DrumPad(props) {

  return (
    <button
      className="drum-pad bg-teal-500 hover:bg-teal-600 w-16 h-16 border border-sky-900 rounded-md"
      id={props.drumKey.description}
      type="button"
      onClick={playKey}>
      {props.drumKey.name.toUpperCase()}
      <audio
        ref={ref}
        className="clip"
        id={props.drumKey.name.toUpperCase()}
        src={props.drumKey.audio}
        desc={props.drumKey.description}
      />
    </button>
   );
}


function App() {
  return (
    <div className="App">

    </div>
  );
}

export default App;
