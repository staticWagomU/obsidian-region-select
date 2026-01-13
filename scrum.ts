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

  product_backlog: [
    {
      id: "PBI-001",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "現在のカーソル位置をマーク（始点）として設定できる",
        benefit: "範囲選択の始点を正確に指定できる",
      },
      acceptance_criteria: [
        {
          criterion: "set-markコマンドでカーソル位置が保存される",
          verification: "コマンド実行後、マーク位置が正しく記録されていることを確認",
        },
        {
          criterion: "マーク設定時にNoticeで位置が表示される",
          verification: "「マーク設定: 行 N, 列 M」形式の通知が表示される",
        },
      ],
      status: "done",
    },
    {
      id: "PBI-002",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "保存したマークから現在位置までのテキストを選択できる",
        benefit: "ドラッグ操作なしで正確な範囲選択ができる",
      },
      acceptance_criteria: [
        {
          criterion: "select-to-markコマンドでマークから現在位置までが選択される",
          verification: "Editor.setSelectionが正しいanchor/headで呼ばれる",
        },
        {
          criterion: "マーク未設定時はエラー通知が表示される",
          verification: "「マークが設定されていません」通知が表示される",
        },
      ],
      status: "done",
    },
    {
      id: "PBI-003",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "設定したマークをクリアできる",
        benefit: "不要なマークを解除して新しい選択を開始できる",
      },
      acceptance_criteria: [
        {
          criterion: "clear-markコマンドでマークが解除される",
          verification: "マーク解除後、getMarkがnullを返す",
        },
        {
          criterion: "マーク解除時にNoticeで確認が表示される",
          verification: "「マークを解除しました」通知が表示される",
        },
      ],
      status: "done",
    },
    {
      id: "PBI-004",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "リボンボタン1つでマーク設定と選択を切り替えられる",
        benefit: "ワンタップで直感的に範囲選択操作ができる",
      },
      acceptance_criteria: [
        {
          criterion: "リボンボタンタップでマーク未設定時はSet Mark、設定済みはSelect to Markが実行される",
          verification: "マーク状態に応じて適切なコマンドが呼ばれることを確認",
        },
        {
          criterion: "マーク設定中はリボンアイコンが変化する",
          verification: "setIcon呼び出しでアイコンが更新されることを確認",
        },
        {
          criterion: "Select to Mark実行後にマークが自動クリアされる",
          verification: "選択実行後、getMarkがnullを返しアイコンがリセットされることを確認",
        },
        {
          criterion: "ファイル切り替え時にマークが自動クリアされる",
          verification: "file-openイベントでclearMarkが呼ばれアイコンがリセットされることを確認",
        },
      ],
      status: "done",
    },
    {
      id: "PBI-005",
      story: {
        role: "Obsidianモバイルユーザー",
        capability: "マークを設定した位置がエディタ上で視覚的に確認できる",
        benefit: "選択範囲の始点がどこか一目で分かり、操作ミスを防げる",
      },
      acceptance_criteria: [
        {
          criterion: "マーク設定時にエディタ上でマーク位置が視覚的に表示される",
          verification: "set-mark実行後、マーク位置にハイライトやマーカーが表示されることを確認",
        },
        {
          criterion: "マーク解除時に視覚的表示が消える",
          verification: "clear-mark実行後、マーカー表示が削除されることを確認",
        },
        {
          criterion: "ファイル切り替え時に視覚的表示が消える",
          verification: "file-openイベント発火後、マーカー表示が削除されることを確認",
        },
        {
          criterion: "Select to Mark実行後に視覚的表示が消える",
          verification: "選択実行後、マーカー表示が削除されることを確認",
        },
      ],
      status: "draft",
    },
  ],

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
    { number: 4, pbi_id: "PBI-004", goal: "リボンボタンでマーク設定/選択切り替え、視覚フィードバック、自動クリア実装", status: "done", subtasks: [] },
    { number: 3, pbi_id: "PBI-003", goal: "clear-markコマンド実装、全コマンドmain.ts統合", status: "done", subtasks: [] },
    { number: 2, pbi_id: "PBI-002", goal: "select-to-markコマンド実装、Sprint 1改善完了", status: "done", subtasks: [] },
    { number: 1, pbi_id: "PBI-001", goal: "set-markコマンド実装、カーソル位置保存", status: "done", subtasks: [] },
  ],

  // Only keep active improvements (completed ones archived in git history)
  retrospectives: [
    {
      sprint: 4,
      improvements: [
        { action: "main.tsの統合テストを追加する", timing: "sprint", status: "active", outcome: null },
        { action: "Obsidian環境での統合テストを追加する", timing: "product", status: "active", outcome: null },
        { action: "ユーザードキュメントを作成する", timing: "product", status: "active", outcome: null },
      ],
    },
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
