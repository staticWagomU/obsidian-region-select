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

	it("should return false when no mark is set", () => {
		const manager = new MarkManager();

		expect(manager.hasMark()).toBe(false);
	});

	it("should return true when mark is set", () => {
		const manager = new MarkManager();
		const position: EditorPosition = { line: 5, ch: 10 };

		manager.setMark(position);

		expect(manager.hasMark()).toBe(true);
	});

	it("should return false after clearing mark", () => {
		const manager = new MarkManager();
		const position: EditorPosition = { line: 5, ch: 10 };

		manager.setMark(position);
		manager.clearMark();

		expect(manager.hasMark()).toBe(false);
	});

	it("should notify listener when mark is set", () => {
		const manager = new MarkManager();
		const position: EditorPosition = { line: 5, ch: 10 };
		let callbackCalled = false;
		let receivedPosition: EditorPosition | null = null;

		manager.onMarkChanged((pos) => {
			callbackCalled = true;
			receivedPosition = pos;
		});

		manager.setMark(position);

		expect(callbackCalled).toBe(true);
		expect(receivedPosition).toEqual(position);
	});

	it("should notify listener when mark is cleared", () => {
		const manager = new MarkManager();
		const position: EditorPosition = { line: 5, ch: 10 };
		let clearCallbackCalled = false;

		manager.setMark(position);

		manager.onMarkChanged((pos) => {
			if (pos === null) {
				clearCallbackCalled = true;
			}
		});

		manager.clearMark();

		expect(clearCallbackCalled).toBe(true);
	});

	it("should support multiple listeners", () => {
		const manager = new MarkManager();
		const position: EditorPosition = { line: 5, ch: 10 };
		let listener1Called = false;
		let listener2Called = false;

		manager.onMarkChanged(() => {
			listener1Called = true;
		});

		manager.onMarkChanged(() => {
			listener2Called = true;
		});

		manager.setMark(position);

		expect(listener1Called).toBe(true);
		expect(listener2Called).toBe(true);
	});
});
