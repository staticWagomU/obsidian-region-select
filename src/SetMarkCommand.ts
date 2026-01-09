import type { Editor } from "obsidian";
import { MarkManager } from "./MarkManager";

export class SetMarkCommand {
	constructor(
		private markManager: MarkManager,
		private showNotice: (message: string) => void = () => {},
	) {}

	execute(editor: Editor): void {
		const position = editor.getCursor();
		this.markManager.setMark(position);
		this.showNotice(`マーク設定: 行 ${position.line}, 列 ${position.ch}`);
	}
}
