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
  // PBI-004 (toggle ribbon), PBI-005 (visual indicator), PBI-006 (toggle setting) - details in git history
  product_backlog: [],

  sprint: null,

  definition_of_done: {
    checks: [
      { name: "Tests pass", run: "pnpm test" },
      { name: "Type check passes", run: "pnpm run build" },
      { name: "Lint passes", run: "pnpm run lint" },
    ],
  },

  // Completed sprints (details in git history: sprint-N-<uuid> tags)
  completed: [
    { number: 6, pbi_id: "PBI-006", goal: "設定画面に視覚表示トグルを実装し、マーク位置インジケーターの表示/非表示を制御可能にする", status: "done", subtasks: [] },
    { number: 5, pbi_id: "PBI-005", goal: "マーク位置の視覚的インジケーターをCodeMirror 6 ViewPluginとDecorationで実装し、モバイルでも視認可能にする", status: "done", subtasks: [] },
    { number: 4, pbi_id: "PBI-004", goal: "リボンボタンでマーク設定/選択切り替え、視覚フィードバック、自動クリア実装", status: "done", subtasks: [] },
    { number: 3, pbi_id: "PBI-003", goal: "clear-markコマンド実装、全コマンドmain.ts統合", status: "done", subtasks: [] },
    { number: 2, pbi_id: "PBI-002", goal: "select-to-markコマンド実装、Sprint 1改善完了", status: "done", subtasks: [] },
    { number: 1, pbi_id: "PBI-001", goal: "set-markコマンド実装、カーソル位置保存", status: "done", subtasks: [] },
  ],

  // Active improvements only (completed: type-safe wrappers, ViewPlugin docs, README, main.ts integration tests, mySetting cleanup)
  retrospectives: [
    {
      sprint: 6,
      improvements: [
        { action: "未使用のmySetting設定項目を削除し、settings.tsをクリーンアップ", timing: "immediate", status: "completed", outcome: "Retrospective内で完了: RegionSelectSettingsからmySettingプロパティ削除、DEFAULT_SETTINGSとdisplay()メソッドを簡潔化" },
        { action: "MarkManager-MarkDecorator-MarkViewPlugin連携のE2Eテストを追加する", timing: "product", status: "active", outcome: null },
        { action: "Obsidian環境での統合テストを追加する", timing: "product", status: "active", outcome: null },
        { action: "プロジェクト完了後のメンテナンス体制を定義する", timing: "product", status: "active", outcome: null },
      ],
    },
    {
      sprint: 5,
      improvements: [
        { action: "main.tsの統合テストを追加する", timing: "sprint", status: "completed", outcome: "Sprint 6で完了: src/main.test.ts追加、アーキテクチャ契約を文書化" },
        { action: "MarkManager-MarkDecorator-MarkViewPlugin連携のE2Eテストを追加する", timing: "sprint", status: "completed", outcome: "Sprint 6 Retrospectiveでproductタイミングに変更し、Product Backlogへ移動" },
        { action: "Obsidian環境での統合テストを追加する", timing: "product", status: "active", outcome: null },
      ],
    },
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
