# English Learning with Kiddy

Yu (Mark) 的英文學習筆記與每日複習系統。這個 repo 用來保存原始教材、整理後的 Markdown 筆記，並透過 GitHub Pages 提供每日複習任務台。

## 目前目標

1. 把 PDF、圖片教材整理成可長期複習的 Markdown 知識庫。
2. 每日複習常犯錯、詞彙片語、句型與口說問題。
3. 讓每次新增教材都有固定流程，不用重新解釋需求。
4. 保留原始教材，方便之後回頭檢查來源。

## 資料夾結構

```text
english-learning/
├── README.md
├── AGENTS.md
├── index.html
├── dashboard.html
├── css/
├── js/
├── data/
│   ├── units.json
│   ├── review-items.json
│   ├── mistakes.json
│   ├── unit1.json
│   ├── unit2.json
│   └── unit3.json
├── sources/
│   ├── Unit 1 - Self-Introduction.pdf
│   ├── Unit 2 Daily Routine _ Weekend Activities.pdf
│   └── Unit 3 - Personality.pdf
├── units/
│   ├── unit-01-self-introduction/
│   │   ├── metadata.json
│   │   └── notes.md
│   ├── unit-02-daily-routine/
│   │   ├── metadata.json
│   │   └── notes.md
│   └── unit-03-personality/
│       ├── metadata.json
│       └── notes.md
├── sessions/
│   └── 2026-04-19-unit2-speaking-practice.md
├── grammar-reference/
│   ├── prepositions-of-time.md
│   ├── frequency-expressions.md
│   └── by-ving-and-parallel-structure.md
└── personal-notes/
    └── common-mistakes.md
```

## 每日複習

打開 `index.html` 或 GitHub Pages 網站後，首頁會顯示「今日複習任務台」：

- 常犯錯提醒：優先複習容易重複出現的錯誤。
- 詞彙與片語：用例句和提示檢查理解。
- 口說問題：練習 3-5 句長回答。
- 單元入口：快速回到每個 unit 的完整練習內容。

v1 使用簡易間隔複習：依照 `data/review-items.json` 的 `nextReview`、`difficulty`、`mistakeTags` 產生今日清單。之後可以再升級成答題紀錄驅動。

## 新增教材流程

把 PDF 或圖片放進 `sources/`，然後請助理：

```text
請將這份 PDF/圖片整理成英文學習單元：
1. 摘要中英對照
2. 5-10 個關鍵字詞與例句
3. 句型與文法重點
4. 蘇格拉底式練習問題
5. 我的常犯錯提醒
6. Role-play 情境
7. 產生可加入每日複習的題目
```

助理應該保留原始檔，並產生或更新：

- `units/unit-XX-topic/notes.md`
- `units/unit-XX-topic/metadata.json`
- `data/unitX.json`
- `data/units.json`
- `data/review-items.json`
- 必要時更新 `grammar-reference/` 與 `personal-notes/common-mistakes.md`

## 筆記格式

每個單元的 `notes.md` 建議包含：

1. Core Summary / 核心摘要
2. Vocabulary / 關鍵字詞
3. Useful Patterns / 句型與文法
4. Socratic Practice / 蘇格拉底式練習
5. Common Mistakes / 常犯錯
6. Role-play / 情境模擬
7. Daily Review Items / 可加入每日複習的題目

## 練習紀錄

每次 Speaking practice 結束後，在 `sessions/` 建立新檔案：

- 檔名格式：`YYYY-MM-DD-topic.md`
- 內容包含：題目、每次嘗試、提示、最終版本、學到的 pattern、下次複習建議。

## 進度

| Unit | 主題 | 狀態 | 筆記 |
|------|------|------|------|
| Unit 1 | Self-Introduction | Completed | [notes](units/unit-01-self-introduction/notes.md) |
| Unit 2 | Daily Routine & Weekend Activities | In Progress | [notes](units/unit-02-daily-routine/notes.md) |
| Unit 3 | Personality | Imported | [notes](units/unit-03-personality/notes.md) |

## 學習目標

1. 提升英文口說流暢度，能自信介紹自己、工作與想法。
2. 累積職場與技術討論常用英文，支援 Staff Engineer 職涯目標。
3. 每次練習都抓出重複錯誤，並透過每日複習逐步修正。

Last updated: 2026-05-28
