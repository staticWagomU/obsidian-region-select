import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, RegionSelectSettings, RegionSelectSettingTab } from "./settings";

export default class RegionSelectPlugin extends Plugin {
	settings: RegionSelectSettings;

	async onload() {
		await this.loadSettings();

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
