import { describe, it, expect, vi } from "vitest";
import { ClearMarkCommand } from "./ClearMarkCommand";
import { MarkManager } from "./MarkManager";

describe("ClearMarkCommand", () => {
	it("should call MarkManager.clearMark", () => {
		const markManager = new MarkManager();
		const clearMarkSpy = vi.spyOn(markManager, "clearMark");
		const command = new ClearMarkCommand(markManager);

		command.execute();

		expect(clearMarkSpy).toHaveBeenCalledOnce();
	});

	it("should display notice when mark is cleared", () => {
		const markManager = new MarkManager();
		const showNotice = vi.fn();
		const command = new ClearMarkCommand(markManager, showNotice);

		command.execute();

		expect(showNotice).toHaveBeenCalledWith("マークを解除しました");
	});
});
