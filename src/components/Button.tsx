import { Children } from "react";

type ButtonProps = {
  text?: string;
  children?: number[];
}

export function Button(props: ButtonProps) {
  return (
    <button>{ (props.text || props.children?.at(1) || 'default')}</button>
  )
}