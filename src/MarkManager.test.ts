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

	it("should return null when no mark is set", () => {
		const manager = new MarkManager();

		expect(manager.getMark()).toBeNull();
	});

	it("should retrieve mark position correctly after setting", () => {
		const manager = new MarkManager();
		const position1: EditorPosition = { line: 3, ch: 7 };
		const position2: EditorPosition = { line: 10, ch: 15 };

		manager.setMark(position1);
		expect(manager.getMark()).toEqual(position1);

		manager.setMark(position2);
		expect(manager.getMark()).toEqual(position2);
	});

	it("should clear mark position", () => {
		const manager = new MarkManager();
		const position: EditorPosition = { line: 5, ch: 10 };

		manager.setMark(position);
		expect(manager.getMark()).toEqual(position);

		manager.clearMark();
		expect(manager.getMark()).toBeNull();
	});
});
