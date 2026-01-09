import { MarkManager } from "./MarkManager";

export class ClearMarkCommand {
	constructor(
		private markManager: MarkManager,
		private showNotice: (message: string) => void = () => {},
	) {}

	execute(): void {
		this.markManager.clearMark();
		this.showNotice("マークを解除しました");
	}
}
