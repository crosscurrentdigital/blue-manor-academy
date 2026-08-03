import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParentAccess } from "../context/ParentAccessContext";
import styles from "./ParentToolsButton.module.css";

/**
 * Header control gating Family/billing behind a PIN — the only gate in the
 * app. Joining today's class is never behind this; see
 * ParentAccessContext.tsx for why.
 */
export function ParentToolsButton() {
  const { unlocked, unlock, lock } = useParentAccess();
  const navigate = useNavigate();
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) {
    return (
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          lock();
          navigate("/");
        }}
      >
        Lock parent tools
      </button>
    );
  }

  if (showPinPrompt) {
    return (
      <form
        className={styles.pinForm}
        onSubmit={(e) => {
          e.preventDefault();
          const ok = unlock(pin);
          if (ok) {
            setShowPinPrompt(false);
            setPin("");
            setError(false);
            navigate("/family");
          } else {
            setError(true);
          }
        }}
      >
        <input
          type="password"
          inputMode="numeric"
          placeholder="Parent PIN"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError(false);
          }}
          className={styles.pinInput}
          autoFocus
        />
        <button type="submit" className={styles.button}>
          Unlock
        </button>
        {error ? <span className={styles.pinError}>Wrong PIN (demo PIN is 1234)</span> : null}
      </form>
    );
  }

  return (
    <button type="button" className={styles.button} onClick={() => setShowPinPrompt(true)}>
      Parent tools
    </button>
  );
}
