import { Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, RegionSelectSettings, RegionSelectSettingTab } from "./settings";
import { MarkManager } from "./MarkManager";
import { SetMarkCommand } from "./SetMarkCommand";

export default class RegionSelectPlugin extends Plugin {
	settings: RegionSelectSettings;
	private markManager: MarkManager;

	async onload() {
		await this.loadSettings();

		this.markManager = new MarkManager();

		this.addCommand({
			id: "set-mark",
			name: "Set mark at cursor",
			editorCallback: (editor) => {
				const command = new SetMarkCommand(
					this.markManager,
					(message: string) => new Notice(message)
				);
				command.execute(editor);
			},
		});

		this.addSettingTab(new RegionSelectSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<RegionSelectSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
