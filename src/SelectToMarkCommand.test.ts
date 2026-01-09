import { describe, it, expect, vi, beforeEach } from "vitest";
import { SelectToMarkCommand } from "./SelectToMarkCommand";
import { MarkManager } from "./MarkManager";
import type { Editor, EditorPosition } from "obsidian";

describe("SelectToMarkCommand", () => {
	let mockEditor: Editor;
	let markManager: MarkManager;
	let selectToMarkCommand: SelectToMarkCommand;
	let mockShowNotice: (message: string) => void;

	beforeEach(() => {
		markManager = new MarkManager();
		mockShowNotice = vi.fn() as (message: string) => void;
		selectToMarkCommand = new SelectToMarkCommand(markManager, mockShowNotice);

		// Mock Editor
		mockEditor = {
			getCursor: vi.fn(),
			setSelection: vi.fn(),
		} as unknown as Editor;
	});

	it("should handle null mark when mark is not set", () => {
		const getMarkSpy = vi.spyOn(markManager, "getMark").mockReturnValue(null);
		
		selectToMarkCommand.execute(mockEditor);

		expect(getMarkSpy).toHaveBeenCalled();
	});
});
