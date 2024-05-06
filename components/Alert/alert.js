import styles from './alert.module.css';
import { clsx } from 'clsx';

export default function Alert({ children, type, onClick }) {
    console.log({type})
  return (
    <div
      onClick={onClick}
      className={clsx({
        [styles.success]: type === 'success',
        [styles.error]: type === 'error',
      })}
    >
      {children}
    </div>
  );
}