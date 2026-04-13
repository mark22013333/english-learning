# 📖 English Speaking Practice

ESL A1 學習筆記靜態網站，使用 GitHub Pages 部署。

## 🚀 部署到 GitHub Pages

### 第一次設定

1. 在 GitHub 建立新的 repository（例如 `english-learning`）
2. 把這個資料夾的所有檔案 push 上去：

```bash
cd english-learning
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的帳號/english-learning.git
git push -u origin main
```

3. 到 GitHub repo → **Settings** → **Pages**
4. Source 選擇 **Deploy from a branch**
5. Branch 選擇 **main** / **(root)**
6. 點 Save，等幾分鐘後就能訪問：`https://你的帳號.github.io/english-learning/`

---

## 📝 新增 Unit 的步驟

### Step 1: 建立 JSON 資料檔

在 `data/` 資料夾新增一個 JSON 檔案，例如 `unit3.json`：

```json
{
  "id": "unit3",
  "title": "你的 Unit 標題",
  "level": "A1",
  "icon": "🏢",
  "sections": [
    {
      "type": "vocabulary",
      "title": "Vocabulary",
      "items": [
        { "word": "meeting", "chinese": "會議", "example": "I have a meeting at 10 AM." }
      ]
    }
  ]
}
```

### Step 2: 更新 units.json

在 `data/units.json` 加入新 unit 的資訊：

```json
{
  "id": "unit3",
  "title": "你的 Unit 標題",
  "level": "A1",
  "file": "data/unit3.json",
  "icon": "🏢",
  "description": "簡短描述這個 Unit 的內容。"
}
```

### Step 3: Push 到 GitHub

```bash
git add .
git commit -m "Add Unit 3"
git push
```

GitHub Pages 會自動更新（通常 1-2 分鐘）。

---

## 📋 可用的 Section 類型

每個 Unit 的 `sections` 陣列可以包含以下類型：

| type | 說明 | 用途 |
|------|------|------|
| `vocabulary` | 詞彙表 | 單字、中文、例句，可切換隱藏 |
| `phrases` | 常用片語 | 片語 + 問句 + 範例回答 |
| `grammar` | 文法結構 | 規則 + 用法說明 + 例句 |
| `practice` | 練習對話 | 多行對話，可隱藏練習 |
| `fill_blank` | 填空練習 | 提示 + 模板 + 可揭示答案 |
| `qa` | 問答練習 | 問題 + 提示（點擊揭示） |
| `conversation` | 對話問答 | 問題 + 多個回答選項 |
| `roleplay` | 角色扮演 | 對話場景 |
| `reading` | 閱讀理解 | 文章段落 + 重點單字 + 理解題 |
| `tips` | 實用提示 | 片語 + 中文 + 例句 |
| `notes` | 課堂筆記 | 重點 + 說明 + 中文 |

---

## 📁 專案結構

```
english-learning/
├── index.html          ← 主頁面
├── css/
│   └── style.css       ← 樣式
├── js/
│   └── app.js          ← 應用邏輯
├── data/
│   ├── units.json      ← Unit 清單（新增 Unit 時要更新）
│   ├── unit1.json      ← Unit 1 資料
│   └── unit2.json      ← Unit 2 資料
└── README.md           ← 本文件
```

---

## ✨ 功能特色

- **Practice Mode**：隱藏文字，點擊逐行揭示
- **Toggle 中文/例句**：詞彙表可切換顯示中文和例句
- **點擊揭示答案**：填空和理解題的答案可點擊查看
- **手機友善**：響應式設計，手機上也好用
- **離線可用**：純靜態網站，無需後端
- **易於更新**：只需編輯 JSON 檔案即可新增內容
