import { useState } from 'react';
import './index.css';
import { numbers, operators } from './buttonData.js';

function calculate(i) {
  if (i == "AC") {
    return("0")
  } else {
    return(i)
  }
}

function Button(props) {
  let bg = "bg-orange-400 active:bg-orange-500";
  if (props.type === "number") {
      bg = "bg-gray-400 active:bg-gray-500";
  }

  let w = "w-16";
  if (props.data.value === "AC") {
    w = "col-span-3";
    bg = "bg-gray-500 active:bg-gray-600"
  } else if (props.data.value === "0") {
    w = "col-span-2";
  }

  return (
    <button
      className={w + " h-16 border border-gray-800 " + bg}
      id={props.data.id}
      type="button"
      value={props.data.value}
      onClick={(e) => props.setDisplay(calculate(e.target.value))}
    >
      {props.data.value}
    </button>
   );
}

function ButtonGroup(props) {
  return (
      <div className={(props.type === "number" ? "grid-cols-3 " : "grid-cols-1 " ) + "grid"}>
        {props.group.map(b =>
          <Button
            data={b}
            key={b.id}
            type={props.type}
            setDisplay={props.setDisplay}
          />
        )}
      </div>

  )
}

function App() {
  const [display, setDisplay] = useState("0");

  const displayHandle = event => {
    setDisplay(event.target.value);
  };

  return (
    <div className="w-screen h-screen flex bg-gray-800">
      <div className="m-auto">
        <div className="flex flex-col">
          <div id="display" className="bg-gray-700 h-16 border-gray-800 text-5xl text-white text-right pr-4 pt-1">
            {display}
          </div>
          <div className="flex">
              <ButtonGroup group={numbers} type="number" setDisplay={setDisplay} />
              <ButtonGroup group={operators} type="operator" setDisplay={setDisplay} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
