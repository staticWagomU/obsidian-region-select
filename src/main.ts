import { Notice, Plugin, MarkdownView, setIcon } from "obsidian";
import { DEFAULT_SETTINGS, RegionSelectSettings, RegionSelectSettingTab } from "./settings";
import { MarkManager } from "./MarkManager";
import { SetMarkCommand } from "./SetMarkCommand";
import { SelectToMarkCommand } from "./SelectToMarkCommand";
import { ClearMarkCommand } from "./ClearMarkCommand";
import { ToggleMarkRibbon } from "./ToggleMarkRibbon";

export default class RegionSelectPlugin extends Plugin {
	settings: RegionSelectSettings;
	private markManager: MarkManager;
	private ribbonIcon: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();

		this.markManager = new MarkManager();

		// Add ribbon icon for toggle mark
		this.ribbonIcon = this.addRibbonIcon("locate", "Toggle mark", () => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view?.editor) {
				const ribbon = new ToggleMarkRibbon(
					this.markManager,
					(message: string) => new Notice(message),
					(icon: string) => {
						if (this.ribbonIcon) {
							setIcon(this.ribbonIcon, icon);
						}
					}
				);
				ribbon.onClick(view.editor);
			}
		});

		// Clear mark and reset icon on file-open
		this.registerEvent(
			this.app.workspace.on("file-open", () => {
				this.markManager.clearMark();
				if (this.ribbonIcon) {
					setIcon(this.ribbonIcon, "locate");
				}
			})
		);

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
