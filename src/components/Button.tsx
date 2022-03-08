import { Children, useState } from "react";

type ButtonProps = {
  text?: string;
  children?: number[];
}

export function Button(props: ButtonProps) {
  const [counter, setCounter] = useState(0);

  function increment() {
    setCounter(counter + 1);
  }

  return (
    <button
      onClick={increment}
    >{ 
      (counter || props.text || props.children?.at(1) || 'default')
      }
    </button>
  )
}