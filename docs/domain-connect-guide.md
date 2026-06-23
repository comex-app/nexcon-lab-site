# 独自ドメイン接続手順書

**nexcon-lab.com — ムームードメイン × Vercel**

| 項目 | 内容 |
|------|-----|
| ドメイン | `nexcon-lab.com` |
| レジストラ | ムームードメイン（MuuMuu Domain） |
| ホスティング | Vercel |
| 前提 | Vercel デプロイ済み（[vercel-deploy-guide.md](./vercel-deploy-guide.md)） |

---

## 1. 全体フロー

```
Vercel にドメイン追加
        ↓
ムームードメイン DNS 設定
        ↓
DNS 伝播待ち（数分〜48時間）
        ↓
Vercel SSL 自動発行
        ↓
https://nexcon-lab.com でアクセス確認
```

---

## 2. Vercel 側：ドメイン追加

1. Vercel プロジェクト `nexcon-lab-site` を開く
2. **Settings → Domains**
3. 以下を **それぞれ** 追加:

   | ドメイン | 用途 |
   |----------|------|
   | `nexcon-lab.com` |  apex（ルート） |
   | `www.nexcon-lab.com` | www サブドメイン |

4. 追加後、Vercel が **必要な DNS レコード** を表示します。  
   **表示された値が最優先**（本書の例と異なる場合は Vercel 画面に従う）。

### Vercel が提示する典型設定

| ホスト | タイプ | 値（例） |
|--------|--------|----------|
| `@`（apex） | **A** | `76.76.21.21` |
| `www` | **CNAME** | `cname.vercel-dns.com` |

または apex に **A Record** の代わりに **CNAME**（ALIAS / ANAME）を使う DNS プロバイダもあります。ムームーDNS では **A レコード** が一般的です。

### リダイレクト設定（推奨）

Domains 画面で:

- `www.nexcon-lab.com` → `nexcon-lab.com` へリダイレクト  
  または逆（どちらかを正規 URL に統一）

**推奨:** 正規 URL を `https://nexcon-lab.com`（apex）とする。

---

## 3. ムームードメイン側：DNS 設定

### 3.1 管理画面へログイン

1. https://muumuu-domain.com にログイン
2. **ムームードメイン** → **ドメイン操作** → **ドメイン設定**
3. `nexcon-lab.com` を選択

### 3.2 ネームサーバー確認

**方式 A: ムームーDNS を使う（本手順の前提）**

- ネームサーバーが **ムームーDNS**（例: `ns1.muumuu-domain.com` 等）になっていること
- **ムームーDNS 設定変更** または **DNS 関連設定の設定** へ進む

**方式 B: Vercel DNS を使う（上級）**

- Vercel Domains 画面で **Use Vercel DNS** を選択
- 表示される Vercel ネームサーバーをムームードメインの **ネームサーバー設定** に入力  
  （ムームー側で NS 変更が必要）

Phase 2 では **方式 A（ムームーDNS + A/CNAME）** を推奨。

### 3.3 ムームーDNS レコード追加

**DNS 設定一覧** または **カスタム設定** で以下を登録:

#### ルートドメイン（nexcon-lab.com）

| サブドメイン | 種別 | 内容 | TTL |
|--------------|------|------|-----|
| （空）または `@` | **A** | `76.76.21.21` | 3600（デフォルト可） |

※ Vercel 画面で異なる IP / レコードが示された場合は **そちらを使用**。

#### www サブドメイン

| サブドメイン | 種別 | 内容 | TTL |
|--------------|------|------|-----|
| `www` | **CNAME** | `cname.vercel-dns.com` | 3600 |

### 3.4 既存レコードとの競合

| 状況 | 対処 |
|------|------|
| 同じホストに古い A / CNAME がある | 削除または Vercel 用に **上書き** |
| ムームー初期の parking レコード | 削除 |
| MX レコード（メール） | **削除しない**（メール利用時） |

メールを `hello@nexcon-lab.com` 等で使う場合は、MX / TXT を別途設計（本 Phase では Web のみ）。

### 3.5 設定保存

- **設定する** / **更新** をクリック
- 反映まで数分〜最大 48 時間（通常は数分〜1 時間）

---

## 4. SSL 確認

Vercel は Let's Encrypt 証明書を **自動発行** します。

### 4.1 Vercel で確認

1. **Settings → Domains**
2. 各ドメインの **Status**:

   | 表示 | 意味 |
   |------|------|
   | **Valid Configuration** | DNS OK |
   | **Generating SSL Certificate** | 証明書発行中 |
   | **Invalid Configuration** | DNS 未反映・レコード誤り |

3. SSL が有効になると **🔒 HTTPS** でアクセス可能

### 4.2 ブラウザで確認

```
https://nexcon-lab.com
https://www.nexcon-lab.com
```

- 証明書発行者: Let's Encrypt（Vercel 経由）
- 「保護された通信」表示

### 4.3 SSL トラブル

| 症状 | 対処 |
|------|------|
| DNS は OK だが SSL 待ちが長い | 30 分待機 → Domains で **Refresh** |
| NET::ERR_CERT_COMMON_NAME_INVALID | DNS が別サービスを向いていないか確認 |
| リダイレクトループ | www / apex のリダイレクト設定を見直し |

---

## 5. 接続確認チェックリスト

```
[ ] https://nexcon-lab.com が開く
[ ] https://www.nexcon-lab.com が開く（または apex へリダイレクト）
[ ] ロゴ・CSS が読み込まれる
[ ] Vercel Domains が Valid Configuration
[ ] SSL 証明書が有効（🔒）
[ ] モバイル実機で表示確認
```

### 確認コマンド（任意）

```powershell
nslookup nexcon-lab.com
nslookup www.nexcon-lab.com
```

| クエリ | 期待 |
|--------|------|
| `nexcon-lab.com` | `76.76.21.21`（または Vercel 指示値） |
| `www.nexcon-lab.com` | `cname.vercel-dns.com` 経由 |

---

## 6. ムームードメイン FAQ

| 質問 | 回答 |
|------|------|
| 設定画面が見つからない | 「ドメイン操作」→ 対象ドメイン → 「ムームーDNS」 |
| `@` が入力できない | サブドメイン欄を **空** にする、または `@` を選択 |
| CNAME を apex に設定したい | ムームーDNS では apex CNAME が不可な場合あり → **A レコード** を使用 |
| 変更が反映されない | TTL 待ち、ブラウザキャッシュクリア、DNS キャッシュフラッシュ |

---

## 7. ロールバック

問題発生時:

1. ムームーDNS で旧レコードに戻す
2. Vercel Domains からカスタムドメインを **Remove**
3. `https://nexcon-lab-site.vercel.app` で引き続きアクセス可能

---

## 8. 関連ドキュメント

| ドキュメント | 内容 |
|--------------|------|
| [github-publish-guide.md](./github-publish-guide.md) | GitHub 公開 |
| [vercel-deploy-guide.md](./vercel-deploy-guide.md) | Vercel デプロイ |
| プロジェクト `README.md` | 概要・ローカル開発 |

---

*Phase 2 — ドキュメントのみ。コード変更は含みません。*
