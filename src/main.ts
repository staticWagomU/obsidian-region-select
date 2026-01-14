import { Notice, Plugin, MarkdownView, setIcon, Editor } from "obsidian";
import { EditorView } from "@codemirror/view";
import type { EditorPosition } from "obsidian";
import { DEFAULT_SETTINGS, RegionSelectSettings, RegionSelectSettingTab } from "./settings";
import { MarkManager } from "./MarkManager";
import { SetMarkCommand } from "./SetMarkCommand";
import { SelectToMarkCommand } from "./SelectToMarkCommand";
import { ClearMarkCommand } from "./ClearMarkCommand";
import { ToggleMarkRibbon } from "./ToggleMarkRibbon";
import { createMarkViewPlugin } from "./MarkViewPlugin";

/**
 * Type-safe wrapper to access CodeMirror 6 EditorView from Obsidian Editor
 * Obsidian's Editor interface doesn't expose the underlying CodeMirror view,
 * so we need to access it via 'cm' property which is implementation detail.
 */
function getEditorView(editor: Editor): EditorView | null {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
	return (editor as any).cm as EditorView | null;
}

/**
 * Type-safe wrapper to update mark decoration in the ViewPlugin
 * This encapsulates the unsafe plugin access pattern in one place.
 */
function updateMarkDecoration(
	editorView: EditorView,
	markViewPlugin: ReturnType<typeof createMarkViewPlugin>,
	position: EditorPosition | null,
	showVisualIndicator: boolean = true
): void {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
	const plugin = editorView.plugin(markViewPlugin);
	if (plugin) {
		if (position) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			plugin.setMark(position, editorView, showVisualIndicator);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			plugin.clearMark();
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		editorView.update([]);
	}
}

export default class RegionSelectPlugin extends Plugin {
	settings: RegionSelectSettings;
	private markManager: MarkManager;
	private ribbonIcon: HTMLElement | null = null;
	private markViewPlugin = createMarkViewPlugin();

	async onload() {
		await this.loadSettings();

		this.markManager = new MarkManager();

		// Register CodeMirror 6 ViewPlugin for mark decorations
		this.registerEditorExtension(this.markViewPlugin);

		// Connect MarkManager events to ViewPlugin updates
		this.markManager.onMarkChanged((position) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view?.editor) {
				const editorView = getEditorView(view.editor);
				if (editorView) {
					updateMarkDecoration(editorView, this.markViewPlugin, position, this.settings.showVisualIndicator);
				}
			}
		});

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
			icon: "map-pin",
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
			icon: "text-select",
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
			icon: "x",
			callback: () => {
				const command = new ClearMarkCommand(
					this.markManager,
					(message: string) => new Notice(message)
				);
				command.execute();
			},
		});

		this.addCommand({
			id: "toggle-mark",
			name: "Toggle mark",
			icon: "locate",
			editorCallback: (editor) => {
				const toggle = new ToggleMarkRibbon(
					this.markManager,
					(message: string) => new Notice(message),
					(icon: string) => {
						if (this.ribbonIcon) {
							setIcon(this.ribbonIcon, icon);
						}
					}
				);
				toggle.onClick(editor);
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
