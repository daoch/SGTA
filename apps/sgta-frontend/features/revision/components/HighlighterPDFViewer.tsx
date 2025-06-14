// apps/sgta-frontend/features/jurado/components/HighlighterPdfViewer.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import type {
    Content,
    IHighlight,
    NewHighlight,
    ScaledPosition,
} from "react-pdf-highlighter";
import {
    AreaHighlight,
    Highlight,
    PdfHighlighter,
    PdfLoader,
    Popup
} from "react-pdf-highlighter";

import AppLoading from "@/components/loading/app-loading";
import { CustomTip } from "@/components/ui/customtip";
import { AlertTriangle, FileWarning, Quote } from "lucide-react";


const PRIMARY_PDF_URL = "https://example.com/primary.pdf";
const SECONDARY_PDF_URL = "https://example.com/secondary.pdf";

const testHighlights: Record<string, Array<IHighlight>> = {};

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
    document.location.hash.slice("#highlight-".length);

const resetHash = () => {
    document.location.hash = "";
};

const HighlightPopup = ({
    comment,
}: {
    comment: { text: string; emoji: string };
}) =>
    comment.text ? (
        <div className="Highlight__popup flex items-center gap-2">
            {getIconByName(comment.emoji)}
            <span>{comment.text}</span>
        </div>
    ) : null;

interface HighlighterPdfViewerProps {
    pdfUrl: string;
    onAddHighlight: (h: IHighlight) => void;
    onDeleteHighlight?: (id: string) => void; // Add delete handler prop
    onUpdateHighlight?: (h: IHighlight) => void; // Add update handler prop
    highlights: IHighlight[];
    scrollToHighlight?: IHighlight;
}
function getIconByName(name: string) {
    switch (name) {
        case "Contenido":
            return <FileWarning className="h-4 w-4 text-yellow-500" />;
        case "Similitud":
            return <AlertTriangle className="h-4 w-4 text-red-500" />;
        case "Citado":
            return <Quote className="h-4 w-4 text-blue-500" />;
        default:
            return null;
    }
}
type ScrollToHighlightFn = (highlight: IHighlight) => void;

const HighlighterPdfViewer: React.FC<HighlighterPdfViewerProps> = ({
    pdfUrl,
    onAddHighlight,
    onDeleteHighlight,
    onUpdateHighlight,
    highlights,
    scrollToHighlight,
}) => {
    const searchParams = new URLSearchParams(document.location.search);
    const initialUrl = searchParams.get("url") || "https://arxiv.org/pdf/2004.00001.pdf";

    const [url, setUrl] = useState(initialUrl);

    const scrollViewerTo = useRef<((highlight: IHighlight) => void) | null>(null);

    useEffect(() => {
        if (scrollToHighlight && scrollViewerTo.current) {
            console.log("Ejecutando scroll en el hijo a:", scrollToHighlight.id);
            scrollViewerTo.current(scrollToHighlight);
        }
    }, [scrollToHighlight]);


    const scrollToHighlightFromHash = useCallback(() => {
        const highlight = getHighlightById(parseIdFromHash());
        if (highlight) {
            if (scrollViewerTo.current) {
                scrollViewerTo.current(highlight);
            }
        }
    }, [highlights]); // Add highlights as dependency

    useEffect(() => {
        window.addEventListener("hashchange", scrollToHighlightFromHash, false);
        return () => {
            window.removeEventListener(
                "hashchange",
                scrollToHighlightFromHash,
                false,
            );
        };
    }, [scrollToHighlightFromHash]);

    const getHighlightById = (id: string) => {
        return highlights.find((highlight: IHighlight) => highlight.id === id);
    };

    const addHighlight = (highlight: NewHighlight) => {
        console.log("Saving highlight", highlight);
        const newHighlight = { ...highlight, id: getNextId() };
        onAddHighlight(newHighlight);
    };

    const updateHighlight = (
        highlightId: string,
        position: Partial<ScaledPosition>,
        content: Partial<Content>,
    ) => {
        console.log("Updating highlight", highlightId, position, content);
        const highlight = highlights.find(h => h.id === highlightId);
        if (highlight && onUpdateHighlight) {
            onUpdateHighlight({
                ...highlight,
                position: { ...highlight.position, ...position },
                content: { ...highlight.content, ...content },
            });
        }
    };
    const deleteHighlight = (highlightId: string) => {
        if (onDeleteHighlight) {
            onDeleteHighlight(highlightId);
        }
    };


    return (
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, border: "1px solid #e5e7eb" }}>
            <PdfLoader url={pdfUrl} beforeLoad={<AppLoading />}>
                {(pdfDocument) => (
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        enableAreaSelection={(event) => event.altKey}
                        onScrollChange={resetHash}
                        scrollRef={(scrollTo) => {
                            console.log("Guardando función de scroll en el hijo");
                            scrollViewerTo.current = scrollTo;
                        }}
                        onSelectionFinished={(
                            position,
                            content,
                            hideTipAndSelection,
                            transformSelection,
                        ) => (
                            <CustomTip
                                onOpen={transformSelection}
                                onConfirm={(comment) => {
                                    addHighlight({ content, position, comment });
                                    hideTipAndSelection();
                                }}
                            />
                        )}
                        highlightTransform={(
                            highlight,
                            index,
                            setTip,
                            hideTip,
                            viewportToScaled,
                            screenshot,
                            isScrolledTo,
                        ) => {
                            const isTextHighlight = !highlight.content?.image;

                            const component = isTextHighlight ? (
                                <Highlight
                                    isScrolledTo={isScrolledTo}
                                    position={highlight.position}
                                    comment={highlight.comment}
                                />
                            ) : (
                                <AreaHighlight
                                    isScrolledTo={isScrolledTo}
                                    highlight={highlight}
                                    onChange={(boundingRect) => {
                                        updateHighlight(
                                            highlight.id,
                                            { boundingRect: viewportToScaled(boundingRect) },
                                            { image: screenshot(boundingRect) },
                                        );
                                    }}
                                />
                            );

                            return (
                                <Popup
                                    popupContent={<HighlightPopup {...highlight} />}
                                    onMouseOver={(popupContent) =>
                                        setTip(highlight, (highlight) => popupContent)
                                    }
                                    onMouseOut={hideTip}
                                    key={index}
                                >
                                    {component}
                                </Popup>
                            );
                        }}
                        highlights={highlights}
                    />
                )}
            </PdfLoader>
        </div>
    );
};

export default HighlighterPdfViewer;
