import { useState } from 'react';
import './index.css';
import { numberGroup, operatorGroup } from './buttonData.js';

function updateNumbers(update, num, setNum, setOps) {
  let updated = null
  const currentNumber = num[num.length - 1]
  const hasDecimal = currentNumber.includes(".")

  if (update === "AC") { // clear both numbers and operators
    updated = ["0"];
    setOps([]);
  } else if (currentNumber === "0") { // special case for start
    let zero = null
    if (update === ".") { // keep 0 for decimal
      zero = currentNumber + "."
    } else {
      zero = update
    }

    if (num.length === 1) {
      updated = [zero]
    } else {
      updated = [...num]
      updated.splice(-1, 1, zero)
    }

  // only allow for one "."
  } else if ((update === "."  && !hasDecimal) || update !== ".") {
    updated = [...num]
    updated.splice(-1, 1, currentNumber + update)
  } else {
    updated = [...num]
  }
  setNum(updated)
}

function updateOperations(update, num, setNum, ops, setOps) {
  if (ops.length === 0) {
    setOps([update])
  } else {
    setOps([...ops, update])
  }
  setNum([...num, "0"])
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

  function updateDisplay(target) {
    if (props.type === "number") {
      updateNumbers(
        target,
        props.numbers,
        props.setNumbers,
        props.setOperations
      )
    } else {
      updateOperations(
        target,
        props.numbers,
        props.setNumbers,
        props.operations,
        props.setOperations
      )
    }
  }

  return (
    <button
      className={w + " h-16 border border-gray-800 " + bg}
      id={props.data.id}
      type="button"
      value={props.data.value}
      onClick={(e) => updateDisplay(e.target.value,)}
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
            numbers={props.numbers}
            setNumbers={props.setNumbers}
            operations={props.operations}
            setOperations={props.setOperations}
          />
        )}
      </div>

  )
}

function display(nums, ops) {
  let result = []
  for (let i=0, j=0; i < nums.length || j < ops.length;) {
    if (i < nums.length) {
      result.push(nums[i++]);
    }
    if (j < ops.length) {
      result.push(ops[j++]);
    }
  }
  return( result );
}

function App() {
  const [numbers, setNumbers] = useState(["0"]);
  const [operations, setOperations] = useState([]);

  return (
    <div className="w-screen h-screen flex bg-gray-800">
      <div className="m-auto">
        <div className="flex flex-col">
          <div id="display" className="bg-gray-700 h-16 border-gray-800 text-5xl text-white text-right pr-4 pt-1">
            {display(numbers, operations)}
          </div>
          <div className="flex">
              <ButtonGroup
                group={numberGroup}
                type="number"
                numbers={numbers}
                setNumbers={setNumbers}
                operations={operations}
                setOperations={setOperations}
              />
              <ButtonGroup
                group={operatorGroup}
                type="operator"
                numbers={numbers}
                setNumbers={setNumbers}
                operations={operations}
                setOperations={setOperations}
              />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
