import { ViewPlugin, ViewUpdate, EditorView, DecorationSet } from "@codemirror/view";
import type { EditorPosition } from "obsidian";
import { MarkDecorator } from "./MarkDecorator";

/**
 * MarkViewPlugin manages the visual decoration for mark positions
 * It listens to mark changes and updates decorations accordingly
 */
class MarkViewPluginValue {
	decorations: DecorationSet;
	private decorator: MarkDecorator;
	private currentMark: EditorPosition | null = null;

	constructor(_view: EditorView) {
		this.decorator = new MarkDecorator();
		this.decorations = this.decorator.getDecorations();
	}

	update(_update: ViewUpdate) {
		// NOTE: This method intentionally does not handle ViewUpdate events
		// because mark decorations are managed externally through MarkManager events.
		//
		// Design rationale:
		// - Mark position is application state, not document state
		// - Updates are triggered by user commands (set-mark, clear-mark), not by document edits
		// - The MarkManager.onMarkChanged event handler calls setMark/clearMark explicitly
		// - This avoids unnecessary decoration recalculations on every document change
		//
		// For document-driven decorations, this method would need to:
		// 1. Check if the document changed (_update.docChanged)
		// 2. Recalculate decoration positions based on the new document
		// 3. Update this.decorations accordingly
	}

	setMark(position: EditorPosition, view: EditorView, showVisualIndicator: boolean = true) {
		this.currentMark = position;
		this.decorator.setMarkDecoration(position, view.state, showVisualIndicator);
		this.decorations = this.decorator.getDecorations();
	}

	clearMark() {
		this.currentMark = null;
		this.decorator.clearMarkDecoration();
		this.decorations = this.decorator.getDecorations();
	}

	destroy() {
		// Cleanup if needed
	}
}

export const createMarkViewPlugin = () => {
	return ViewPlugin.fromClass(MarkViewPluginValue, {
		decorations: v => v.decorations
	});
};

// Export a function to get the plugin value for external control
export const getMarkViewPlugin = (view: EditorView) => {
	// This assumes the plugin is registered with the view
	// We'll provide a way to access it from main.ts
	return view.plugin(createMarkViewPlugin());
};
