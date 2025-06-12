"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBackStore } from "../../store/configuracion-store";

export default function TemasCard() {
    const {
        parametros,
        parametrosOriginales,
        actualizarParametro,
        guardarParametros,
        cargando,
    } = useBackStore();

    // Buscar los parámetros por nombre
    const limitePostulacionesParam = parametros.find(
        (p) => p.parametroConfiguracion.nombre === "Limite Postulaciones Alumno"
    );
    const limitePropuestasParam = parametros.find(
        (p) => p.parametroConfiguracion.nombre === "Limite Propuestas Alumno"
    );

    const originalPost = parametrosOriginales.find(
        (p) => p.parametroConfiguracion.nombre === "Limite Postulaciones Alumno"
    );
    const originalProp = parametrosOriginales.find(
        (p) => p.parametroConfiguracion.nombre === "Limite Propuestas Alumno"
    );
    const hasChanges =
        (limitePostulacionesParam &&
            originalPost &&
            limitePostulacionesParam.valor !== originalPost.valor) ||
        (limitePropuestasParam &&
            originalProp &&
            limitePropuestasParam.valor !== originalProp.valor);

    const handleChangePostulaciones = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (limitePostulacionesParam) {
            actualizarParametro(limitePostulacionesParam.id, value);
        }
    };

    const handleChangePropuestas = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (limitePropuestasParam) {
            actualizarParametro(limitePropuestasParam.id, value);
        }
    };

    if (!limitePostulacionesParam || !limitePropuestasParam) return null;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Límite de postulaciones a temas libres</CardTitle>
                    <CardDescription>
                        Define el límite de postulaciones a temas libres que puede realizar un estudiante.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="limite-postulaciones">
                            Límite de postulaciones por alumno
                        </Label>
                        <Input
                            type="number"
                            id="limite-postulaciones"
                            min={1}
                            value={limitePostulacionesParam.valor?.toString() ?? ""}
                            onChange={handleChangePostulaciones}
                            disabled={cargando}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Límite de propuestas de tema</CardTitle>
                    <CardDescription>
                        Define el límite en cantidad de propuestas de tema de un estudiante.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="limite-propuestas">
                            Límite de propuestas por alumno
                        </Label>
                        <Input
                            type="number"
                            id="limite-propuestas"
                            min={1}
                            value={limitePropuestasParam.valor?.toString() ?? ""}
                            onChange={handleChangePropuestas}
                            disabled={cargando}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
