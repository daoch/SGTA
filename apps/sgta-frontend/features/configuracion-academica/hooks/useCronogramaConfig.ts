// src/features/configuracion-academica/hooks/useCronogramaConfig.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { CicloInfo, CursoType, CronogramaPlantilla, Hito, EstadoCronogramaType, ModoCreacionState } from '../types';
import * as cronogramaConfigService from '../services/cronogramaConfigService'; 
// Importar datos mock directamente aquí para la simulación
import { MOCK_ESTADOS, MOCK_HITOS_PFC1, MOCK_HITOS_PFC2 } from '../services/cronogramaConfigService'; // O desde un archivo dedicado

// --- Mock fetchCiclosDisponibles (igual que antes) ---
const fetchCiclosDisponibles = async (): Promise<CicloInfo[]> => { 
    console.log("HOOK: Fetching available cycles...");
    await new Promise(resolve => setTimeout(resolve, 100)); 
    const CICLO_ACTUAL_REAL = '2024-2'; 
    const FECHA_ACTUAL = new Date();
    const MITAD_CICLO_APROX = new Date(FECHA_ACTUAL.getFullYear(), 5, 1); 
    const puedeConfigurarProximo = true; //FECHA_ACTUAL >= MITAD_CICLO_APROX;
    return [
        { id: "2025-1", nombre: "2025-1", esProximo: true, puedeConfigurarProximo: puedeConfigurarProximo },
        { id: "2024-2", nombre: "2024-2", esActual: true },
        { id: "2024-1", nombre: "2024-1", esAnterior: true },
        { id: "2023-2", nombre: "2023-2", esAnterior: true },
        { id: "2023-1", nombre: "2023-1", esAnterior: true },
    ].sort((a, b) => b.id.localeCompare(a.id)); 
};
// -----------------------------------------------------


export const useCronogramaConfig = (initialCiclo?: string, initialCurso?: CursoType) => {
    const [ciclosDisponibles, setCiclosDisponibles] = useState<CicloInfo[]>([]);
    const [cicloSeleccionado, setCicloSeleccionado] = useState<string | null>(initialCiclo || null);
    const [cursoSeleccionado, setCursoSeleccionado] = useState<CursoType>(initialCurso || 'PFC1');
    const [plantillaCargada, setPlantillaCargada] = useState<CronogramaPlantilla | null>(null); 
    const [hitosEditados, setHitosEditados] = useState<Hito[]>([]); 
    const [estadoOriginal, setEstadoOriginal] = useState<EstadoCronogramaType | null>(null); 
    const [isLoadingCiclos, setIsLoadingCiclos] = useState(true);
    const [isLoadingPlantilla, setIsLoadingPlantilla] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modoCreacion, setModoCreacion] = useState<ModoCreacionState>({ activo: false, copiarDesdeCicloId: null, empezarCero: false });
    const [ciclosParaCopiar, setCiclosParaCopiar] = useState<string[]>([]);

    // --- Carga Inicial de Ciclos ---
    const loadCiclos = useCallback(async () => {
        // ... (igual que antes) ...
         setIsLoadingCiclos(true);
         setError(null);
         try {
             const ciclos = await fetchCiclosDisponibles(); 
             setCiclosDisponibles(ciclos);
             if (!cicloSeleccionado && ciclos.length > 0) {
                 const actual = ciclos.find(c => c.esActual);
                 const proximoConfigurable = ciclos.find(c => c.esProximo && c.puedeConfigurarProximo);
                 setCicloSeleccionado(actual?.id || proximoConfigurable?.id || ciclos[0].id); 
             }
         } catch (err) { setError(err instanceof Error ? err.message : "Error al cargar ciclos disponibles."); } 
         finally { setIsLoadingCiclos(false); }
    }, [cicloSeleccionado]); // Dependencia cicloSeleccionado

    useEffect(() => { loadCiclos(); }, [loadCiclos]);

    // --- Carga de Plantilla ---
    const loadTemplate = useCallback(async () => {
        if (!cicloSeleccionado) return;
        setIsLoadingPlantilla(true);
        setError(null);
        setHitosEditados([]); 
        setEstadoOriginal(null);
        try {
            // Usar servicio directamente
            const plantilla = await cronogramaConfigService.fetchScheduleTemplate(cicloSeleccionado, cursoSeleccionado);
            setPlantillaCargada(plantilla); 
            // Ordenar hitos al cargar por si acaso
            setHitosEditados(plantilla?.hitos?.sort((a,b) => a.orden - b.orden) || []); 
            const currentEstado = plantilla?.estadoInfo.estado || 'NO_CREADO';
            setEstadoOriginal(currentEstado); 

            if (currentEstado === 'NO_CREADO') {
                 const cicloInfo = ciclosDisponibles.find(c => c.id === cicloSeleccionado);
                 const puedeCrearAhora = !cicloInfo?.esAnterior && (cicloInfo?.esActual || (cicloInfo?.esProximo && cicloInfo?.puedeConfigurarProximo));
                 if (puedeCrearAhora) {
                    const sources = await cronogramaConfigService.fetchValidSourceCycles(cicloSeleccionado);
                    setCiclosParaCopiar(sources);
                    setModoCreacion({ activo: true, empezarCero: sources.length === 0, copiarDesdeCicloId: sources[0] || null }); 
                 } else { setModoCreacion({ activo: false, copiarDesdeCicloId: null, empezarCero: false }); }
            } else { setModoCreacion({ activo: false, copiarDesdeCicloId: null, empezarCero: false }); }

        } catch (err) { /* ... manejo de error ... */ setError(err instanceof Error ? err.message : "Error al cargar plantilla."); setPlantillaCargada(null); setHitosEditados([]); setEstadoOriginal(null); } 
        finally { setIsLoadingPlantilla(false); }
    }, [cicloSeleccionado, cursoSeleccionado, ciclosDisponibles]);

    useEffect(() => { loadTemplate(); }, [loadTemplate]);

    // --- Estados Derivados (igual que antes) ---
    const estadoActual = plantillaCargada?.estadoInfo.estado || 'NO_CREADO';
    const esBorrador = estadoActual === 'BORRADOR';
    const esPublicado = estadoActual === 'PUBLICADO';
    const esArchivado = estadoActual === 'ARCHIVADO';
    const esNoCreado = estadoActual === 'NO_CREADO';
    const cicloSeleccionadoInfo = ciclosDisponibles.find(c => c.id === cicloSeleccionado);
    const esCicloEditable = esBorrador && !cicloSeleccionadoInfo?.esAnterior;
    const puedeCrear = esNoCreado && !cicloSeleccionadoInfo?.esAnterior && (cicloSeleccionadoInfo?.esActual || (cicloSeleccionadoInfo?.esProximo && cicloSeleccionadoInfo?.puedeConfigurarProximo));

    // --- Lógica Creación (igual que antes) ---
    const iniciarCreacion = useCallback(async () => { /* ... usa servicio, recarga con loadTemplate ... */ }, [/*...*/]);

    // --- Lógica CRUD Hitos (IMPLEMENTANDO addHito) ---
    const addHito = useCallback((nuevoHitoData: Omit<Hito, 'id' | 'orden'>) => {
        if (!esCicloEditable) return;
        setHitosEditados(prev => {
            // Asegurarse que prev es un array
            const currentHitos = Array.isArray(prev) ? prev : [];
            const maxOrden = currentHitos.reduce((max, h) => Math.max(max, h.orden), 0);
            const nuevoHito: Hito = {
                ...nuevoHitoData,
                // Generar ID único y significativo (ajustar según necesidad)
                id: `${cursoSeleccionado.toLowerCase()}-${cicloSeleccionado}-hito-${Date.now()}`, 
                orden: maxOrden + 1,
            };
            console.log("Adding new hito:", nuevoHito);
            // Devolver nuevo array ordenado
            return [...currentHitos, nuevoHito].sort((a,b) => a.orden - b.orden); 
        });
    }, [esCicloEditable, cursoSeleccionado, cicloSeleccionado]);

    const updateHito = useCallback((hitoActualizado: Hito) => {
         if (!esCicloEditable) return;
         setHitosEditados(prev => prev.map(h => h.id === hitoActualizado.id ? hitoActualizado : h));
    }, [esCicloEditable]);

    const deleteHito = useCallback((hitoId: string) => {
         if (!esCicloEditable) return;
         setHitosEditados(prev => {
            const filtered = prev.filter(h => h.id !== hitoId);
            // Reasignar orden secuencialmente
            return filtered.map((h, index) => ({ ...h, orden: index + 1 }));
         });
    }, [esCicloEditable]);

    const reorderHitos = useCallback((nuevosHitosOrdenados: Hito[]) => {
        if (!esCicloEditable) return;
        const hitosConNuevoOrden = nuevosHitosOrdenados.map((h, index) => ({ ...h, orden: index + 1 }));
        setHitosEditados(hitosConNuevoOrden);
    },[esCicloEditable]);

    // --- Lógica Guardar/Publicar (igual que antes) ---
    const saveDraft = useCallback(async (): Promise<boolean> => { /* ... */ return true; }, [/*...*/]);
    const publishSchedule = useCallback(async (): Promise<boolean> => { /* ... */ return true; }, [/*...*/]);

    // --- Retorno del Hook ---
    return {
        ciclosDisponibles, cicloSeleccionado, setCicloSeleccionado,
        cursoSeleccionado, setCursoSeleccionado,
        hitosActuales: hitosEditados, // Exponer el estado editable
        estadoActual,
        fechaPublicacion: plantillaCargada?.estadoInfo.fechaPublicacion || null,
        esBorrador, esPublicado, esArchivado, esNoCreado, esCicloEditable, puedeCrear,
        isLoadingCiclos: isLoadingCiclos,
        isLoading: isLoadingCiclos || isLoadingPlantilla, 
        isSaving, isPublishing, error,
        modoCreacion, setModoCreacion, ciclosParaCopiar, iniciarCreacion,
        // Acciones CRUD Hitos
        addHito, updateHito, deleteHito, reorderHitos, 
        // Acciones Guardar/Publicar
        saveDraft, publishSchedule,
    };
};