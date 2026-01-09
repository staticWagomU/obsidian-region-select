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
  ],

  sprint: null,

  definition_of_done: {
    checks: [
      { name: "Tests pass", run: "pnpm test" },
      { name: "Type check passes", run: "pnpm run build" },
      { name: "Lint passes", run: "pnpm run lint" },
    ],
  },

  completed: [
    {
      number: 4,
      pbi_id: "PBI-004",
      goal: "リボンボタンでマーク設定と選択を切り替え可能にし、マーク状態の視覚フィードバックと自動クリア機能を実装する",
      status: "done",
      subtasks: [
        {
          test: "MarkManagerがマーク状態を判定できることをテストする",
          implementation: "MarkManagerにhasMarkメソッドを実装し、マークの有無をbooleanで返す",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "3da084b",
              message: "feat: implement MarkManager.hasMark() method",
              phase: "green",
            },
          ],
          notes: ["hasMarkメソッド追加", "テストケース3件追加", "リファクタリング不要: シンプルな実装"],
        },
        {
          test: "ToggleMarkRibbonがマーク未設定時にSetMarkCommandを実行することをテストする",
          implementation: "ToggleMarkRibbonクラスを作成し、hasMarkがfalseの時にSetMarkCommandを実行する",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "c520439",
              message: "feat: create ToggleMarkRibbon class with SetMarkCommand execution",
              phase: "green",
            },
          ],
          notes: ["ToggleMarkRibbonクラス作成", "onClickメソッドで条件分岐", "リファクタリング不要: シンプルな実装"],
        },
        {
          test: "ToggleMarkRibbonがマーク設定済み時にSelectToMarkCommandを実行することをテストする",
          implementation: "hasMarkがtrueの時にSelectToMarkCommandを実行する",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "fb87546",
              message: "feat: add SelectToMarkCommand execution to ToggleMarkRibbon",
              phase: "green",
            },
          ],
          notes: ["else節でSelectToMarkCommand実行", "テストケース追加", "リファクタリング不要: シンプルな実装"],
        },
        {
          test: "ToggleMarkRibbonがマーク設定後にアイコンを更新することをテストする",
          implementation: "SetMarkCommand実行後にsetIconを呼び出してアイコンを変更する",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "75a6e53",
              message: "feat: add icon update and mark clear to ToggleMarkRibbon",
              phase: "green",
            },
          ],
          notes: ["setIcon('target')でアイコン更新", "視覚フィードバック実装", "リファクタリング不要"],
        },
        {
          test: "ToggleMarkRibbonがSelect to Mark実行後にマークをクリアすることをテストする",
          implementation: "SelectToMarkCommand実行後にclearMarkを呼び出す",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "75a6e53",
              message: "feat: add icon update and mark clear to ToggleMarkRibbon",
              phase: "green",
            },
          ],
          notes: ["clearMarkで自動クリア", "選択後に新しい操作開始可能", "リファクタリング不要"],
        },
        {
          test: "ToggleMarkRibbonがマーククリア後にアイコンをリセットすることをテストする",
          implementation: "clearMark後にsetIconを呼び出して初期アイコンに戻す",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "75a6e53",
              message: "feat: add icon update and mark clear to ToggleMarkRibbon",
              phase: "green",
            },
          ],
          notes: ["setIcon('locate')でリセット", "視覚的に状態をフィードバック", "リファクタリング不要"],
        },
        {
          test: "RegionSelectPluginがfile-openイベントでマークをクリアすることをテストする",
          implementation: "main.tsでfile-openイベントリスナーを登録し、clearMarkを呼び出す",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "35db092",
              message: "feat: integrate ToggleMarkRibbon into RegionSelectPlugin",
              phase: "green",
            },
          ],
          notes: ["file-openイベントでclearMark呼び出し", "ファイル切り替え時に自動クリア", "リファクタリング不要"],
        },
        {
          test: "RegionSelectPluginがfile-openイベントでリボンアイコンをリセットすることをテストする",
          implementation: "file-openイベントでリボンボタンのsetIconを呼び出して初期アイコンに戻す",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "35db092",
              message: "feat: integrate ToggleMarkRibbon into RegionSelectPlugin",
              phase: "green",
            },
          ],
          notes: ["file-openイベントでsetIcon('locate')呼び出し", "視覚的に状態リセット", "リファクタリング不要"],
        },
        {
          test: "RegionSelectPluginがToggleMarkRibbonをリボンに登録することをテストする",
          implementation: "main.tsでaddRibbonIconを使ってToggleMarkRibbonをリボンに追加する",
          type: "structural",
          status: "completed",
          commits: [
            {
              hash: "35db092",
              message: "feat: integrate ToggleMarkRibbon into RegionSelectPlugin",
              phase: "green",
            },
          ],
          notes: ["addRibbonIconでリボン追加", "ワンタップで範囲選択操作", "リファクタリング不要"],
        },
      ],
    },
    {
      number: 3,
      pbi_id: "PBI-003",
      goal: "clear-markコマンドを実装してマーク解除を可能にし、全てのコマンドをmain.tsに統合して基本機能を完成させる",
      status: "done",
      subtasks: [
        {
          test: "RegionSelectPluginがSetMarkCommandを登録することをテストする",
          implementation: "main.tsのRegionSelectPluginにSetMarkCommandをaddCommandで登録する",
          type: "structural",
          status: "completed",
          commits: [
            {
              hash: "490aeed",
              message: "feat: register SetMarkCommand in RegionSelectPlugin",
              phase: "green",
            },
          ],
          notes: ["MarkManagerシングルトン追加", "addCommandでset-mark登録", "Notice依存性注入"],
        },
        {
          test: "RegionSelectPluginがSelectToMarkCommandを登録することをテストする",
          implementation: "main.tsのRegionSelectPluginにSelectToMarkCommandをaddCommandで登録する",
          type: "structural",
          status: "completed",
          commits: [
            {
              hash: "76a893c",
              message: "feat: register SelectToMarkCommand in RegionSelectPlugin",
              phase: "green",
            },
          ],
          notes: ["addCommandでselect-to-mark登録", "MarkManager共有", "Notice依存性注入"],
        },
        {
          test: "MarkManager.clearMarkがマークをクリアできることをテストする",
          implementation: "MarkManagerクラスにclearMarkメソッドを実装し、内部状態をnullにする",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "648bcc1",
              message: "feat: implement MarkManager.clearMark() method",
              phase: "green",
            },
          ],
          notes: ["clearMark()メソッド追加", "内部状態をnullに設定", "RED→GREENサイクル完了"],
        },
        {
          test: "ClearMarkCommandがMarkManager.clearMarkを呼ぶことをテストする",
          implementation: "ClearMarkCommandクラスを作成し、executeメソッドでMarkManager.clearMarkを呼び出す",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "64197ae",
              message: "feat: implement ClearMarkCommand class",
              phase: "green",
            },
          ],
          notes: ["ClearMarkCommandクラス作成", "executeでclearMark呼び出し", "RED→GREENサイクル完了"],
        },
        {
          test: "ClearMarkCommandがマーク解除時にNoticeを表示することをテストする",
          implementation: "マーク解除後にNoticeで「マークを解除しました」を表示する",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "8fe0cd7",
              message: "feat: add Notice display to ClearMarkCommand",
              phase: "green",
            },
          ],
          notes: ["showNotice依存性注入", "マーク解除通知実装", "RED→GREENサイクル完了"],
        },
        {
          test: "RegionSelectPluginがClearMarkCommandを登録することをテストする",
          implementation: "main.tsのRegionSelectPluginにClearMarkCommandをaddCommandで登録する",
          type: "structural",
          status: "completed",
          commits: [
            {
              hash: "589bb1b",
              message: "feat: register ClearMarkCommand in RegionSelectPlugin",
              phase: "green",
            },
          ],
          notes: ["addCommandでclear-mark登録", "callbackを使用", "全3コマンド統合完了"],
        },
      ],
    },
    {
      number: 2,
      pbi_id: "PBI-002",
      goal: "select-to-markコマンドを実装し、マークから現在位置までのテキスト選択を可能にする。またSprint 1の改善アクションを完了する。",
      status: "done",
      subtasks: [
        {
          test: "main.tsとsettings.tsのlintエラーがないことを確認する",
          implementation: "サンプルコードと未使用パラメータを削除してlintエラーを修正する",
          type: "structural",
          status: "completed",
          commits: [
            {
              hash: "145dad9",
              message: "refactor: remove sample code and rename classes",
              phase: "green",
            },
          ],
          notes: ["サンプルコード全削除", "クラス名をRegionSelectPluginに統一", "lint/buildともにパス"],
        },
        {
          test: "tsconfig.jsonがscrum.tsとvitest.config.tsを含むことを確認する",
          implementation: "tsconfig.jsonのinclude配列にscrum.tsとvitest.config.tsを追加する",
          type: "structural",
          status: "completed",
          commits: [
            {
              hash: "079daf9",
              message: "build: include scrum.ts and vitest.config.ts in tsconfig",
              phase: "green",
            },
          ],
          notes: ["tsconfig.jsonのinclude配列に2ファイル追加", "ESLintのパースエラー解消", "全てのlintエラー解消完了"],
        },
        {
          test: "SelectToMarkCommandがマーク未設定時にnullを扱えることをテストする",
          implementation: "SelectToMarkCommandクラスを作成し、MarkManager.getMarkがnullを返すケースを処理する",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "7b9fedd",
              message: "feat: implement SelectToMarkCommand with null handling",
              phase: "green",
            },
          ],
          notes: ["SelectToMarkCommandクラス作成", "依存性注入パターン適用", "null処理テスト追加・実装"],
        },
        {
          test: "SelectToMarkCommandがマーク未設定時にエラー通知を表示することをテストする",
          implementation: "マークがnullの場合にNoticeで「マークが設定されていません」を表示する",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "fb8d1d9",
              message: "feat: add error notice when mark is not set",
              phase: "green",
            },
          ],
          notes: ["エラー通知テスト追加", "showNotice呼び出し実装", "正しいメッセージ確認"],
        },
        {
          test: "SelectToMarkCommandがマークから現在位置までの範囲を計算できることをテストする",
          implementation: "MarkManagerから取得したマーク位置とEditor.getCursorで取得した現在位置から選択範囲を決定する",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "4eb4894",
              message: "feat: add range calculation from mark to cursor",
              phase: "green",
            },
          ],
          notes: ["範囲計算テスト追加", "getCursor呼び出し実装", "両位置取得確認"],
        },
        {
          test: "SelectToMarkCommandがEditor.setSelectionを正しいanchor/headで呼ぶことをテストする",
          implementation: "計算した範囲でEditor.setSelectionを呼び出し、テキストを選択する",
          type: "behavioral",
          status: "completed",
          commits: [
            {
              hash: "fd4671d",
              message: "feat: implement text selection with Editor.setSelection",
              phase: "green",
            },
          ],
          notes: ["setSelectionテスト追加", "mark=anchor, cursor=head実装", "SelectToMarkCommand完成"],
        },
      ],
    },
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
      sprint: 3,
      improvements: [
        {
          action: "Obsidian環境での統合テストを追加する（実際のエディタ動作検証）",
          timing: "product",
          status: "active",
          outcome: null,
        },
        {
          action: "ユーザードキュメントを作成する（README更新、コマンド使用方法の説明、モバイルでの利用シナリオの記載）",
          timing: "product",
          status: "active",
          outcome: null,
        },
      ],
    },
    {
      sprint: 2,
      improvements: [
        {
          action: "SetMarkCommandとSelectToMarkCommandをmain.tsのRegionSelectPluginに登録する",
          timing: "sprint",
          status: "completed",
          outcome: "Sprint 3で完了。全3コマンド（set-mark, select-to-mark, clear-mark）をmain.tsに統合し、MarkManagerをシングルトンとして共有する構成を実現。",
        },
        {
          action: "Obsidian環境での統合テストを追加する（実際のエディタ動作検証）",
          timing: "product",
          status: "active",
          outcome: null,
        },
      ],
    },
    {
      sprint: 1,
      improvements: [
        {
          action: "Lintエラーを修正する（main.ts, settings.tsのサンプルコード削除、未使用パラメータの修正）",
          timing: "sprint",
          status: "completed",
          outcome: "Sprint 2で完了。サンプルコード全削除、クラス名統一により全てのlintエラー解消。",
        },
        {
          action: "tsconfig.jsonにscrum.tsとvitest.config.tsを追加する",
          timing: "sprint",
          status: "completed",
          outcome: "Sprint 2で完了。tsconfig.jsonのinclude配列に追加し、ESLintパースエラー解消。",
        },
      ],
    },
  ],
};

// JSON output (deno run scrum.ts | jq for queries)
console.log(JSON.stringify(scrum, null, 2));
