import { useState } from "react";
import { useAppMode } from "../context/AppModeContext";
import styles from "./ModeSwitch.module.css";

/**
 * Header control for the parent/kid mode split (see AppModeContext.tsx).
 * Kid mode needs no gate to enter (a parent handing over the device); a
 * kid trying to get back to the parent view needs the demo PIN.
 */
export function ModeSwitch() {
  const { mode, enterKidMode, exitKidMode } = useAppMode();
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (mode === "parent") {
    return (
      <button type="button" className={styles.button} onClick={enterKidMode}>
        Hand to kid mode
      </button>
    );
  }

  if (showPinPrompt) {
    return (
      <form
        className={styles.pinForm}
        onSubmit={(e) => {
          e.preventDefault();
          const ok = exitKidMode(pin);
          if (ok) {
            setShowPinPrompt(false);
            setPin("");
            setError(false);
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
      Parent mode
    </button>
  );
}
