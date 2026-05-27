# AICU秘伝テクニック! CodexアプリとImageGenプラグインによるスプライト生成

この記事で扱うキャラクター素材は、AICUのコラボクリエイター「Torako」さんが描いた「Hakase」の1枚絵を参照画像として、CodexアプリのImageGenワークフローでゲーム用スプライトへ展開したものです。

生成AI時代にブラウザゲームを作るなら、最初からUnityやUnreal Engineを開いて挫折する必要はありません。まずはCodexアプリとImageGenを使って、小さな2Dキャラクター素材を作り、PhaserやCanvasのゲームループへ渡せる形にするのが実用的です。

今回作ったのは、AICUのドクター風ちびキャラ「Torako」のゲーム用スプライトです。参照画像をCodexアプリに添付し、「背景透明にして表情バリエーションを作って」から始め、最終的には `idle`、`get`、`gameover`、`walkcycle` までを `256 x 256` セルのスプライトシートに整理しました。

## ImageGenプラグインの使い方

Codexアプリの内蔵 `imagegen` は、通常の画像生成・編集ではAPIキーを直接設定しなくても使えます。ただし、無料・無制限という意味ではありません。CodexやChatGPT側の利用上限、プラン、クレジット、提供状況に依存します。大量生成やAPI/CLI経由での生成では `OPENAI_API_KEY` が必要になり、API料金が適用されます。

参照画像は、Codexアプリでは画像添付やドラッグ＆ドロップ、CLIではローカル画像ファイル指定で使うのが基本です。URL画像を参照したい場合は、まずローカルに保存してから参照画像として渡すほうが確実です。

背景透明化については注意が必要です。OpenAI公式ドキュメントでは、`gpt-image-2` は現在 `background: "transparent"` をサポートしないと説明されています。そこで今回は、いったん単色グリーンバックで生成し、ローカルのクロマキー除去で透明PNGへ変換しました。真の透明背景が必要な場合だけ、確認のうえで透明背景に対応する別モデルやCLI経路を使う設計が安全です。

参照:

- [OpenAI Image generation guide](https://developers.openai.com/api/docs/guides/image-generation)
- [OpenAI API pricing](https://developers.openai.com/api/docs/pricing#image-generation)

## 最初の表情バリエーション

Codexアプリ版での作業はシンプルです。キャラクター画像をアップロードして、次のように依頼します。

```text
$imagegen で背景透明にして表情バリエーションを作って
```

生成後、Codexは画像を `$CODEX_HOME/generated_images/` 配下に保存します。今回は成果物として使うため、ワークスペースにコピーし、クロマキー背景を削除しました。

出力例:

- `../torako-expression-sheet-transparent.png`
- `../torako-expression-cheerful.png`
- `../torako-expression-wink.png`
- `../torako-expression-surprised.png`
- `../torako-expression-thinking.png`

## 歩行スプライトシートの初回生成

次に、次のようなプロンプトで歩行スプライトシートを作りました。

```text
上下左右・静止・移動用の歩行スプライトシートを作って
```

初回は次のような仕様でした。

- サイズ: `1024 x 1024`
- セル: `256 x 256`
- 行: `上 / 下 / 左 / 右`
- 列: `静止 / 歩き1 / 歩き2 / 歩き3`
- 形式: `RGBA PNG`
- 透明化: 四隅のアルファを検証

この段階では、見た目の方向別素材としては使えます。しかしゲーム内の歩行アニメとして見ると、`静止 + 歩き3枚` は弱いです。実運用では `idle` を別扱いにし、歩行は `右足接地 -> 中間 -> 左足接地 -> 中間` の4フレームループにしたほうが扱いやすくなります。

## idle/get/gameoverとwalkcycleに分ける

移動していない状態のほうがゲームでは重要です。そこで最終的には、非移動状態と歩行状態を分けました。

非移動状態:

- `idle`: 各方向2フレーム
- `get`: 下方向のみ2フレームを採用
- `gameover`: 下方向のみ2フレームを採用

歩行状態:

- `walkcycle`: 上下左右それぞれ4フレーム
- ループ: `rightFootContact -> passingHighA -> leftFootContact -> passingHighB`
- 10fpsでプレビュー

自然なループを作るには、手足だけでなく、腰の上下・左右の揺れが滑らかにつながる必要があります。生成AIに一発で完全な歩行を出させるよりも、まずシートを生成し、GIFやブラウザで再生し、怪しいコマをローカル加工で直すほうが現実的です。

## レビューで直したこと

`output/imagegen/drhakase-torako/state-walk-v3/preview.html` で確認したところ、次の問題がありました。

- 右向きの耳がトリミングで切れていた
- `idle / 右` と `get / 右` も同じく耳が切れていた
- 下方向の歩行は顔位置が少し揺れていた
- `get` と `gameover` は全方向ではなく、下方向だけ採用すれば十分だった

修正方針は、画像を再生成せず、既に良かった左向きを使うことにしました。

- 右向きwalkは、左向きwalkを左右鏡像にして採用
- `idle / 右` と `get / 右` も、左向きを左右鏡像にして採用
- 下方向walkは、上半身・頭部の重心をそろえて顔位置を補正
- 採用版の状態シートでは、`get` と `gameover` は下方向だけを配置

この工程はPython/Pillowによるローカル処理です。追加の画像生成コストは発生しません。

## 最終成果物

最終出力は次の通りです。

- 採用状態シート: `torako-adopted-states-idle4-getdown-gameoverdown-256.png`
- walkcycleシート: `torako-walkcycle-4frame-udlr-256.png`
- プレビューHTML: `preview.html`
- 中間プロンプト: `INTERMEDIATE_PROMPTS.md`
- スプライト仕様書: `SPRITESHEET_SPEC.md`
- メタデータ: `spritesheet.json`

採用状態シート:

```text
Rows: up / down / left / right
Cols: idle1 / idle2 / get1 / get2 / gameover1 / gameover2
Cell: 256 x 256
```

ただし、`get` と `gameover` は `down` 行だけを採用し、他方向の該当セルは透明のままにしています。

walkcycleシート:

```text
Rows: up / down / left / right
Cols: rightFootContact / passingHighA / leftFootContact / passingHighB
Cell: 256 x 256
Loop: 0 -> 1 -> 2 -> 3 -> 0
```

検証:

- PNGは `RGBA`
- 最終PNG 46個の四隅アルファ `0` を確認
- GIFで10fpsの歩行ループを確認
- ブラウザ確認用HTMLを作成

## 生成コストの考え方

Codexアプリの built-in `imagegen` は、こちらの画面には実トークン明細を返しません。正確な請求額はAPI利用時の usage dashboard などで確認します。

OpenAI公式ドキュメントでは、`gpt-image-2` の画像生成コスト目安として、1024相当の正方形画像で Medium が約 `$0.053`、High が約 `$0.211` と示されています。また、テキスト入力と画像入力トークンも総額見積もりに含める必要があります。

今回の作業で実際に画像生成した主な回数は5回です。

| 生成内容 | 回数 |
|---|---:|
| 表情バリエーション | 1 |
| 初回歩行シート | 1 |
| idle + walk4 master | 1 |
| idle/get/gameover state sheet | 1 |
| dedicated walkcycle sheet | 1 |

1 USD = 158円で概算すると、画像出力分だけなら次の程度です。

| 品質 | 5生成のUSD目安 | JPY目安 |
|---|---:|---:|
| Medium | `$0.265` | 約42円 |
| High | `$1.055` | 約167円 |

参照画像入力や長いプロンプト分を足すと、実際の総額はこれより少し増えます。初回の記事例のように表情シートと歩行シートだけなら2生成なので、Mediumで約17円、Highで約67円が画像出力分の目安です。

## 開発フローとしてのポイント

画像生成が使えない環境や、コスト・時間が気になる環境なら、最初はCSS、Canvas、Phaserの図形描画で十分です。ゲームとして面白いかどうかは、まず操作とループで決まります。

今回のようなImageGen素材は、ゲームループが見えたあとに差し替えるほうが安全です。プレイヤーが移動する、拾う、点が入る、失敗する、もう一度遊ぶ。この基本ループを固めてから、スプライトをリッチにしていくほうが、AI生成の試行回数も抑えられます。

## まとめ

CodexアプリとImageGenを組み合わせると、参照画像からゲーム用の2Dスプライトをかなり短時間で作れます。ただし、生成画像をそのままゲームに入れるのではなく、透明化、セル分割、正規化、GIFプレビュー、レビュー修正までをワークフローに含める必要があります。

今回の重要な学びは、右向きが壊れたら良い左向きを鏡像にする、下方向の歩行は顔位置を固定して確認する、`get` や `gameover` は最初から全方向を無理に採用しない、という点です。生成AIは素材の初速を上げますが、ゲーム素材として使える形にするには、最後はスプライトシートとしての設計と検証が効きます。
