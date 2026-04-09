# Decisions

> 重要決策：時間、原因、取捨

## 格式

每一筆決策建議包含：
- **日期**：YYYY-MM-DD
- **決策**：一句話摘要
- **原因**：為什麼這樣選
- **取捨**：放棄了什麼、可接受的代價

---

## 決策紀錄

### 2026-04-09：Azure 採 Static Web Apps + CI bundle（cv-v2）
- **決策**：以 `scripts/prepare-azure-static.sh` 組出 `swa-output/`（`index.html` 為 `cv-v2.html`），由 `.github/workflows/azure-static-web-apps.yml` 上傳至 Azure Static Web Apps；倉庫 secret `AZURE_STATIC_WEB_APPS_API_TOKEN`。
- **原因**：專案主要可部署成品為靜態 cv-v2；無需在 Azure 跑 `next start`；SWA 含免費層與 HTTPS / 自訂網域。
- **取捨**：Next.js 完整 SSR 不在此 workflow；若需 App Service / Container 需另設管線。

### 2025-02-13：建立 docs/ 與 Tasks 工作流
- **決策**：採用 docs/MasterPlan、ImplementationPlan、DesignGuidelines、UserJourney、Decisions + Tasks.md + .cursor/rules/
- **原因**：跨 session 記憶、可維護、單一真相來源；Cursor 規則自動套用
- **取捨**：需定期更新，換取長期一致性

### 2025-02-13：導入 AI_INDEX、Writeback Protocol、護欄、設計來源唯一化
- **決策**：新增 docs/AI_INDEX.md 為唯一入口；00-global 加入 Writeback Protocol、護欄（禁止改 dist/public/archive、改動上限 6 檔）；Tasks 採可驗收格式；10-design 明定 tokens 來源（HTML→css/base.css、Next.js→tailwind.config.js）
- **原因**：降低 AI 讀錯文件、確保收尾可驗證、避免 scope 飄移與誤改成品目錄
- **取捨**：每回合輸出略增，換取可預測性

<!-- 範例：
### 2025-02-13：建立 docs/ 與 Tasks 工作流
- **決策**：採用 docs/MasterPlan、ImplementationPlan、DesignGuidelines、UserJourney、Decisions + Tasks.md
- **原因**：跨 session 記憶、可維護、單一真相來源
- **取捨**：需定期更新，換取長期一致性
-->
