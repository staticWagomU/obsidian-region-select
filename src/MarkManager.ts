import type { EditorPosition } from "obsidian";

type MarkChangedListener = (position: EditorPosition | null) => void;

export class MarkManager {
	private mark: EditorPosition | null = null;
	private listeners: MarkChangedListener[] = [];

	setMark(position: EditorPosition): void {
		this.mark = position;
		this.notifyListeners(position);
	}

	getMark(): EditorPosition | null {
		return this.mark;
	}

	clearMark(): void {
		this.mark = null;
		this.notifyListeners(null);
	}

	hasMark(): boolean {
		return this.mark !== null;
	}

	onMarkChanged(listener: MarkChangedListener): void {
		this.listeners.push(listener);
	}

	private notifyListeners(position: EditorPosition | null): void {
		for (const listener of this.listeners) {
			listener(position);
		}
	}
}
