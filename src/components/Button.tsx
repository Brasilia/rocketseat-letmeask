import { ButtonHTMLAttributes } from "react";

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { // adds properties to the type
  isOutlined?: boolean;
};

export function Button({ isOutlined = false, ...props}: ButtonProps) { // rest operator: all which was not taken before "..." goes inside (into props)
  return (
    <button 
      className={`button ${isOutlined ? 'outlined' : ''}`}
      {...props} 
    />
  )
}