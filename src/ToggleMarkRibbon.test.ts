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

	it("should execute SelectToMarkCommand when mark is set", () => {
		const manager = new MarkManager();
		manager.setMark({ line: 5, ch: 10 });

		const mockSetSelection = vi.fn();
		const mockEditor = {
			getCursor: vi.fn().mockReturnValue({ line: 10, ch: 20 }),
			setSelection: mockSetSelection,
		} as unknown as Editor;
		const mockShowNotice = vi.fn();
		const mockSetIcon = vi.fn();

		const ribbon = new ToggleMarkRibbon(manager, mockShowNotice, mockSetIcon);
		ribbon.onClick(mockEditor);

		expect(mockSetSelection).toHaveBeenCalledWith(
			{ line: 5, ch: 10 },
			{ line: 10, ch: 20 }
		);
	});

	it("should update icon after setting mark", () => {
		const manager = new MarkManager();
		const mockEditor = {
			getCursor: vi.fn().mockReturnValue({ line: 5, ch: 10 }),
		} as unknown as Editor;
		const mockShowNotice = vi.fn();
		const mockSetIcon = vi.fn();

		const ribbon = new ToggleMarkRibbon(manager, mockShowNotice, mockSetIcon);
		ribbon.onClick(mockEditor);

		expect(mockSetIcon).toHaveBeenCalledWith("target");
	});

	it("should clear mark after selecting to mark", () => {
		const manager = new MarkManager();
		manager.setMark({ line: 5, ch: 10 });

		const mockSetSelection = vi.fn();
		const mockEditor = {
			getCursor: vi.fn().mockReturnValue({ line: 10, ch: 20 }),
			setSelection: mockSetSelection,
		} as unknown as Editor;
		const mockShowNotice = vi.fn();
		const mockSetIcon = vi.fn();

		const ribbon = new ToggleMarkRibbon(manager, mockShowNotice, mockSetIcon);
		ribbon.onClick(mockEditor);

		expect(manager.hasMark()).toBe(false);
	});

	it("should reset icon after clearing mark", () => {
		const manager = new MarkManager();
		manager.setMark({ line: 5, ch: 10 });

		const mockSetSelection = vi.fn();
		const mockEditor = {
			getCursor: vi.fn().mockReturnValue({ line: 10, ch: 20 }),
			setSelection: mockSetSelection,
		} as unknown as Editor;
		const mockShowNotice = vi.fn();
		const mockSetIcon = vi.fn();

		const ribbon = new ToggleMarkRibbon(manager, mockShowNotice, mockSetIcon);
		ribbon.onClick(mockEditor);

		expect(mockSetIcon).toHaveBeenCalledWith("locate");
	});
});
