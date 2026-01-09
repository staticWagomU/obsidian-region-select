import { describe, it, expect, vi } from "vitest";
import type { Editor } from "obsidian";
import { MarkManager } from "./MarkManager";
import { ToggleMarkRibbon } from "./ToggleMarkRibbon";

describe("ToggleMarkRibbon", () => {
	it("should execute SetMarkCommand when mark is not set", () => {
		const manager = new MarkManager();
		const mockEditor = {
			getCursor: vi.fn().mockReturnValue({ line: 5, ch: 10 }),
		} as unknown as Editor;
		const mockShowNotice = vi.fn();
		const mockSetIcon = vi.fn();

		const ribbon = new ToggleMarkRibbon(manager, mockShowNotice, mockSetIcon);
		ribbon.onClick(mockEditor);

		expect(manager.hasMark()).toBe(true);
		expect(manager.getMark()).toEqual({ line: 5, ch: 10 });
	});
});
