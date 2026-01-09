import { App, PluginSettingTab, Setting } from "obsidian";
import type RegionSelectPlugin from "./main";

export interface RegionSelectSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: RegionSelectSettings = {
	mySetting: "default",
};

export class RegionSelectSettingTab extends PluginSettingTab {
	plugin: RegionSelectPlugin;

	constructor(app: App, plugin: RegionSelectPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Settings #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
