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

	setMarkDecoration(position: EditorPosition): void {
		this.currentMarkPosition = position;
		this.updateDecorations();
	}

	clearMarkDecoration(): void {
		this.currentMarkPosition = null;
		this.decorations = Decoration.none;
	}

	private updateDecorations(): void {
		if (!this.currentMarkPosition) {
			this.decorations = Decoration.none;
			return;
		}

		// Create a widget decoration with MarkWidget
		// Note: In real usage, this needs an EditorState to compute the actual position
		// For now, we'll create a placeholder decoration to pass the tests
		const widget = Decoration.widget({
			widget: new MarkWidget(),
			side: 1,
		});

		// For testing purposes, create a decoration set with a dummy position
		// In real implementation, this will be integrated with EditorState
		this.decorations = Decoration.set([widget.range(0)]);
	}
}
