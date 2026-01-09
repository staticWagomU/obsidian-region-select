import { MarkManager } from "./MarkManager";

export class ClearMarkCommand {
	constructor(private markManager: MarkManager) {}

	execute(): void {
		this.markManager.clearMark();
	}
}
