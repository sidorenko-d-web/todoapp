import React, { useState, useRef } from "react";
import { CentralModal, Button } from "../../../../shared";
import { MODALS } from "../../../../../constants";
import styles from "./ConfirmationCodeModal.module.scss";

interface ConfirmationCodeModalProps {
  email: string;
  onClose: () => void;
}

export const ConfirmationCodeModal: React.FC<ConfirmationCodeModalProps> = ({ email, onClose }) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredCode = code.join("");
    if (enteredCode.length === 6) {
      console.log("Code submitted:", enteredCode);
      onClose();
    }
  };

  return (
    <CentralModal title="Рейтинг инфлюенсеров" modalId={MODALS.EMAIL_CONFIRMATION_CODE} onClose={onClose}>
      <p className={styles.emailText}>
        Введите код подтверждения, полученный на ваш почтовый адрес {email}
      </p>
      <div className={styles.codeInputGroup}>
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputRefs.current[index] = el)}
            className={styles.codeInput}
          />
        ))}
      </div>
      <p className={styles.resendText}>Отправить повторно [{timer}s]</p>
      <Button className={styles.submitBtn} onClick={handleSubmit} disabled={code.join("").length < 6}>
        Подтвердить
      </Button>
    </CentralModal>
  );
};
