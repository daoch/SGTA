"use client";

import { Component } from "react";
// Reutilizamos el CSS del Tip original
import styles from "react-pdf-highlighter/dist/src/style/Tip.module.css";
import { Button } from "./button";

interface CustomTipProps {
  onOpen: () => void;
  onConfirm: (comment: { text: string; emoji: string }) => void;
}
interface CustomTipState {
  compact: boolean;
  text: string;
  emoji: string;
}

export class CustomTip extends Component<CustomTipProps, CustomTipState> {
  state: CustomTipState = { compact: true, text: "", emoji: "" };

  render() {
    const { onOpen, onConfirm } = this.props;
    const { compact, text, emoji } = this.state;

    // Fase compacta: solo el botón
    if (compact) {
      return (
        <div
          className={styles.compact}
          onClick={() => {
            onOpen();
            this.setState({ compact: false });
          }}
        >
          {/* Texto personalizado */}
          Agregar observación
        </div>
      );
    }

    // Fase de formulario
    return (
      <form
        className={styles.card}
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm({ text, emoji });
        }}
        style={{ width: 340 /* ancho total del card */ }}
      >
        <textarea
          placeholder="Tu comentario"
          autoFocus
          value={text}
          onChange={(e) => this.setState({ text: e.target.value })}
          style={{ width: 320 /* ancho total del card */ }}
        />
        <div style={{ margin: "8px 0" }}>
          {["💬", "❗", "✅", "⚠️"].map((e) => (
            <label key={e} style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="emoji"
                value={e}
                checked={emoji === e}
                onChange={() => this.setState({ emoji: e })}
              />
              <span style={{ marginLeft: 4 }}>{e}</span>
            </label>
          ))}
        </div>
        <Button type="submit" variant="default" size="sm">
          Guardar
        </Button>
      </form>
    );
  }
}
