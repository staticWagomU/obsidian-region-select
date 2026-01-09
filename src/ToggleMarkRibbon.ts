import type { Editor } from "obsidian";
import { MarkManager } from "./MarkManager";
import { SetMarkCommand } from "./SetMarkCommand";

export class ToggleMarkRibbon {
	constructor(
		private markManager: MarkManager,
		private showNotice: (message: string) => void,
		private setIcon: (icon: string) => void,
	) {}

	onClick(editor: Editor): void {
		if (!this.markManager.hasMark()) {
			const setMarkCommand = new SetMarkCommand(this.markManager, this.showNotice);
			setMarkCommand.execute(editor);
		}
	}
}
