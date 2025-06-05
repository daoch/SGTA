export interface ScaledDto {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    pageNumber?: number | null;
}

export interface PositionDto {
    boundingRect: ScaledDto;
    rects: ScaledDto[];
    pageNumber: number;
    usePdfCoordinates?: boolean | null;
}

export interface ContentDto {
    text?: string | null;
    image?: string | null;
}

export interface CommentDto {
    text: string;
    emoji: string;
}

export interface HighlightDto {
    id: string;
    position: PositionDto;
    content: ContentDto;
    comment: CommentDto;
}