import { describe, it, expect, vi, beforeEach } from "vitest";
import { SetMarkCommand } from "./SetMarkCommand";
import { MarkManager } from "./MarkManager";
import type { Editor, EditorPosition } from "obsidian";

describe("SetMarkCommand", () => {
	let mockEditor: Editor;
	let markManager: MarkManager;
	let setMarkCommand: SetMarkCommand;
	let mockShowNotice: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		markManager = new MarkManager();
		mockShowNotice = vi.fn();
		setMarkCommand = new SetMarkCommand(markManager, mockShowNotice);

		// Mock Editor
		mockEditor = {
			getCursor: vi.fn(),
		} as unknown as Editor;
	});

	it("should call MarkManager.setMark with current cursor position", () => {
		const cursorPosition: EditorPosition = { line: 10, ch: 5 };
		vi.spyOn(mockEditor, "getCursor").mockReturnValue(cursorPosition);
		const setMarkSpy = vi.spyOn(markManager, "setMark");

		setMarkCommand.execute(mockEditor);

		expect(mockEditor.getCursor).toHaveBeenCalled();
		expect(setMarkSpy).toHaveBeenCalledWith(cursorPosition);
	});

	it("should display Notice with mark position when mark is set", () => {
		const cursorPosition: EditorPosition = { line: 10, ch: 5 };
		vi.spyOn(mockEditor, "getCursor").mockReturnValue(cursorPosition);

		setMarkCommand.execute(mockEditor);

		expect(mockShowNotice).toHaveBeenCalledWith("マーク設定: 行 10, 列 5");
	});
});
