import { Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, RegionSelectSettings, RegionSelectSettingTab } from "./settings";
import { MarkManager } from "./MarkManager";
import { SetMarkCommand } from "./SetMarkCommand";
import { SelectToMarkCommand } from "./SelectToMarkCommand";
import { ClearMarkCommand } from "./ClearMarkCommand";

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

		this.addCommand({
			id: "select-to-mark",
			name: "Select from mark to cursor",
			editorCallback: (editor) => {
				const command = new SelectToMarkCommand(
					this.markManager,
					(message: string) => new Notice(message)
				);
				command.execute(editor);
			},
		});

		this.addCommand({
			id: "clear-mark",
			name: "Clear mark",
			callback: () => {
				const command = new ClearMarkCommand(
					this.markManager,
					(message: string) => new Notice(message)
				);
				command.execute();
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
