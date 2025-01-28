import { FC, useState } from "react";
import CentralModal from "../../shared/CentralModal/CentralModal.tsx";

import styles from "./ChangingNicknameModal.module.scss";

import cross from '../../../assets/icons/input-cross.svg';
import tick from '../../../assets/icons/input-tick.svg';
import { useGetCurrentUserProfileInfoQuery, useUpdateCurrentUserProfileMutation } from "../../../redux/index.ts";

interface ChangeNicknameModalProps {
  modalId: string;
  onClose: () => void;
  currentNickname: string;
  currentBlogName: string;
}

const ChangeNicknameModal: FC<ChangeNicknameModalProps> = ({ modalId, onClose, currentNickname, currentBlogName }) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [blogName, setBlogName] = useState(currentBlogName);
  const [suchUserExists, setSuchUserExists] = useState(false);

  const isValid = (text: string) => text.trim().length > 0 && text.trim().length <= 26;

  const [updateProfile, { isLoading }] = useUpdateCurrentUserProfileMutation();
  const { refetch: refetchProfile } = useGetCurrentUserProfileInfoQuery();

  const trimmedNickname = nickname.trim();
  const trimmedBlogName = blogName.trim();

  const isFormValid =
    isValid(trimmedNickname) &&
    isValid(trimmedBlogName) &&
    !(trimmedNickname === currentNickname.trim() &&
    trimmedBlogName === currentBlogName.trim());

  const handleUpdate = async () => {
    try {
      await updateProfile({ blog_name: trimmedBlogName, username: trimmedNickname }).unwrap();
      refetchProfile();
      onClose();
    } catch (err) {
      if (typeof err === "object" && err !== null && "status" in err) {
        const errorStatus = (err as { status: number }).status;

        if (errorStatus === 409) {
          setSuchUserExists(true);
        }
      }
    }
  };

  const handleClose = () => {
    setNickname(currentNickname);
    setBlogName(currentBlogName);
    setSuchUserExists(false);
    onClose();
  };

  return (
    <CentralModal modalId={modalId} title={"Редактировать профиль"} onClose={handleClose}>
      <div className={styles.inputGroup}>
        <label>Никнейм</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className={`${styles.input} ${!isValid(trimmedNickname) ? styles.invalid : ""}`}
          placeholder="Введите никнейм"
        />
        <img className={styles.statusIcon} src={!isValid(trimmedNickname) ? cross : tick} />
      </div>

      <p className={styles.maxLength}>{!isValid(trimmedNickname) ? 'Максимальная длина поля - 26 символов' : ''}</p>

      <div className={styles.inputGroup}>
        <label>Название блога</label>
        <input
          type="text"
          value={blogName}
          onChange={(e) => setBlogName(e.target.value)}
          className={`${styles.input} ${!isValid(trimmedBlogName) ? styles.invalid : ""}`}
          placeholder="Введите название блога"
        />
        <img className={styles.statusIcon} src={!isValid(trimmedBlogName) ? cross : tick} />
      </div>

      <p className={styles.maxLength}>{!isValid(trimmedBlogName) ? 'Максимальная длина поля - 26 символов' : ''}</p>

      <p className={styles.maxLength}>{suchUserExists ? 'Пользователь с таким никнеймом уже существует' : ''}</p>

      <button
        className={`${styles.saveBtn} ${isFormValid ? styles.validInput : ''}`}
        onClick={handleUpdate}
        disabled={!isFormValid || isLoading}
      >
        Сохранить
      </button>
    </CentralModal>
  );
};

export default ChangeNicknameModal;