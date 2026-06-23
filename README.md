# Nexcon Lab Website

nexcon-lab.com 仮公開用のコーポレートサイト（Phase 1）。

- **ブランド:** Nexcon Lab
- **ロゴ:** `public/logo-nexcon.svg`（差し替え可能）
- **構成:** シングルページ（Hero / Products / About / Contact）
- **ホスティング:** [Vercel](https://vercel.com) 想定

## ローカル開発

```bash
cd nexcon-lab-site
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

## ビルド

```bash
npm run build
npm run preview
```

成果物は `dist/` に出力されます。

## ロゴの差し替え

正式ロゴを使う場合は、同じファイル名で上書きしてください。

```
public/logo-nexcon.svg
```

HTML では `/logo-nexcon.svg` として参照しています（ヘッダー・フッター・favicon）。

## Vercel 公開手順

### 方法 A: Vercel CLI（推奨・初回）

1. **Vercel アカウント**  
   https://vercel.com で GitHub / GitLab / Bitbucket または Email でサインアップ

2. **CLI インストール**

   ```bash
   npm install -g vercel
   ```

3. **プロジェクトディレクトリへ移動**

   ```bash
   cd nexcon-lab-site
   ```

4. **初回デプロイ**

   ```bash
   vercel
   ```

   - Set up and deploy? → **Y**
   - Which scope? → 自分のアカウント / チームを選択
   - Link to existing project? → **N**（新規）
   - Project name → `nexcon-lab-site`（任意）
   - Directory → **./**（Enter）
   - Override settings? → **N**

   プレビュー URL（例: `https://nexcon-lab-site-xxx.vercel.app`）が発行されます。

5. **本番デプロイ**

   ```bash
   vercel --prod
   ```

### 方法 B: GitHub 連携（継続デプロイ）

1. `nexcon-lab-site` を **単独リポジトリ** として GitHub に push  
   （Atlas リポジトリと分離することを推奨）

2. Vercel ダッシュボード → **Add New… → Project**

3. リポジトリを Import

4. **Framework Preset:** Vite（自動検出）

5. 設定確認:

   | 項目 | 値 |
   |------|-----|
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |
   | Root Directory | `./` または `nexcon-lab-site`（モノレポの場合） |

6. **Deploy** をクリック

7. 以降、`main` ブランチへの push で自動デプロイ

### カスタムドメイン（nexcon-lab.com）

1. Vercel プロジェクト → **Settings → Domains**

2. `nexcon-lab.com` と `www.nexcon-lab.com` を追加

3. ドメイン registrar（お名前.com 等）で DNS を設定:

   | タイプ | 名前 | 値 |
   |--------|------|-----|
   | **A** | `@` | `76.76.21.21` |
   | **CNAME** | `www` | `cname.vercel-dns.com` |

   ※ Vercel 画面に表示される指示が優先です。

4. 反映後、Vercel が SSL 証明書を自動発行

### トラブルシューティング

| 症状 | 対処 |
|------|------|
| 404 on refresh | Vite SPA では通常不要。静的 HTML のためそのまま動作 |
| ロゴが表示されない | `public/logo-nexcon.svg` が存在するか確認 |
| ビルド失敗 | Node.js 18+、`npm ci` 後に `npm run build` をローカルで確認 |

## ディレクトリ構成

```
nexcon-lab-site/
├── public/
│   └── logo-nexcon.svg    # ロゴ（差し替え可）
├── src/
│   ├── main.js            # モバイルナビ
│   └── style.css          # スタイル
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 配色

| 用途 | 色 |
|------|-----|
| 背景（ダークネイビー） | `#060d18` / `#0a1628` |
| テキスト | `#f8fafc` |
| アクセント（ブルー） | `#2563eb` / `#3b82f6` |

## ライセンス

© 2026 Nexcon Lab. All rights reserved.
