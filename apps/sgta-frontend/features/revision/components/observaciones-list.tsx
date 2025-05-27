"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertTriangle, FileWarning, Quote, Sparkles } from "lucide-react";
import { useState } from "react";

interface Observacion {
	id: string
	pagina: number
	parrafo: number
	texto: string
	tipo: "contenido" | "plagio" | "citado"
	resuelto: boolean
}

interface ObservacionesListProps {
	observaciones: Observacion[]
	editable?: boolean
}

export function ObservacionesList({ observaciones, editable = false }: ObservacionesListProps) {
	const [filtro, setFiltro] = useState<string>("");
	const [observacionesState, setObservacionesState] = useState<Observacion[]>(observaciones);

	const observacionesFiltradas = observacionesState.filter(
		(obs) =>
			obs.texto.toLowerCase().includes(filtro.toLowerCase()) ||
			obs.pagina.toString().includes(filtro) ||
			obs.tipo.includes(filtro.toLowerCase()),
	);

	const handleToggleResuelto = (id: string) => {
		if (!editable) return;

		setObservacionesState(observacionesState.map((obs) => (obs.id === id ? { ...obs, resuelto: !obs.resuelto } : obs)));
	};

	const getIconByTipo = (tipo: string) => {
		switch (tipo) {
			case "contenido":
				return <FileWarning className="h-4 w-4 text-yellow-500" />;
			case "plagio":
				return <AlertTriangle className="h-4 w-4 text-red-500" />;
			case "citado":
				return <Quote className="h-4 w-4 text-blue-500" />;
			default:
				return null;
		}
	};

	const getBadgeByTipo = (tipo: string) => {
		switch (tipo) {
			case "contenido":
				return (
					<Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
						Contenido
					</Badge>
				);
			case "plagio":
				return (
					<div className="flex gap-2">
						<Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
							Plagio
						</Badge>
						<Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1 px-2 py-1">
							<Sparkles className="h-3 w-3" />
							Automático
						</Badge>
					</div>
				);
			case "citado":
				return (
					<Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
						Citado
					</Badge>
				);
			default:
				return null;
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Input
					placeholder="Filtrar observaciones..."
					value={filtro}
					onChange={(e) => setFiltro(e.target.value)}
					className="max-w-sm"
				/>
			</div>

			{observacionesFiltradas.length === 0 ? (
				<div className="text-center py-8 text-muted-foreground">No se encontraron observaciones</div>
			) : (
				<div className="space-y-4">
					{observacionesFiltradas.map((observacion) => (
						<div
							key={observacion.id}
							className={"p-4 border rounded-lg bg-white"}
						>
							<div className="flex items-start gap-3">
								{editable && (
									<Checkbox
										checked={observacion.resuelto}
										onCheckedChange={() => handleToggleResuelto(observacion.id)}
										className="mt-1"
									/>
								)}
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										{getIconByTipo(observacion.tipo)}
										<span className="font-medium">
											Página {observacion.pagina}{/*, Párrafo {observacion.parrafo}*/}
										</span>
										{getBadgeByTipo(observacion.tipo)}
										{/*observacion.resuelto && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-red-100">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Resuelto
                      </Badge>
                    )*/}
									</div>
									<p className="text-sm">{observacion.texto}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}