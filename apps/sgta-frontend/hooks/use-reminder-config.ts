import {
    getReminderConfig,
    ReminderConfig,
    updateReminderConfig,
    updateReminderConfigReset
} from "@/features/notifications/services/notifications";
import { useEffect, useState } from "react";

interface NotificationSettings {
    autoReminders: boolean;
    daysAdvance: {
        sevenDays: boolean;
        threeDays: boolean;
        oneDay: boolean;
        sameDay: boolean;
    };
    channels: {
        email: boolean;
        system: boolean;
        push: boolean;
    };
}

// Mapeo de días a números
const DAY_MAP = {
    sevenDays: 7,
    threeDays: 3,
    oneDay: 1,
    sameDay: 0,
} as const;

// Configuración predeterminada
const DEFAULT_SETTINGS: NotificationSettings = {
    autoReminders: true,
    daysAdvance: {
        sevenDays: true,
        threeDays: true,
        oneDay: true,
        sameDay: true,
    },
    channels: {
        email: true,
        system: true,
        push: false,
    },
};

export const useReminderConfig = () => {
    const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mapear desde backend a frontend
    const mapFromBackend = (config: ReminderConfig): NotificationSettings => {
        return {
            autoReminders: config.activo,
            daysAdvance: {
                sevenDays: config.diasAnticipacion.includes(7),
                threeDays: config.diasAnticipacion.includes(3),
                oneDay: config.diasAnticipacion.includes(1),
                sameDay: config.diasAnticipacion.includes(0),
            },
            channels: {
                email: config.canalCorreo,
                system: config.canalSistema,
                push: false, // Este no está en el backend, se mantiene local
            },
        };
    };

    // Mapear desde frontend a backend
    const mapToBackend = (settings: NotificationSettings): ReminderConfig => {
        const diasAnticipacion: number[] = [];

        if (settings.daysAdvance.sevenDays) diasAnticipacion.push(7);
        if (settings.daysAdvance.threeDays) diasAnticipacion.push(3);
        if (settings.daysAdvance.oneDay) diasAnticipacion.push(1);
        if (settings.daysAdvance.sameDay) diasAnticipacion.push(0);

        return {
            activo: settings.autoReminders,
            diasAnticipacion,
            canalCorreo: settings.channels.email,
            canalSistema: settings.channels.system,
        };
    };

    // Cargar configuración inicial
    const loadConfig = async () => {
        try {
            setLoading(true);
            setError(null);
            const config = await getReminderConfig();
            const mappedSettings = mapFromBackend(config);
            setSettings(mappedSettings);
        } catch (err) {
            setError("Error al cargar la configuración");
            console.error("Error loading reminder config:", err);
            // En caso de error, usar configuración predeterminada
            setSettings(DEFAULT_SETTINGS);
        } finally {
            setLoading(false);
        }
    };

    // Guardar configuración
    const saveConfig = async () => {
        try {
            setSaving(true);
            setError(null);
            const backendConfig = mapToBackend(settings);
            await updateReminderConfig(backendConfig);
            return true;
        } catch (err) {
            setError("Error al guardar la configuración");
            console.error("Error saving reminder config:", err);
            return false;
        } finally {
            setSaving(false);
        }
    };

    // Resetear a configuración predeterminada
    const resetConfig = async () => {
        try {
            setSaving(true);
            setError(null);
            const defaultBackendConfig = mapToBackend(DEFAULT_SETTINGS);
            await updateReminderConfigReset(defaultBackendConfig);
            setSettings(DEFAULT_SETTINGS);
            return true;
        } catch (err) {
            setError("Error al resetear la configuración");
            console.error("Error resetting reminder config:", err);
            return false;
        } finally {
            setSaving(false);
        }
    };

    // Actualizar setting individual
    const updateSetting = (category: keyof NotificationSettings, setting: string, value: boolean) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...(prev[category] as Record<string, boolean>),
                [setting]: value,
            },
        }));
    };

    // Actualizar autoReminders directamente
    const updateAutoReminders = (value: boolean) => {
        setSettings(prev => ({ ...prev, autoReminders: value }));
    };

    // Cargar configuración al montar el componente
    useEffect(() => {
        loadConfig();
    }, []);

    return {
        settings,
        loading,
        saving,
        error,
        updateSetting,
        updateAutoReminders,
        saveConfig,
        resetConfig,
        loadConfig,
    };
}; 