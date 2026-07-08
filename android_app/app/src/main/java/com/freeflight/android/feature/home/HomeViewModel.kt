package com.freeflight.android.feature.home

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class HomeViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(
        HomeUiState(
            userName = "胡萝卜须",
            greeting = "下午好",
            dateText = "2026年7月8日 星期三",
            weatherText = "多云 29°C",
            selectedScene = PracticeScene.DAY,
            selectedPeriod = TimePeriod.AFTERNOON,
            emotionState = EmotionState.DEFAULT,
            metrics = MetricState(
                heartRate = 83,
                heartRateUnit = "bpm",
                hrv = 32,
                hrvUnit = "ms"
            ),
            breathingPrompt = null,
            primaryActionLabel = "身心状态解读"
        )
    )

    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    fun updateScene(scene: PracticeScene) {
        _uiState.update { state ->
            state.copy(
                selectedScene = scene,
                breathingPrompt = resolveBreathingPrompt(scene, state.emotionState)
            )
        }
    }

    fun updatePeriod(period: TimePeriod) {
        _uiState.update { it.copy(selectedPeriod = period, greeting = greetingFor(period)) }
    }

    fun updateEmotion(emotionState: EmotionState) {
        _uiState.update { state ->
            state.copy(
                emotionState = emotionState,
                breathingPrompt = resolveBreathingPrompt(state.selectedScene, emotionState)
            )
        }
    }

    fun showInsight() {
        _uiState.update { state ->
            state.copy(breathingPrompt = state.emotionState.insight)
        }
    }

    private fun resolveBreathingPrompt(
        scene: PracticeScene,
        emotionState: EmotionState
    ): String? {
        return when (scene) {
            PracticeScene.DAY -> when (emotionState) {
                EmotionState.TIRED -> "你似乎有些疲惫，来一起放松一会儿"
                EmotionState.EXCITED -> "你似乎有些兴奋，来一起慢慢平静下来"
                EmotionState.TENSE -> "你似乎有些紧绷，来一起松一松"
                EmotionState.ANXIOUS -> "你似乎有些不安，来一起缓一缓"
                EmotionState.DEPRESSED -> "你似乎有些低落，来一起安顿一下心绪"
                else -> null
            }

            PracticeScene.SLEEP -> when (emotionState) {
                EmotionState.EXCITED -> "你似乎还有些清醒，来一起慢慢安静下来"
                EmotionState.TENSE -> "你似乎有些紧张，来一起放松入睡"
                EmotionState.ANXIOUS -> "你似乎有些不安，来一起慢慢放下"
                EmotionState.DEPRESSED -> "你似乎有些沉重，来一起轻轻安顿下来"
                else -> null
            }
        }
    }

    private fun greetingFor(period: TimePeriod): String {
        return when (period) {
            TimePeriod.PRE_DAWN -> "凌晨好"
            TimePeriod.EARLY_MORNING -> "拂晓好"
            TimePeriod.MORNING -> "早上好"
            TimePeriod.AFTERNOON -> "下午好"
            TimePeriod.DUSK -> "黄昏好"
            TimePeriod.SUNSET -> "暮光里"
            TimePeriod.EVENING -> "晚上好"
            TimePeriod.NIGHT -> "星空下"
        }
    }
}
