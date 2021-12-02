import className from './index.module.less';
import classNames from 'classnames'
import { DetailedHTMLProps } from 'react';
interface Props extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  isOpen: boolean
}

export default function MenuBtn({ isOpen, ...btnProps }: Props) {
  return (
    <button {...btnProps} className={classNames(className.menuBtn, {
      [className.open]: isOpen
    })}>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}
