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
      status: "ready",
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
    number: 2,
    pbi_id: "PBI-002",
    goal: "select-to-markコマンドを実装し、マークから現在位置までのテキスト選択を可能にする。またSprint 1の改善アクションを完了する。",
    status: "in_progress",
    subtasks: [
      {
        test: "main.tsとsettings.tsのlintエラーがないことを確認する",
        implementation: "サンプルコードと未使用パラメータを削除してlintエラーを修正する",
        type: "structural",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "tsconfig.jsonがscrum.tsとvitest.config.tsを含むことを確認する",
        implementation: "tsconfig.jsonのinclude配列にscrum.tsとvitest.config.tsを追加する",
        type: "structural",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "SelectToMarkCommandがマーク未設定時にnullを扱えることをテストする",
        implementation: "SelectToMarkCommandクラスを作成し、MarkManager.getMarkがnullを返すケースを処理する",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "SelectToMarkCommandがマーク未設定時にエラー通知を表示することをテストする",
        implementation: "マークがnullの場合にNoticeで「マークが設定されていません」を表示する",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "SelectToMarkCommandがマークから現在位置までの範囲を計算できることをテストする",
        implementation: "MarkManagerから取得したマーク位置とEditor.getCursorで取得した現在位置から選択範囲を決定する",
        type: "behavioral",
        status: "pending",
        commits: [],
        notes: [],
      },
      {
        test: "SelectToMarkCommandがEditor.setSelectionを正しいanchor/headで呼ぶことをテストする",
        implementation: "計算した範囲でEditor.setSelectionを呼び出し、テキストを選択する",
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

  completed: [
    {
      number: 1,
      pbi_id: "PBI-001",
      goal: "set-markコマンドを実装し、カーソル位置をマークとして保存できるようにする",
      status: "done",
      subtasks: [
      {
        test: "MarkManagerがマーク位置を保存できることをテストする",
        implementation: "MarkManagerクラスにsetMark/getMarkメソッドを実装する",
        type: "behavioral",
        status: "completed",
        commits: [
          {
            hash: "e10dfc5",
            message: "feat: implement MarkManager with setMark/getMark methods",
            phase: "green",
          },
        ],
        notes: ["テストファイル作成: src/MarkManager.test.ts", "最小限の実装でテストパス", "リファクタリング不要: コードは既にシンプルで明確"],
      },
      {
        test: "MarkManagerがマーク位置を取得できることをテストする",
        implementation: "getMarkがsetMarkで保存した位置を正確に返すことを確認する",
        type: "behavioral",
        status: "completed",
        commits: [
          {
            hash: "e10dfc5",
            message: "feat: implement MarkManager with setMark/getMark methods",
            phase: "green",
          },
        ],
        notes: ["テストケース追加: 初期状態でnull、複数回の設定で正しく更新", "既存実装で全テストパス"],
      },
      {
        test: "set-markコマンドが現在のカーソル位置でMarkManager.setMarkを呼ぶことをテストする",
        implementation: "set-markコマンドを実装し、Editor.getCursorで取得した位置をMarkManagerに保存する",
        type: "behavioral",
        status: "completed",
        commits: [
          {
            hash: "8fe8202",
            message: "feat: implement SetMarkCommand to save cursor position",
            phase: "green",
          },
        ],
        notes: ["テストファイル作成: src/SetMarkCommand.test.ts", "モックを使ったコマンドテスト", "SetMarkCommand実装完了", "リファクタリング不要: コードはシンプルで明確"],
      },
      {
        test: "set-markコマンド実行時にNoticeで位置情報が表示されることをテストする",
        implementation: "set-markコマンドでNoticeを表示し、マーク位置（行・列）を通知する",
        type: "behavioral",
        status: "completed",
        commits: [
          {
            hash: "73f23a8",
            message: "feat: add Notice display to SetMarkCommand",
            phase: "green",
          },
        ],
        notes: ["テスト追加: Notice表示の検証", "依存性注入パターンでshowNotice関数を注入", "Notice機能実装完了", "リファクタリング不要: 依存性注入で綺麗に実装済"],
      },
    ],
  },
  ],

  retrospectives: [
    {
      sprint: 1,
      improvements: [
        {
          action: "Lintエラーを修正する（main.ts, settings.tsのサンプルコード削除、未使用パラメータの修正）",
          timing: "sprint",
          status: "active",
          outcome: null,
        },
        {
          action: "tsconfig.jsonにscrum.tsとvitest.config.tsを追加する",
          timing: "sprint",
          status: "active",
          outcome: null,
        },
      ],
    },
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
