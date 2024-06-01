import React, { ReactNode } from 'react';
import styles from "./alert.module.css";
import utilStyles from '@/styles/utils.module.css'
import { clsx } from "clsx";
import XIcon from '../Icons/XIcon/xIcon';

interface AlertProps {
  children: ReactNode;
  type: 'success' | 'error' | 'noAlert';
  onClick: () => void;
}

const Alert: React.FC<AlertProps> = ({ children, type, onClick }) => {
  return (
    <div
      className={clsx({
        [styles.success]: type === "success",
        [styles.error]: type === "error",
        [utilStyles.displayNone]: type === "noAlert",
      })}
    >
      <div className={styles.darkBG} onClick={onClick} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2 className={styles.heading}>{type}</h2>
            <XIcon onClick={onClick} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Alert;
