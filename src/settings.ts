import { App, PluginSettingTab, Setting } from "obsidian";
import type RegionSelectPlugin from "./main";

export interface RegionSelectSettings {
	showVisualIndicator: boolean;
}

export const DEFAULT_SETTINGS: RegionSelectSettings = {
	showVisualIndicator: true,
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
			.setName("Show visual indicator")
			.setDesc("Display a visual marker at the mark position")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showVisualIndicator)
					.onChange(async (value) => {
						this.plugin.settings.showVisualIndicator = value;
						await this.plugin.saveSettings();

						// Trigger mark decoration update to reflect the new setting immediately
						const currentMark = this.plugin.markManager.getMark();
						if (currentMark) {
							// Re-trigger the onMarkChanged callback to update decoration with new setting
							this.plugin.markManager.setMark(currentMark);
						}
					}),
			);
	}
}
