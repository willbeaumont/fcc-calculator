import { useState } from 'react';
import './index.css';
import buttons from './buttonData.js';

function Button(props) {
  return (
    <button
      className="bg-teal-500 hover:bg-teal-600 w-16 h-16 border border-sky-900 rounded-md"
      id={props.data.id}
      type="button"
    >
      {props.data.value}
    </button>
   );
}


function App() {
  return (
    <div>
      {buttons.map(b =>
        <Button data={b} />
      )}
    </div>
  );
}

export default App;
