import { describe, it, expect } from "vitest";
import { MarkManager } from "./MarkManager";
import type { EditorPosition } from "obsidian";

describe("MarkManager", () => {
	it("should store mark position", () => {
		const manager = new MarkManager();
		const position: EditorPosition = { line: 5, ch: 10 };
		
		manager.setMark(position);
		const storedPosition = manager.getMark();
		
		expect(storedPosition).toEqual(position);
	});
});
