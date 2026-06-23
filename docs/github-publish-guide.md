# GitHub 公開手順書

**Nexcon Lab Website — Phase 2**

| 項目 | 内容 |
|------|------|
| リポジトリ | `C:\Users\Aida\nexcon-lab-site` |
| 推奨リポジトリ名 | `nexcon-lab-site` |
| 推奨 Visibility | **Public**（Private も可） |
| 前提 | 初回コミット済み（`Nexcon Lab Website Phase 1`） |

---

## 0. 事前確認

```powershell
cd C:\Users\Aida\nexcon-lab-site
git status
git branch
git log -1 --oneline
```

| 確認項目 | 期待値 |
|----------|--------|
| working tree | `clean` |
| ブランチ | `master` または `main` |
| リモート | 未設定（初回公開時） |

---

## 1. ブランチ名を `main` に変更する（推奨）

**現状:** ブランチ名は `master` です。  
GitHub / Vercel のデフォルトブランチは `main` が一般的なため、push 前にリネームすることを推奨します。

### 手順（ローカルで実行）

```powershell
cd C:\Users\Aida\nexcon-lab-site

# ブランチ名を main に変更
git branch -m master main

# 確認
git branch
# * main
```

### GitHub へ push 後（リモート側のデフォルトブランチ）

1. GitHub リポジトリ → **Settings → General → Default branch**
2. `main` を選択 → **Update**

`master` のまま公開する場合は、Vercel の Production Branch を `master` に設定してください（[vercel-deploy-guide.md](./vercel-deploy-guide.md) 参照）。

---

## 2. GitHub リポジトリ作成

1. https://github.com にログイン
2. 右上 **+** → **New repository**
3. 設定:

   | 項目 | 値 |
   |------|-----|
   | Repository name | `nexcon-lab-site` |
   | Description | `Nexcon Lab corporate website (Phase 1)` |
   | Visibility | **Public**（推奨） |
   | Initialize | **すべてオフ**（README / .gitignore / license は追加しない） |

4. **Create repository**

空リポジトリが作成されます。表示される URL を控えます:

```
https://github.com/<YOUR_USERNAME>/nexcon-lab-site.git
```

---

## 3. remote 追加

```powershell
cd C:\Users\Aida\nexcon-lab-site

# HTTPS（推奨・初回）
git remote add origin https://github.com/<YOUR_USERNAME>/nexcon-lab-site.git

# 確認
git remote -v
```

**SSH を使う場合:**

```powershell
git remote add origin git@github.com:<YOUR_USERNAME>/nexcon-lab-site.git
```

---

## 4. push

### ブランチを `main` に変更した場合

```powershell
git push -u origin main
```

### `master` のままの場合

```powershell
git push -u origin master
```

初回 push 時、GitHub 認証（Personal Access Token または GitHub CLI）が求められます。

**GitHub CLI を使う場合:**

```powershell
gh auth login
git push -u origin main
```

---

## 5. 確認方法

### 5.1 ローカル

```powershell
git status
# On branch main, up to date with 'origin/main'.

git remote -v
git log -1 --oneline
```

### 5.2 GitHub Web

1. `https://github.com/<YOUR_USERNAME>/nexcon-lab-site` を開く
2. 以下が表示されること:

   | ファイル | 存在 |
   |----------|------|
   | `index.html` | ✓ |
   | `package.json` | ✓ |
   | `public/logo-nexcon.svg` | ✓ |
   | `src/style.css` | ✓ |
   | `README.md` | ✓ |

3. **Code** タブで `node_modules/` / `dist/` が **含まれていない** こと

### 5.3 ブランチ確認

- **Settings → Branches** で Default branch が `main`（または意図したブランチ）

---

## 6. トラブルシューティング

| 症状 | 対処 |
|------|------|
| `remote origin already exists` | `git remote remove origin` 後に再追加 |
| `failed to push`（認証エラー） | PAT 発行（repo スコープ）または `gh auth login` |
| `rejected (fetch first)` | 空でないリポジトリを作ってしまった → 新規空リポジトリを作り直す |
| 大容量ファイルエラー | `node_modules` が add されていないか `.gitignore` を確認 |

---

## 7. 次のステップ

GitHub 公開後:

1. [vercel-deploy-guide.md](./vercel-deploy-guide.md) — Vercel デプロイ
2. [domain-connect-guide.md](./domain-connect-guide.md) — nexcon-lab.com 接続

---

*Phase 2 — ドキュメントのみ。コード変更は含みません。*
