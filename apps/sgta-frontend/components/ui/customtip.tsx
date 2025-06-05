"use client";

import { Component } from "react";
// Reutilizamos el CSS del Tip original
import { AlertTriangle, FileWarning, Quote } from "lucide-react";
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
const iconOptions = [
    { value: "contenido", icon: <FileWarning className="h-5 w-5 text-yellow-500" /> },
    { value: "similitud", icon: <AlertTriangle className="h-5 w-5 text-red-500" /> },
    { value: "citado", icon: <Quote className="h-5 w-5 text-blue-500" /> },
];
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
                <div className="flex items-center gap-3 my-2">
                    {iconOptions.map(({ value, icon }) => (
                        <label key={value} className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="emoji"
                                value={value}
                                checked={emoji === value}
                                onChange={() => this.setState({ emoji: value })}
                            />
                            <span>{icon}</span>
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