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
		// Decorations are updated through setMark/clearMark methods
		// called from the plugin's external API
	}

	setMark(position: EditorPosition, view: EditorView) {
		this.currentMark = position;
		this.decorator.setMarkDecoration(position, view.state);
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
