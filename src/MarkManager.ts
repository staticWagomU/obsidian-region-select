import type { EditorPosition } from "obsidian";

export class MarkManager {
	private mark: EditorPosition | null = null;

	setMark(position: EditorPosition): void {
		this.mark = position;
	}

	getMark(): EditorPosition | null {
		return this.mark;
	}

	clearMark(): void {
		this.mark = null;
	}

	hasMark(): boolean {
		return this.mark !== null;
	}
}
