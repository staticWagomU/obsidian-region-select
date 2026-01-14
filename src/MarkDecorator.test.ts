import { describe, it, expect } from "vitest";
import { MarkDecorator } from "./MarkDecorator";
import type { EditorPosition } from "obsidian";

describe("MarkDecorator", () => {
	it("should create empty DecorationSet initially", () => {
		const decorator = new MarkDecorator();
		const decorations = decorator.getDecorations();
		
		expect(decorations).toBeDefined();
		expect(decorations.size).toBe(0);
	});

	it("should add decoration when mark is set", () => {
		const decorator = new MarkDecorator();
		const position: EditorPosition = { line: 5, ch: 10 };
		
		decorator.setMarkDecoration(position);
		const decorations = decorator.getDecorations();
		
		expect(decorations.size).toBeGreaterThan(0);
	});

	it("should clear decoration when clearMarkDecoration is called", () => {
		const decorator = new MarkDecorator();
		const position: EditorPosition = { line: 5, ch: 10 };
		
		decorator.setMarkDecoration(position);
		expect(decorator.getDecorations().size).toBeGreaterThan(0);
		
		decorator.clearMarkDecoration();
		expect(decorator.getDecorations().size).toBe(0);
	});

	it("should update decoration when mark position changes", () => {
		const decorator = new MarkDecorator();
		const position1: EditorPosition = { line: 3, ch: 7 };
		const position2: EditorPosition = { line: 10, ch: 15 };

		decorator.setMarkDecoration(position1);
		const decorations1 = decorator.getDecorations();

		decorator.setMarkDecoration(position2);
		const decorations2 = decorator.getDecorations();

		expect(decorations1).not.toBe(decorations2);
		expect(decorations2.size).toBeGreaterThan(0);
	});

	it("should create widget with correct CSS class", () => {
		const decorator = new MarkDecorator();
		const widget = decorator.createMarkWidget();
		const dom = widget.toDOM();

		expect(dom.className).toBe("region-select-mark");
	});

	it("should create widget with visual indicator text", () => {
		const decorator = new MarkDecorator();
		const widget = decorator.createMarkWidget();
		const dom = widget.toDOM();

		expect(dom.textContent).toBeTruthy();
		expect(dom.textContent?.length).toBeGreaterThan(0);
	});

	it("should create widget with inline styles for visibility", () => {
		const decorator = new MarkDecorator();
		const widget = decorator.createMarkWidget();
		const dom = widget.toDOM();

		// Check that the widget has style properties for mobile visibility
		expect(dom.style.cssText).toBeTruthy();
	});
});
