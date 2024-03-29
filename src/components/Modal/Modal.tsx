import React, { SetStateAction, useState } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isActive: boolean;
  setIsActive: React.Dispatch<SetStateAction<boolean>>;
  setSelectedBallColor: React.Dispatch<SetStateAction<string>>;
}

const Modal: React.FC<ModalProps> = ({ isActive, setIsActive, setSelectedBallColor }) => {
  const [myColor, setMyColor] = useState("");

  return (
    <div className={styles.modal} onClick={() => setIsActive(false)}>
      <div className={styles.modalContent} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        {isActive && <h2 className={styles.title}>Сменить цвет?</h2>}
        <div className={styles.buttons}>
          <button onClick={() => setSelectedBallColor("red")}>Красный</button>
          <button onClick={() => setSelectedBallColor("yellow")}>Желтый</button>
          <button onClick={() => setSelectedBallColor("green")}>Зеленый</button>
          <input type="text" placeholder="Enter your color" value={myColor} onChange={(e) => setMyColor(e.target.value)} />
          <button onClick={() => setSelectedBallColor(myColor)}>Добавить</button>
          <button onClick={() => setIsActive(false)}>Нет</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
