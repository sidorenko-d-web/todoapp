import { FC, useState } from "react";
import CentralModal from "../../shared/CentralModal/CentralModal.tsx";

import styles from "./ChangingNicknameModal.module.scss";

import cross from '../../../assets/icons/input-cross.svg';
import tick from '../../../assets/icons/input-tick.svg';

interface ChangeNicknameModalProps {
  modalId: string;
  onClose: () => void;
}

const ChangeNicknameModal: FC<ChangeNicknameModalProps> = ({ modalId, onClose }) => {
  const [nickname, setNickname] = useState("");
  const [blogTitle, setBlogTitle] = useState("");

  const isValid = (text: string) => text.length <= 26;

  return (
    <CentralModal modalId={modalId} title={"Редактировать профиль"} onClose={onClose}>
      <div className={styles.inputGroup}>
        <label>Никнейм</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={`${styles.input} ${!isValid(nickname) ? styles.invalid : ""}`}
          placeholder="Введите никнейм"
        />
         <img className={styles.statusIcon} src={!isValid(nickname) ? cross : tick}/>
      </div>

      <div className={styles.inputGroup}>
        <label>Название блога</label>
        <input
          type="text"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          className={`${styles.input} ${!isValid(blogTitle) ? styles.invalid : ""}`}
          placeholder="Введите название блога"
        />
        <img className={styles.statusIcon} src={!isValid(blogTitle) ? cross : tick}/>
        {/* <span className={`${styles.statusIcon} ${isValid(blogTitle) ? styles.validImg : styles.invalidImg}`} /> */}
      </div>
    </CentralModal>
  );
};

export default ChangeNicknameModal;
