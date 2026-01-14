import { Decoration, DecorationSet, WidgetType } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import type { EditorPosition } from "obsidian";

class MarkWidget extends WidgetType {
	toDOM(): HTMLElement {
		const span = document.createElement("span");
		span.className = "region-select-mark";
		span.textContent = "▶";
		// Mobile-friendly inline styles for high visibility
		span.style.cssText = `
			color: var(--interactive-accent);
			font-weight: bold;
			font-size: 1.2em;
			margin-left: -0.5ch;
			position: relative;
			z-index: 1;
		`;
		return span;
	}
}

export class MarkDecorator {
	private decorations: DecorationSet = Decoration.none;
	private currentMarkPosition: EditorPosition | null = null;

	getDecorations(): DecorationSet {
		return this.decorations;
	}

	createMarkWidget(): MarkWidget {
		return new MarkWidget();
	}

	setMarkDecoration(position: EditorPosition, state?: EditorState): void {
		this.currentMarkPosition = position;
		this.updateDecorations(state);
	}

	clearMarkDecoration(): void {
		this.currentMarkPosition = null;
		this.decorations = Decoration.none;
	}

	private updateDecorations(state?: EditorState): void {
		if (!this.currentMarkPosition) {
			this.decorations = Decoration.none;
			return;
		}

		// Create a widget decoration with MarkWidget
		const widget = Decoration.widget({
			widget: new MarkWidget(),
			side: 1,
		});

		// If state is provided, compute actual position from EditorPosition
		if (state) {
			const { line, ch } = this.currentMarkPosition;
			const doc = state.doc;

			// EditorPosition is 0-based for line, convert to CodeMirror offset
			if (line < doc.lines) {
				const lineObj = doc.line(line + 1); // CodeMirror lines are 1-based
				const offset = Math.min(lineObj.from + ch, lineObj.to);
				this.decorations = Decoration.set([widget.range(offset)]);
			} else {
				this.decorations = Decoration.none;
			}
		} else {
			// For testing purposes without state
			this.decorations = Decoration.set([widget.range(0)]);
		}
	}
}
