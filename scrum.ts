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
      status: "ready",
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
      status: "draft",
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
      status: "draft",
    },
  ],

  sprint: {
    number: 1,
    pbi_id: "PBI-001",
    goal: "set-markコマンドを実装し、カーソル位置をマークとして保存できるようにする",
    status: "in_progress",
    subtasks: [
      {
        test: "MarkManagerがマーク位置を保存できることをテストする",
        implementation: "MarkManagerクラスにsetMark/getMarkメソッドを実装する",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "MarkManagerがマーク位置を取得できることをテストする",
        implementation: "getMarkがsetMarkで保存した位置を正確に返すことを確認する",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "set-markコマンドが現在のカーソル位置でMarkManager.setMarkを呼ぶことをテストする",
        implementation: "set-markコマンドを実装し、Editor.getCursorで取得した位置をMarkManagerに保存する",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "set-markコマンド実行時にNoticeで位置情報が表示されることをテストする",
        implementation: "set-markコマンドでNoticeを表示し、マーク位置（行・列）を通知する",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
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

  completed: [],

  retrospectives: [],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
