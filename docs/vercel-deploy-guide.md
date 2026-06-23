# Vercel 公開手順書

**Nexcon Lab Website — Phase 2**

| 項目 | 内容 |
|------|-----|
| プロジェクト | `nexcon-lab-site` |
| フレームワーク | Vite（静的サイト） |
| 前提 | GitHub リポジトリ公開済み（[github-publish-guide.md](./github-publish-guide.md)） |

---

## 1. 事前確認

### ローカルビルド（任意・推奨）

```powershell
cd C:\Users\Aida\nexcon-lab-site
npm install
npm run build
```

`dist/` に以下が生成されること:

- `index.html`
- `logo-nexcon.svg`
- `assets/*.css`, `assets/*.js`

---

## 2. Vercel アカウント準備

1. https://vercel.com にアクセス
2. **Sign Up** → **Continue with GitHub**
3. GitHub 連携で `nexcon-lab-site` リポジトリへのアクセスを許可

---

## 3. Import Repository

1. Vercel ダッシュボード → **Add New… → Project**
2. **Import Git Repository** から `nexcon-lab-site` を選択  
   （表示されない場合: **Adjust GitHub App Permissions** でリポジトリを追加）
3. **Import**

---

## 4. Framework 設定

Vercel が Vite を自動検出します。以下を確認・設定します。

| 項目 | 値 |
|------|-----|
| **Framework Preset** | **Vite** |
| **Root Directory** | `./`（リポジトリルート） |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install`（または `npm ci`） |

### Environment Variables

Phase 1 では **不要**（環境変数なし）。

---

## 5. Build 設定（詳細）

### package.json との対応

```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

| Vercel 設定 | 対応 |
|-------------|------|
| Build Command | `npm run build` → `vite build` |
| Output Directory | `dist` |
| Node.js Version | **18.x** 以上（Settings → General で変更可） |

### vite.config.js

```js
export default defineConfig({
  base: "/",
});
```

ルートドメイン（`nexcon-lab.com`）デプロイに適合。

---

## 6. Production Branch

| ローカルブランチ | Vercel Production Branch |
|------------------|--------------------------|
| `main`（推奨） | `main`（デフォルト） |
| `master` | **Settings → Git → Production Branch** を `master` に変更 |

---

## 7. 初回公開（Deploy）

1. 設定確認後 **Deploy** をクリック
2. ビルドログで以下を確認:

   ```
   npm install
   npm run build
   ✓ built in ...
   ```

3. 完了後 **Visit** でプレビュー URL を開く  
   例: `https://nexcon-lab-site.vercel.app`

### 初回確認チェックリスト

```
[ ] トップページが表示される
[ ] Hero / Products / About / Contact セクションが見える
[ ] ロゴ（logo-nexcon.svg）が表示される
[ ] スマホ幅でハンバーガーメニューが動作する
[ ] 404 にならない（/ ルート）
```

---

## 8. 継続デプロイ

| 操作 | 結果 |
|------|------|
| `main`（または Production Branch）へ push | **Production** 自動デプロイ |
| その他ブランチへ push | **Preview** デプロイ |

```powershell
git add .
git commit -m "Update content"
git push origin main
```

Vercel ダッシュボード → **Deployments** で状態を確認。

---

## 9. プロジェクト設定（推奨）

**Settings → General**

| 項目 | 推奨値 |
|------|--------|
| Project Name | `nexcon-lab-site` |
| Node.js Version | 20.x |

**Settings → Git**

| 項目 | 推奨値 |
|------|--------|
| Production Branch | `main` |
| Deploy Hooks | 必要時のみ |

---

## 10. トラブルシューティング

| 症状 | 対処 |
|------|------|
| Build failed | ローカルで `npm run build` を再現・修正 |
| ロゴ 404 | `public/logo-nexcon.svg` が Git に含まれているか確認 |
| 真っ白なページ | ブラウザ DevTools → Console / Network を確認 |
| 古い内容が表示 | Deployments → 最新 Production を **Promote** |
| Framework 未検出 | 手動で **Vite** を選択 |

---

## 11. CLI によるデプロイ（代替）

GitHub 連携の代わりに CLI も利用可能:

```powershell
npm install -g vercel
cd C:\Users\Aida\nexcon-lab-site
vercel          # プレビュー
vercel --prod   # 本番
```

Git 連携デプロイを推奨（継続デプロイのため）。

---

## 12. 次のステップ

Vercel 公開後:

→ [domain-connect-guide.md](./domain-connect-guide.md) — `nexcon-lab.com`（ムームードメイン）接続

---

*Phase 2 — ドキュメントのみ。コード変更は含みません。*
