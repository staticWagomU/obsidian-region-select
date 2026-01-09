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
});
