// ============================================================
// Type Definitions (DO NOT MODIFY - request human review for schema changes)
// ============================================================

// PBI lifecycle: draft (idea) -> refining (gathering info) -> ready (can start) -> done
type PBIStatus = "draft" | "refining" | "ready" | "done";

// Sprint lifecycle
type SprintStatus = "planning" | "in_progress" | "review" | "done" | "cancelled";

// TDD cycle: pending -> red (test written) -> green (impl done) -> refactoring -> completed
type SubtaskStatus = "pending" | "red" | "green" | "refactoring" | "completed";

// behavioral = changes observable behavior, structural = refactoring only
type SubtaskType = "behavioral" | "structural";

// Commits happen only after tests pass (green/refactoring), never on red
type CommitPhase = "green" | "refactoring";

// When to execute retrospective actions:
//   immediate: Apply within Retrospective (non-production code, single logical change)
//   sprint: Add as subtask to next sprint (process improvements)
//   product: Add as new PBI to Product Backlog (feature additions)
type ImprovementTiming = "immediate" | "sprint" | "product";

type ImprovementStatus = "active" | "completed" | "abandoned";

interface SuccessMetric {
  metric: string;
  target: string;
}

interface ProductGoal {
  statement: string;
  success_metrics: SuccessMetric[];
}

interface AcceptanceCriterion {
  criterion: string;
  verification: string;
}

interface UserStory {
  role: string;
  capability: string;
  benefit: string;
}

interface PBI {
  id: string;
  story: UserStory;
  acceptance_criteria: AcceptanceCriterion[];
  status: PBIStatus;
}

interface Commit {
  hash: string;
  message: string;
  phase: CommitPhase;
}

interface Subtask {
  test: string;
  implementation: string;
  type: SubtaskType;
  status: SubtaskStatus;
  commits: Commit[];
  notes: string[];
}

interface Sprint {
  number: number;
  pbi_id: string;
  goal: string;
  status: SprintStatus;
  subtasks: Subtask[];
}

interface DoDCheck {
  name: string;
  run: string;
}

interface DefinitionOfDone {
  checks: DoDCheck[];
}

interface Improvement {
  action: string;
  timing: ImprovementTiming;
  status: ImprovementStatus;
  outcome: string | null;
}

interface Retrospective {
  sprint: number;
  improvements: Improvement[];
}

interface ScrumDashboard {
  product_goal: ProductGoal;
  product_backlog: PBI[];
  sprint: Sprint | null;
  definition_of_done: DefinitionOfDone;
  completed: Sprint[];
  retrospectives: Retrospective[];
}

// ============================================================
// Dashboard Data (AI edits this section)
// ============================================================

const scrum: ScrumDashboard = {
  product_goal: {
    statement:
      "Obsidianのモバイル環境における範囲選択の操作性を、Emacsのマーク&ポイント方式で改善する",
    success_metrics: [
      {
        metric: "モバイルでの範囲選択成功率",
        target: "タッチ操作での選択が2ステップで100%成功",
      },
      {
        metric: "基本コマンド実装",
        target: "set-mark, select-to-mark, clear-markの3コマンドが動作",
      },
    ],
  },

  // Completed PBIs: PBI-001 (set-mark), PBI-002 (select-to-mark), PBI-003 (clear-mark),
  // PBI-004 (toggle ribbon), PBI-005 (visual indicator) - details in git history
  product_backlog: [
    {
      id: "PBI-006",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "設定画面でマーク位置の視覚表示のon/offを切り替えられる",
        benefit: "視覚表示が不要な場合はオフにして、好みに合わせた操作ができる",
      },
      acceptance_criteria: [
        { criterion: "プラグイン設定画面に視覚表示のトグル設定が存在する", verification: "設定タブにトグルスイッチが表示される" },
        { criterion: "設定がオフの場合、マーク設定時に視覚表示が行われない", verification: "設定オフ時にset-mark実行してもマーカー非表示" },
        { criterion: "設定がオンの場合、マーク設定時に視覚表示が行われる", verification: "設定オン時にset-mark実行でマーカー表示" },
        { criterion: "設定変更は即座に反映される（プラグイン再起動不要）", verification: "設定変更後、次のset-markで新設定が反映" },
        { criterion: "設定値は永続化される", verification: "Obsidian再起動後も設定値が保持" },
      ],
      status: "ready",
    },
  ],

  sprint: {
    number: 6,
    pbi_id: "PBI-006",
    goal: "設定画面に視覚表示トグルを実装し、マーク位置インジケーターの表示/非表示を制御可能にする",
    status: "review",
    subtasks: [
      {
        test: "RegionSelectSettingsにshowVisualIndicatorプロパティが追加され、デフォルト値がtrueである",
        implementation: "src/settings.ts: RegionSelectSettingsインターフェースにshowVisualIndicator: booleanを追加し、DEFAULT_SETTINGSでtrue設定",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "c98ccba", message: "test(settings): add showVisualIndicator property tests", phase: "green" }],
        notes: [],
      },
      {
        test: "RegionSelectSettingTabに視覚表示トグルが表示され、設定値の変更が即座に保存される",
        implementation: "src/settings.ts: display()メソッドに新しいSettingコンポーネント追加、addToggleでshowVisualIndicatorを操作",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "f0e970a", message: "feat(settings): add visual indicator toggle in settings tab", phase: "green" }],
        notes: [],
      },
      {
        test: "showVisualIndicatorがfalseの場合、MarkDecoratorが装飾を作成しない",
        implementation: "src/MarkDecorator.ts: setMarkDecoration/updateDecorationsにshowVisualIndicator引数追加、falseの場合は早期リターン",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "c68b51b", message: "feat(decorator): add showVisualIndicator parameter to control decoration", phase: "green" }],
        notes: [],
      },
      {
        test: "main.tsのupdateMarkDecorationが設定値を参照し、条件付きで装飾を更新する",
        implementation: "src/main.ts: updateMarkDecoration内でthis.settings.showVisualIndicatorを確認し、falseの場合は装飾しない",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "446055e", message: "feat(main): integrate showVisualIndicator setting with mark decoration", phase: "green" }],
        notes: [],
      },
      {
        test: "設定値の変更が既存のマーク表示に即座に反映される",
        implementation: "src/settings.ts: onChange内でmarkManager.onMarkChangedコールバックを手動トリガー、または設定変更時に現在のマーク状態を再適用",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "45c3a01", message: "feat(settings): immediately reflect toggle changes on existing marks", phase: "green" }],
        notes: [],
      },
      {
        test: "loadSettings/saveSettingsがshowVisualIndicator値を正しく永続化する",
        implementation: "既存のloadSettings/saveSettingsメカニズムが新プロパティを自動処理することを確認するテスト追加",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "f9fdd81", message: "test(settings): verify showVisualIndicator persistence", phase: "green" }],
        notes: [],
      },
      {
        test: "main.tsの統合テスト: MarkManager-MarkViewPlugin連携が正しく動作する",
        implementation: "tests/main.test.ts作成、onMarkChangedコールバックとupdateMarkDecorationの統合動作をテスト",
        type: "behavioral",
        status: "completed",
        commits: [{ hash: "0e05d8c", message: "test(main): add integration tests for MarkManager-MarkViewPlugin", phase: "green" }],
        notes: ["Sprint 5レトロスペクティブからの改善アクション"],
      },
    ],
  },

  definition_of_done: {
    checks: [
      { name: "Tests pass", run: "pnpm test" },
      { name: "Type check passes", run: "pnpm run build" },
      { name: "Lint passes", run: "pnpm run lint" },
    ],
  },

  // Completed sprints (details in git history: sprint-N-<uuid> tags)
  completed: [
    { number: 5, pbi_id: "PBI-005", goal: "マーク位置の視覚的インジケーターをCodeMirror 6 ViewPluginとDecorationで実装し、モバイルでも視認可能にする", status: "done", subtasks: [] },
    { number: 4, pbi_id: "PBI-004", goal: "リボンボタンでマーク設定/選択切り替え、視覚フィードバック、自動クリア実装", status: "done", subtasks: [] },
    { number: 3, pbi_id: "PBI-003", goal: "clear-markコマンド実装、全コマンドmain.ts統合", status: "done", subtasks: [] },
    { number: 2, pbi_id: "PBI-002", goal: "select-to-markコマンド実装、Sprint 1改善完了", status: "done", subtasks: [] },
    { number: 1, pbi_id: "PBI-001", goal: "set-markコマンド実装、カーソル位置保存", status: "done", subtasks: [] },
  ],

  // Active improvements only (completed: type-safe wrappers, ViewPlugin docs, README)
  retrospectives: [
    {
      sprint: 5,
      improvements: [
        { action: "main.tsの統合テストを追加する", timing: "sprint", status: "completed", outcome: "Sprint 6のサブタスクとして実装予定" },
        { action: "MarkManager-MarkDecorator-MarkViewPlugin連携のE2Eテストを追加する", timing: "sprint", status: "active", outcome: null },
        { action: "Obsidian環境での統合テストを追加する", timing: "product", status: "active", outcome: null },
      ],
    },
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
