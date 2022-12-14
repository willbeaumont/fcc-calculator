import { useState } from "react";
import "./index.css";
import { numberGroup, operatorGroup } from "./buttonData.js";

function updateNumbers(update, num, setNum, ops, setOps) {
  if (!ops) {
    // re-init ops when set to false after "=" calculation
    num = ["0"];
    setOps([]);
  }

  let updated = null;
  const currentNumber = num[num.length - 1];
  const hasDecimal = currentNumber.includes(".");

  if (update === "AC") {
    // clear both numbers and operators
    updated = ["0"];
    setOps([]);
  } else if (num.length === ops.length) {
    // add new number
    if (update === ".") {
      // keep 0 for decimal
      updated = [...num, "0."];
    } else {
      updated = [...num, update];
    }
  } else {
    updated = [...num];
    if ((update === "." && !hasDecimal) || update !== ".") {
      // only allow for one "."
      if (currentNumber === "0" && update !== ".") {
        // special case for 0 - replace if update isn't "zero"
        updated[num.length - 1] = update;
      } else {
        updated[num.length - 1] = currentNumber + update;
      }
    }
  }
  setNum(updated);
}

function updateOperations(update, num, setNum, ops, setOps) {
  const currentNumber = num[num.length - 1];

  if (update === "=" && ops.length > 0) {
    if (ops.length  === num.length) {
      ops.pop();
    }
    calculate(num, setNum, ops, setOps);
  } else if (ops.length !== num.length && currentNumber !== "-") {
    setOps((list) => (list ? list : []).concat(update));
  } else if (update === "-" && currentNumber !== "-") {
    setNum((list) => list.concat("-"));
  } else {
    ops.pop();
    setOps([...ops, update]);
    if (currentNumber === "-") {
      num.pop();
      setNum([...num]);
    }
  }
}

function calculate(num, setNum, ops, setOps) {
  let subTotal = 0;
  let removeOld = null;

  const operations = {
    x: function (x, y) {
      return x * y;
    },
    "/": function (x, y) {
      return x / y;
    },
    "+": function (x, y) {
      return x + y;
    },
    "-": function (x, y) {
      return x - y;
    },
  };

  function conductOperations(operators) {
    // scan operators using order of operations
    for (let i = 0; i < ops.length; ) {
      removeOld = false;
      subTotal = 0;
      // conduct operation and capture total
      if (operators.includes(ops[i])) {
        subTotal = [Number(num[i]), Number(num[i + 1])].reduce(
          operations[ops[i]]
        );
        removeOld = true;
      }

      // remove operation and numbers from state
      if (removeOld) {
        ops.splice(i, 1);
        num.splice(i, 2, subTotal.toString());
      } else {
        i++;
      }
    }
  }

  // scan operators until they're all gone
  while (ops.length > 0) {
    conductOperations("x/");
    conductOperations("+-");
  }
  setNum(num);
  setOps(false);
}

function Button(props) {
  let bg = "bg-orange-400 active:bg-orange-500";
  if (props.type === "number") {
    bg = "bg-gray-400 active:bg-gray-500";
  }

  let w = "w-16";
  if (props.data.value === "AC") {
    w = "col-span-3";
    bg = "bg-gray-500 active:bg-gray-600";
  } else if (props.data.value === "0") {
    w = "col-span-2";
  }

  function updateDisplay(target) {
    if (props.type === "number") {
      updateNumbers(
        target,
        props.numbers,
        props.setNumbers,
        props.operations,
        props.setOperations
      );
    } else {
      updateOperations(
        target,
        props.numbers,
        props.setNumbers,
        props.operations,
        props.setOperations
      );
    }
  }

  return (
    <button
      className={w + " h-16 border border-gray-800 " + bg}
      id={props.data.id}
      type="button"
      value={props.data.value}
      onClick={(e) => updateDisplay(e.target.value)}
    >
      {props.data.value}
    </button>
  );
}

function ButtonGroup(props) {
  return (
    <div
      className={
        (props.type === "number" ? "grid-cols-3 " : "grid-cols-1 ") + "grid"
      }
    >
      {props.children}
    </div>
  );
}

function display(num, setNum, ops, setOps) {
  let result = "";
  for (let i = 0, j = 0; i < num.length || j < ops.length; ) {
    if (i < num.length) {
      result = result + num[i++];
    }
    if (j < ops.length) {
      result = result + ops[j++];
    }
  }

  if (result.length - result.split(".").length + 1 > 11) {
    if (num.length === 1 && ops === false) {
      const rounded = Number(num[0]).toFixed(4).toString();
      if (rounded.length <= 11) {
        setNum([rounded])
        setOps(false)
        return rounded
      }
    }
    
    result = "MAX DIGITS";
  }
  return result;
}

function App() {
  const [numbers, setNumbers] = useState(["0"]);
  const [operations, setOperations] = useState([]);

  return (
    <div className="w-screen h-screen flex bg-gray-800">
      <div className="m-auto">
        <div className="flex flex-col">
          <div>
            <div
              id="display"
              className="bg-gray-700 h-16 border-gray-800 text-3xl text-white align-text-bottom text-right px-4 pt-1 pb-2"
            >
              {display(numbers, setNumbers, operations, setOperations)}
            </div>
          </div>
          <div className="flex">
            <ButtonGroup type="number">
              {numberGroup.map((b) => (
                <Button
                  data={b}
                  key={b.id}
                  type={"number"}
                  numbers={numbers}
                  setNumbers={setNumbers}
                  operations={operations}
                  setOperations={setOperations}
                />
              ))}
            </ButtonGroup>
            <ButtonGroup type="operator">
              {operatorGroup.map((b) => (
                <Button
                  data={b}
                  key={b.id}
                  type={"operator"}
                  numbers={numbers}
                  setNumbers={setNumbers}
                  operations={operations}
                  setOperations={setOperations}
                />
              ))}
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
