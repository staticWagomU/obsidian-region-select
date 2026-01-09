import type { Editor } from "obsidian";
import { MarkManager } from "./MarkManager";

export class SetMarkCommand {
	constructor(private markManager: MarkManager) {}

	execute(editor: Editor): void {
		const position = editor.getCursor();
		this.markManager.setMark(position);
	}
}
