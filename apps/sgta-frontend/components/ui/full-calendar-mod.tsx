"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import {
  Locale,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInMinutes,
  format,
  getMonth,
  isSameDay,
  isSameHour,
  isSameMonth,
  isToday,
  setHours,
  setMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import {
  ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { es } from "date-fns/locale/es"; // Opcional: para mostrar la fecha en español

import {
  EditarReunionModal,
  type ReunionFormData,
} from "@/features/cronograma/editar-reunion-modal";

type TipoEvento = "ENTREGABLE" | "REUNION" | "EXPOSICION";

const monthEventVariants = cva("size-2 rounded-full", {
  variants: {
    variant: {
      default: "bg-primary",
      blue: "bg-blue-500",
      green: "bg-green-500",
      pink: "bg-pink-500",
      purple: "bg-purple-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const dayEventVariants = cva("font-bold border-l-4 rounded p-2 text-xs", {
  variants: {
    variant: {
      default: "bg-muted/30 text-muted-foreground border-muted",
      blue: "bg-blue-500/30 text-black border-blue-500 border-l-0", // Quitamos border-t-2 de aquí
      green: "bg-green-500/30 text-black border-green-500",
      pink: "bg-pink-500/30 text-black border-pink-500",
      purple: "bg-purple-500/30 text-purple-600 border-purple-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type View = "day" | "week" | "month" | "year";

type ContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  locale: Locale;
  setEvents: (date: CalendarEvent[]) => void;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  enableHotkeys?: boolean;
  today: Date;
  numTesistas: number; // <-- Nuevo
};

const Context = createContext<ContextType>({} as ContextType);

// 1. Primero, actualiza el tipo CalendarEvent (si no está ya extendido)
type CalendarEvent = {
  id: string;
  start?: Date;
  end: Date;
  title: string;
  type?: string;
  description?: string;  // <-- Añade esto
  tesista?: string;
  color?: VariantProps<typeof monthEventVariants>["variant"];
};

type CalendarProps = {
  children: ReactNode;
  defaultDate?: Date;
  events?: CalendarEvent[];
  view?: View;
  locale?: Locale;
  enableHotkeys?: boolean;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  numTesistas?: number; // <-- Nuevo
  tipoUsuario: string;
};  

const Calendar = ({
  children,
  defaultDate = new Date(),
  locale = enUS,
  enableHotkeys = true,
  view: _defaultMode = "month",
  onEventClick,
  events: defaultEvents = [],
  onChangeView,
  numTesistas = 1,
}: CalendarProps) => {
  const [view, setView] = useState<View>(_defaultMode);
  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);

  useEffect(() => {
    setEvents(defaultEvents);
  }, [defaultEvents]);

  const changeView = (view: View) => {
    setView(view);
    onChangeView?.(view);
  };

  useHotkeys("m", () => changeView("month"), {
    enabled: enableHotkeys,
  });

  useHotkeys("w", () => changeView("week"), {
    enabled: enableHotkeys,
  });

  useHotkeys("y", () => changeView("year"), {
    enabled: enableHotkeys,
  });

  useHotkeys("d", () => changeView("day"), {
    enabled: enableHotkeys,
  });

  return (
    <Context.Provider
      value={{
        view,
        setView,
        date,
        setDate,
        events,
        setEvents,
        locale,
        enableHotkeys,
        onEventClick,
        onChangeView,
        today: new Date(),
        numTesistas,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCalendar = () => useContext(Context);

const CalendarViewTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    view: View;
  }
>(({ children, view, ...props }) => {
  const { view: currentView, setView, onChangeView } = useCalendar();

  return (
    <Button
      aria-current={currentView === view}
      size="sm"
      variant="ghost"
      {...props}
      onClick={() => {
        setView(view);
        onChangeView?.(view);
      }}
    >
      {children}
    </Button>
  );
});
CalendarViewTrigger.displayName = "CalendarViewTrigger";

// 2. Luego modifica el componente EventGroup:
const EventGroup = ({
  events,
  hour,
  tipoVista,
  tipoUsuario,
}: {
  events: CalendarEvent[];
  hour: Date;
  tipoVista: string;
  tipoUsuario: string;
}) => {
  const { numTesistas } = useContext(Context);

  const [isReunionModalOpen, setIsReunionModalOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<CalendarEvent | null>(null);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "REUNION":
        return "bg-green-300 text-green-800";
      case "ENTREGABLE":
        return "bg-blue-300 text-blue-800";
      case "EXPOSICION":
        return "bg-pink-300 text-pink-800";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  const tesistasOrdenados = useMemo(() => {
    const setTesistas = new Set<string>();
    events.forEach((e) => {
      if (e.tesista) setTesistas.add(e.tesista);
    });
    return Array.from(setTesistas).sort();
  }, [events]);

  return (
    <div
      className="h-20 border-t last:border-b grid gap-x-2 items-start"
      style={{
        gridTemplateColumns: `repeat(${numTesistas}, minmax(0, 1fr))`,
      }}
    >
      {tesistasOrdenados.map((tesista, index) => {
        const eventos = events.filter(
          (event) =>
            isSameHour(event.start ?? event.end, hour) &&
            event.tesista === tesista
        );

        return (
          <div key={tesista} className={`h-full relative col-start-${index + 1}`}>
            {eventos.map((event) => {
              const isDeadline = event.type === "ENTREGABLE";
              const isClickable = tipoUsuario === "Alumno" && event.type === "REUNION";
              const hoursDifference = isDeadline
                ? 1
                : differenceInMinutes(event.end, event.start ?? event.end) / 60;
              const startPosition = (event.start?.getMinutes() ?? 0) / 60;

              return (
                <div
                  key={event.id}
                  className={cn(
                    "relative flex flex-col p-1 overflow-hidden",
                    dayEventVariants({ variant: event.color }),
                    isClickable && "cursor-pointer z-20",
                    isDeadline && "border-t-4 border-t-dashed"
                  )}
                  style={{
                    top: `${startPosition * 100}%`,
                    height: `${hoursDifference * 100}%`,
                  }}
                  onClick={() => {
                    if (isClickable) {
                      setEventoSeleccionado(event);
                      setIsReunionModalOpen(true);
                    }
                  }}
                >
                  {event.type && (
                    <span
                      className={cn(
                        "mx-2 text-[10px] font-semibold px-1 py-0.5 rounded w-fit cursor-inherit",
                        getTipoColor(event.type)
                      )}
                    >
                      {isDeadline && "⏰ "}
                      {event.type}
                    </span>
                  )}

                  <strong className="font-medium text-xs truncate cursor-inherit">
                    {event.title}
                  </strong>

                  {event.description &&
                    tipoVista !== "Semana" &&
                    tipoUsuario === "Alumno" && (
                      <p className="text-xs opacity-80 truncate cursor-inherit">
                        {event.description}
                      </p>
                    )}

                  {event.tesista !== "X" && (
                    <p className="text-xs opacity-80 truncate cursor-inherit">
                      Tsta.: {event.tesista}
                    </p>
                  )}

                  {!isDeadline ? (
                    <p className="text-xs opacity-80 truncate cursor-inherit">
                      {`${format(event.start!, "HH:mm")} - ${format(event.end, "HH:mm")}`}
                    </p>
                  ) : (
                    <p className="text-xs opacity-80 truncate cursor-inherit">
                      {`Fin: ${format(event.end, "HH:mm")}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {eventoSeleccionado && (
        <EditarReunionModal
          isOpen={isReunionModalOpen}
          onClose={() => {
            setIsReunionModalOpen(false);
            setEventoSeleccionado(null);
          }}
          onSubmit={async (_reunion) => {
            setIsReunionModalOpen(false);
            setEventoSeleccionado(null);
          }}
          evento={eventoSeleccionado}
        />
      )}
    </div>
  );
};





// Versión corregida de CalendarDayView (todo lo demás igual)
const CalendarDayView = ({ tipoUsuario }: { tipoUsuario: string }) => {

  const { view, events, date } = useCalendar();

  if (view !== "day") return null;

  const hours = [...Array(24)].map((_, i) => setHours(date, i));

  // Usamos la fecha del calendario (date) en lugar de new Date()
  const fechaActual = format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <div className="flex flex-col h-full">
      {/* Mostramos la fecha actual del calendario */}
      <div className="sticky top-0 z-10 bg-white py-2 px-6 border-b text-lg font-medium text-[#042354]">
        Día {fechaActual}
      </div>

      <div className="flex relative flex-1 overflow-auto">
        <TimeTable />
        <div className="flex-1 relative">
          {hours.map((hour) => (
            <EventGroup key={hour.toString()} hour={hour} events={events} tipoVista="Día" tipoUsuario={tipoUsuario}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const CalendarWeekView = ({ tipoUsuario }: { tipoUsuario: string }) => {
  const { view, date, locale, events } = useCalendar();

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const hours = [...Array(24)].map((_, i) => setHours(day, i));
      weekDates.push(hours);
    }

    return weekDates;
  }, [date]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const result = addDays(startOfWeek(date, { weekStartsOn: 0 }), i);
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date]);

  if (view !== "week") return null;

  return (
    <div className="flex flex-col relative overflow-auto h-full">
      <div className="flex sticky top-0 bg-card z-10 border-b mb-3">
        <div className="w-12"></div>
        {headerDays.map((date, i) => (
          <div
            key={date.toString()}
            className={cn(
              "text-center flex-1 gap-1 pb-2 text-sm text-muted-foreground flex items-center justify-center",
              [0, 6].includes(i) && "text-muted-foreground/50"
            )}
          >
            {format(date, "E", { locale })}
            <span
              className={cn(
                "h-6 grid place-content-center",
                isToday(date) &&
                  "bg-primary text-primary-foreground rounded-full size-6"
              )}
            >
              {format(date, "d")}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        <div className="w-fit">
          <TimeTable />
        </div>
        <div className="grid grid-cols-7 flex-1">
          {weekDates.map((hours, i) => {
            return (
              <div
                className={cn(
                  "h-full text-sm text-muted-foreground border-l first:border-l-0",
                  [0, 6].includes(i) && "bg-muted/50"
                )}
                key={format(hours[0], "yyyy-MM-dd")}
              >
                {hours.map((hour) => (
                  <EventGroup
                    key={hour.toString()}
                    hour={hour}
                    events={events}
                    tipoVista="Semana"
                    tipoUsuario={tipoUsuario}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CalendarMonthView = () => {
  const { date, view, events, locale } = useCalendar();

  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== "month") return null;

  // Formato modificado para mostrar solo mes y año
  const mesYAnioActual = format(date, "MMMM yyyy", { locale: es });

  return (
    <div className="h-full flex flex-col">
      {/* Mostramos la fecha actual del calendario */}
      <div className="sticky top-0 z-10 bg-white py-2 px-6 border-b text-lg font-medium text-[#042354]">
        Mes {mesYAnioActual}
      </div>

      <div className="grid grid-cols-7 gap-px sticky top-0 bg-background border-b">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              "mb-2 text-right text-sm text-muted-foreground pr-2",
              [0, 6].includes(i) && "text-muted-foreground/50"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid overflow-hidden -mt-px flex-1 auto-rows-fr p-px grid-cols-7 gap-px">
        {monthDates.map((_date) => {
          const currentEvents = events.filter((event) =>
            isSameDay(event.start ?? event.end, _date)
          );

          return (
            <div
              className={cn(
                "ring-1 p-2 text-sm text-muted-foreground ring-border overflow-auto",
                !isSameMonth(date, _date) && "text-muted-foreground/50"
              )}
              key={_date.toString()}
            >
              <span
                className={cn(
                  "size-6 grid place-items-center rounded-full mb-1 sticky top-0",
                  isToday(_date) && "bg-primary text-primary-foreground"
                )}
              >
                {format(_date, "d")}
              </span>

              {currentEvents.map((event) => {
                return (
                  <div
                    key={event.id}
                    className="px-1 rounded text-sm flex items-center gap-1"
                  >
                    <div
                      className={cn(
                        "shrink-0",
                        monthEventVariants({ variant: event.color })
                      )}
                    ></div>
                    <span className="flex-1 truncate">{event.title}</span>
                    <time className="tabular-nums text-muted-foreground/50 text-xs">
                      {format((event.type === "ENTREGABLE" ? event.end : event.start) ?? event.end, "HH:mm")}
                    </time>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CalendarYearView = () => {
  const { view, date, today, locale } = useCalendar();

  const months = useMemo(() => {
    if (!view) {
      return [];
    }

    return Array.from({ length: 12 }).map((_, i) => {
      return getDaysInMonth(setMonth(date, i));
    });
  }, [date, view]);

  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== "year") return null;

  return (
    <div className="grid grid-cols-4 gap-10 overflow-auto h-full">
      {months.map((days, i) => (
        <div key={days[0].toString()}>
          <span className="text-xl">{i + 1}</span>

          <div className="grid grid-cols-7 gap-2 my-5">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid gap-x-2 text-center grid-cols-7 text-xs tabular-nums">
            {days.map((_date) => {
              return (
                <div
                  key={_date.toString()}
                  className={cn(
                    getMonth(_date) !== i && "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "aspect-square grid place-content-center size-full tabular-nums",
                      isSameDay(today, _date) &&
                        getMonth(_date) === i &&
                        "bg-primary text-primary-foreground rounded-full"
                    )}
                  >
                    {format(_date, "d")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const CalendarNextTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const next = useCallback(() => {
    if (view === "day") {
      setDate(addDays(date, 1));
    } else if (view === "week") {
      setDate(addWeeks(date, 1));
    } else if (view === "month") {
      setDate(addMonths(date, 1));
    } else if (view === "year") {
      setDate(addYears(date, 1));
    }
  }, [date, view, setDate]);

  useHotkeys("ArrowRight", () => next(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        next();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarNextTrigger.displayName = "CalendarNextTrigger";

const CalendarPrevTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  useHotkeys("ArrowLeft", () => prev(), {
    enabled: enableHotkeys,
  });

  const prev = useCallback(() => {
    if (view === "day") {
      setDate(subDays(date, 1));
    } else if (view === "week") {
      setDate(subWeeks(date, 1));
    } else if (view === "month") {
      setDate(subMonths(date, 1));
    } else if (view === "year") {
      setDate(subYears(date, 1));
    }
  }, [date, view, setDate]);

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        prev();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarPrevTrigger.displayName = "CalendarPrevTrigger";

const CalendarTodayTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, enableHotkeys, today } = useCalendar();

  useHotkeys("t", () => jumpToToday(), {
    enabled: enableHotkeys,
  });

  const jumpToToday = useCallback(() => {
    setDate(today);
  }, [today, setDate]);

  return (
    <Button
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        jumpToToday();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarTodayTrigger.displayName = "CalendarTodayTrigger";

const CalendarCurrentDate = () => {
  const { date, view } = useCalendar();

  return (
    <time dateTime={date.toISOString()} className="tabular-nums">
      {format(date, view === "day" ? "dd MMMM yyyy" : "MMMM yyyy")}
    </time>
  );
};

const TimeTable = () => {
  const now = new Date();

  return (
    <div className="pr-2 w-12">
      {Array.from(Array(25).keys()).map((hour) => {
        return (
          <div
            className="text-right relative text-xs h-20 last:h-0"
            key={hour}
          >
            {now.getHours() === hour && (
              <div
                className="absolute z- left-full translate-x-2 w-dvw h-[2px] bg-red-500"
                style={{
                  top: `${(now.getMinutes() / 60) * 100}%`,
                }}
              >
                <div className="size-2 rounded-full bg-red-500 absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            )}
            <p className="top-0 -translate-y-1/2">
              {hour === 24 ? 0 : hour}:00
            </p>
          </div>
        );
      })}
    </div>
  );
};

const getDaysInMonth = (date: Date) => {
  const startOfMonthDate = startOfMonth(date);
  const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
    weekStartsOn: 0,
  });

  let currentDate = startOfWeekForMonth;
  const calendar = [];

  while (calendar.length < 42) {
    calendar.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return calendar;
};

const generateWeekdays = (locale: Locale) => {
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i);
    daysOfWeek.push(format(date, "EEEEEE", { locale }));
  }
  return daysOfWeek;
};

export {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
};
