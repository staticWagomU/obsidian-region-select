import type { Editor } from "obsidian";
import { MarkManager } from "./MarkManager";

export class SelectToMarkCommand {
	constructor(
		private markManager: MarkManager,
		private showNotice: (message: string) => void = () => {},
	) {}

	execute(editor: Editor): void {
		const mark = this.markManager.getMark();

		if (mark === null) {
			this.showNotice("マークが設定されていません");
			return;
		}

		const cursor = editor.getCursor();
		editor.setSelection(mark, cursor);
	}
}
