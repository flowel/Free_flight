# 随心飞跨端配置交付与今日报告预留：实施计划

**目标：** 将已交付的随心飞设计沉淀为可版本化的配置包、跨端会话契约和 iOS 交接材料。Android 以 Smart Band Demo 的第三页“随心飞验证”作为真实硬件验证宿主；结束后的会话能被未来小睡眠 App 的随心飞与今日报告安全消费。

## 本轮边界

- 随心飞是用户主动开启的“发现状态—即时干预—衔接睡眠”会话，不是全天自动压力监控。
- 默认会话为 5 分钟：前 30 秒采样，在 30、90、150、210、270 秒更新状态。
- 默认 5 分钟会话最多一次呼吸干预。第二次仅适用于未来 13–30 分钟扩展会话，且至少相隔 10 分钟。
- 日间正式身心负荷结论仅来自 iWatch 主动会话的有效样本，或未来验证过的原生 PPI/RRI。低频心率和厂商压力值只能探索性展示。
- 今日报告只消费结构化会话结论；不从随心飞原始心率重新推导压力，不建立独立睡前准备页面。

## 交付架构

配置包（JSON、Schema、素材清单）供 iOS 和 Android 共同读取；两端负责设备采样、播放、渲染和本地会话管理。会话结束时统一写入 FreeFlightSessionSummary v1，今日报告只读取允许字段。

## 已确认的 Android 验证主线

Smart Band Demo 是 WearableKit 的 Android 验证宿主，而不是正式小睡眠 App 的前身。现有“连接”和“睡眠”Tab 保持各自的硬件/离线数据验证职责；新增第三个平级 Tab“随心飞验证”，验证一次完整的真实实时会话。

- Demo 中保留：设备厂商选择、绑定/扫描、原始包与调试日志、fixture 回放、强制断连与模拟状态。
- WearableKit 中沉淀：数据来源与质量、会话生命周期、状态节点、内容配置、反馈映射、会话摘要及 RRI/PPI 有效性判定。
- 小睡眠 App 中承接：正式随心飞入口与表现、睡眠监测跳转、晨起睡眠报告、今日报告、隐私授权和用户级数据管理。

此前内部使用的 PsyWatch 名称不再作为产品或模块名称；后续文档和接口统一称 WearableKit，旧算法实现仅作为其内部细节。

## 第一阶段交付物

| 文件 | 内容 | 交付对象 |
|---|---|---|
| config/free-flight-content-v1.json | 时序、状态映射、音频/轨迹资源 ID、降级、转场 | iOS、Android |
| config/free-flight-interventions-v1.json | 场景呼吸策略、次数、冷却、文案 ID | iOS、Android |
| config/free-flight-content-v1.schema.json | 枚举与字段校验 | 开发、测试 |
| docs/free-flight-assets-v1.md | 资源 ID、实际素材路径、时长、循环、替代项 | 设计、两端 |
| docs/free-flight-ios-handoff-v1.md | iOS 接入步骤、接口、异常、验收脚本 | iOS |
| docs/free-flight-session-contract-v1.md | 跨端会话摘要与事件 | 两端、今日报告 |
| docs/free-flight-day-report-mapping-v1.md | 今日报告可用/禁用字段 | 产品、客户端 |
| docs/fixtures/free-flight/ | 有效、无设备、断连、睡前样本 | 两端测试 |

## 配置规则

### 内容配置

- 资源使用 ASCII assetId，例如 audio.tense.loop.01；中文真实路径只写在素材清单，避免两端编码或重命名失配。
- 状态枚举为 focused_calm、excited_happy、fatigued_low、tense_anxious。
- 每个状态定义 audioGroupId、trajectoryGroupId、文案色调和动画选择规则。
- 状态变化时音频 3 秒交叉淡入淡出；会话结束时 3 秒淡出。
- 动画按 FIFO 选择，同一资源复用冷却 120 秒；特殊轨迹概率和每分钟上限写进配置。
- 无设备：开始后 10 秒提示连接，仍无数据则使用默认音频/常规轨迹，质量标记为 insufficient。
- 断连：心率显示为 --，会话可安全完成，但不得产生正式 HRV/压力结论。

### 呼吸干预配置

- day 场景：疲倦、兴奋、紧张、焦虑、低落可用等时呼吸。
- sleep 场景：兴奋、紧张、焦虑、低落可用 4-7-8 呼吸。
- 默认 300 秒规则：最多一次干预，最小间隔 600 秒。
- 0–120 秒不干预；180–720 秒最多一次；780–1800 秒最多两次。
- 默认 5 分钟只使用宽泛、低打扰的首次 B 类文案；第二次才使用更具体的 A 类文案。
- 每条文案必须有 copyId、展示时长、可跳过性和对应协议；不得做医疗诊断或效果承诺。

### Schema 与版本

- 内容和干预配置均有 schemaVersion、contentVersion。
- 校验状态枚举、节点递增、节点不超过会话时长、assetId 存在、时长与干预上限一致。
- 配置下载后校验失败，不覆盖上一份已验证配置；未知大版本回退内置默认配置。
- 会话摘要写入内容、算法和客户端版本，不能以服务端当前配置回推历史。

## iOS 接入顺序

### Slice 1：离线体验闭环

- 读取两份本地配置，完成倒计时、初始采样态、默认音频/轨迹、状态切换和完成页。
- 无设备提示后继续，并写 source=no_wearable、analysisQuality=insufficient 的摘要。
- 验收：五个节点、3 秒转场、结束淡出、资源冷却和默认降级正确。

### Slice 2：Apple Watch 主动会话

- 定义等价的 WearableSessionPort：start、心率样本、状态节点、disconnect、finish。
- 仅在用户启动随心飞时请求 Watch 会话数据；启动、断连、恢复、结束均有时间戳。
- 数据层给出样本数、覆盖率、来源、算法/设备版本和有效性。低频 BPM 可展示，但不能标为正式 HRV。
- 验收：有效样本、无样本、断连恢复、断连未恢复四组 fixture 都写出正确摘要。

### Slice 3：跨入口

- 显式传入 scene=day 或 scene=sleep；两种场景使用不同呼吸协议。
- 完成页只提供可选动作：继续放松、开始睡眠监测、返回。
- 睡眠监测跳转携带 entrySource=free_flight 与 sessionId；直接返回不重复统计。

iOS 交接包必须包含配置、Schema、资产清单、fixture、会话契约、页面状态表和验收录屏脚本。

## Android：Smart Band Demo 第三页验证规划

不再以独立的 Free_flight/android_app 作为真实设备验证主线；它保留作 Compose 技术/视觉参考。真实数据链在 D:\WorkSpace\Smart_Band\android-heart-rate-tool 中实现，并复用现有 WearableKit、连接与睡眠能力。

| 模块 | 计划位置 |
|---|---|
| 第三个 Tab 与页面挂载 | android-heart-rate-tool/app/src/main/java/com/smartband/tool/MainActivity.kt、ui/UiState.kt |
| 会话状态机 | android-heart-rate-tool/app/src/main/java/com/smartband/tool/wearable/ 下新增随心飞会话模块 |
| WearableKit 数据接入 | 复用现有 wearable/WearableKit.kt、MonitoringSessionManager.kt 和已绑定设备通道 |
| UI 状态消费 | android-heart-rate-tool/app/src/main/java/com/smartband/tool/ui/HeartRateToolViewModel.kt 及新增验证页组件 |
| 音频、轨迹与配置 | 验证模块读取共享 assetId/config；具体渲染实现可参考 Free_flight/android_app |
| 摘要存储 | WearableKit 派生健康记录/会话仓储，输出 FreeFlightSessionSummary v1 |

顺序为：WearableKit 连通和质量判定 → 配置驱动的无设备闭环 → fixture 回放 → 真实手环会话 → 睡眠监测/今日报告迁移接口。Demo 的模拟状态不得进入正式统计或报告。

Android 额外验收：配置失效回退、中文资源路径映射、前后台切换、音频焦点抢占、会话重建不重复插入摘要。

## 跨端会话摘要

FreeFlightSessionSummary v1 至少包含：

- sessionId、startedAt、endedAt、scene、outcome。
- source：apple_watch_active、band_native_ppi、band_exploratory、no_wearable。
- analysisQuality：valid、exploratory、insufficient。
- contentVersion、algorithmVersion、clientVersion。
- 状态时间线（节点、状态、置信度），心率摘要（首末 BPM、样本数）。
- HRV 摘要（rmssdMs、baselineDelta、provenance，可为空），干预协议及完成状态，nextAction。

只有 valid 可进入正式身心负荷结论。未经原生峰值间期验证，rmssdMs 和正式压力字段必须为空，绝不以 5/7 秒 BPM 填充。原始逐秒心率/RRI 不进入今日报告模型，按独立同意与保留策略处理。中断会话保留 outcome，但默认不计为完成干预。

## 今日报告与睡眠预留

今日报告是日终总结，不等同于晨起睡眠报告。它可整合睡眠恢复、日间有效主动测量、运动/习惯和随心飞完成情况，再给出可选行动。

随心飞允许提供：有效性与来源、完成次数/时长/结果、最后状态与趋势、干预完成情况、nextAction。今日报告不得读取原始 BPM 序列、未经验证厂商压力分、单次情绪标签作为全天结论、无有效来源的 HRV。

衔接规则：

1. 今日负荷高且临近入睡时，推荐 sleep 场景随心飞或放松。
2. 活动不足且距睡眠仍充足时，可建议轻量活动/拉伸，并结合活动强度、结束时间和恢复状态。
3. 随心飞进入睡眠监测后写关联 ID；次晨报告只做纵向关联，不宣称单次干预造成睡眠改善。
4. 手环睡眠数据另走统一融合：厂商/Health 原始睡眠 + 小睡眠本地数据 → 统一时间线 → 小睡眠自有计分与报告。随心飞不承担睡眠评分。

## Fixture 与验收

必须制作五组跨端 fixture：

1. day-valid-watch-completed：有效 iWatch 主动样本、紧张、一次等时呼吸、进入睡眠监测。
2. sleep-valid-watch-completed：睡眠场景、一次 4-7-8、进入睡眠监测。
3. no-wearable-completed：10 秒提示后默认播放，quality=insufficient。
4. device-disconnected：中途断连、BPM 显示 --、不进入正式结论。
5. exploratory-band：厂商压力/低频心率仅探索展示，正式 HRV 字段为空。

共同验收：状态节点正确且缺失时延续上次状态；5 分钟至多一次干预；无设备/断连/配置失效不会伪造有效结论；音频转场和淡出均为 3 秒；摘要完整记录版本、来源、质量；今日报告只使用允许字段。

## 四周推进

| 周期 | 你的产出 | 关口 |
|---|---|---|
| 第 1 周 | 配置字段、素材清点、JSON/Schema 初稿、iOS 交接文档 | iOS 用 fixture 可完成离线闭环 |
| 第 2 周 | Smart Band Demo 新增随心飞验证 Tab；无设备和 fixture 闭环 | 连接/睡眠不回归，第三页可独立演示 |
| 第 3 周 | WearableKit 实时数据接入、状态节点和异常样本验收 | valid/exploratory/insufficient 不混淆 |
| 第 4 周 | 摘要落库、睡眠监测跳转、迁移接口验证 | 小睡眠可消费随心飞摘要而不依赖 Demo UI |

若 iOS 兼职资源延迟，配置包、fixture 与 Android 离线闭环仍可独立推进。

## 本轮不做

- 独立压力首页、全天连续压力曲线，或用被动/低频 iWatch 心率伪造连续 HRV。
- 将厂商压力分或情绪标签等同医学压力/心理诊断。
- 重做晨起睡眠报告；本轮只预留今日报告字段。
- 将厂商睡眠分作为最终小睡眠评分。
- 未经明确同意的健康数据上传、跨用途使用或自动外部设备控制。

## 开始前确认

1. 设计确认每个状态对应的音频/轨迹资源与默认资源。
2. iOS 确认 Watch 主动会话字段、采样频率、前后台限制、断连事件。
3. 算法确认状态节点、置信度和有效样本判定；旧 5 秒心率算法不得误标正式 HRV。
4. 产品确认今日报告首版只做会话结论与行动入口，不承诺全天压力分或因果改善。
