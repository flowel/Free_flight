package com.freeflight.android.feature.home

enum class PracticeScene(val label: String) {
    DAY("Day"),
    SLEEP("Sleep")
}

enum class EmotionState(
    val label: String,
    val icon: String,
    val description: String,
    val insight: String
) {
    DEFAULT(
        label = "自由飞行",
        icon = "\u2708",
        description = "小飞机正在自由飞行，等待手表数据或手动选择情绪状态。",
        insight = "暂无有效数据，请先连接手表或选择当前情绪。"
    ),
    CALM(
        label = "平静",
        icon = "\uD83D\uDE0C",
        description = "此刻的你比较放松，适合保持稳定的节奏与呼吸。",
        insight = "当前身心状态平稳，可以继续维持现在的舒适节奏。"
    ),
    SATISFIED(
        label = "满足",
        icon = "\u2600",
        description = "此刻的你安稳而舒展，整体状态偏向舒适。",
        insight = "当前满足感较强，适合延续这份平和与轻松。"
    ),
    HAPPY(
        label = "高兴",
        icon = "\uD83D\uDE04",
        description = "此刻的你心情愉悦，像小飞机正在轻盈穿行。",
        insight = "当前情绪积极，可以配合轻度呼吸练习保持稳定。"
    ),
    EXCITED(
        label = "兴奋",
        icon = "\uD83D\uDE03",
        description = "此刻能量偏高，节奏稍快，适合慢慢拉回稳定状态。",
        insight = "当前唤醒水平较高，建议进行均等放松呼吸。"
    ),
    TIRED(
        label = "疲倦",
        icon = "\uD83D\uDE2A",
        description = "此刻身体能量偏低，适合暂停片刻并温和恢复。",
        insight = "当前以疲倦为主，建议减少刺激并优先休息。"
    ),
    TENSE(
        label = "紧张",
        icon = "\uD83D\uDE1F",
        description = "此刻身体较为紧绷，适合放慢呼吸并缓解压力。",
        insight = "当前偏紧张，适合做 4-7-8 呼吸练习。"
    ),
    ANXIOUS(
        label = "焦虑",
        icon = "\uD83D\uDE25",
        description = "此刻思绪较密集，适合先跟随稳定节奏慢下来。",
        insight = "当前焦虑感较明显，建议先做稳定呼吸。"
    ),
    DEPRESSED(
        label = "沮丧",
        icon = "\uD83D\uDE14",
        description = "此刻情绪偏低落，适合从轻量调节开始恢复。",
        insight = "当前情绪低落，建议使用柔和的呼吸与音乐引导。"
    )
}

enum class TimePeriod(val title: String) {
    PRE_DAWN("凌晨"),
    EARLY_MORNING("拂晓"),
    MORNING("早上"),
    AFTERNOON("下午"),
    DUSK("黄昏"),
    SUNSET("暮光"),
    EVENING("晚上"),
    NIGHT("星空")
}

data class MetricState(
    val heartRate: Int,
    val heartRateUnit: String,
    val hrv: Int,
    val hrvUnit: String
)

data class HomeUiState(
    val userName: String,
    val greeting: String,
    val dateText: String,
    val weatherText: String,
    val selectedScene: PracticeScene,
    val selectedPeriod: TimePeriod,
    val emotionState: EmotionState,
    val metrics: MetricState,
    val breathingPrompt: String?,
    val primaryActionLabel: String
)
