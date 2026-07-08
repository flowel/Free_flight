package com.freeflight.android.feature.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.freeflight.android.ui.theme.FreeFlightTheme

@Composable
fun FreeFlightHomeScreen(
    state: HomeUiState,
    onSceneChange: (PracticeScene) -> Unit,
    onPeriodChange: (TimePeriod) -> Unit,
    onEmotionChange: (EmotionState) -> Unit,
    onInsightClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF0A1020),
                        Color(0xFF101A31),
                        Color(0xFF16233F),
                        Color(0xFF0C1428)
                    )
                )
            )
    ) {
        // TODO: Replace this with the actual flight animation surface for Android.
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            Color(0x2283A5FF),
                            Color.Transparent
                        )
                    )
                )
        )

        state.breathingPrompt?.let { prompt ->
            PromptBubble(
                text = prompt,
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(horizontal = 24.dp)
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 20.dp, vertical = 16.dp)
        ) {
            HeaderSection(
                state = state,
                onSceneChange = onSceneChange,
                onPeriodChange = onPeriodChange
            )

            Spacer(modifier = Modifier.height(320.dp))

            EmotionSummaryCard(
                state = state,
                onEmotionChange = onEmotionChange
            )

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = onInsightClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(62.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0x66303844),
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(18.dp)
            ) {
                Text(
                    text = "${state.emotionState.icon}  ${state.primaryActionLabel}",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

@Composable
private fun HeaderSection(
    state: HomeUiState,
    onSceneChange: (PracticeScene) -> Unit,
    onPeriodChange: (TimePeriod) -> Unit
) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Text(
                text = "COSLEEP | 随心飞",
                color = Color.White.copy(alpha = 0.78f),
                fontSize = 16.sp,
                letterSpacing = 1.2.sp
            )

            Column(horizontalAlignment = Alignment.End) {
                PeriodPills(
                    selected = state.selectedPeriod,
                    onPeriodChange = onPeriodChange
                )
                Spacer(modifier = Modifier.height(10.dp))
                SceneSwitch(
                    selected = state.selectedScene,
                    onSceneChange = onSceneChange
                )
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        Text(
            text = state.greeting,
            color = Color.White,
            fontSize = 30.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = state.dateText,
            color = Color.White.copy(alpha = 0.7f),
            fontSize = 14.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = state.weatherText,
            color = Color.White.copy(alpha = 0.62f),
            fontSize = 14.sp
        )
    }
}

@Composable
private fun PeriodPills(
    selected: TimePeriod,
    onPeriodChange: (TimePeriod) -> Unit
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        TimePeriod.entries.forEach { period ->
            val active = period == selected
            Surface(
                modifier = Modifier.clickable { onPeriodChange(period) },
                shape = RoundedCornerShape(999.dp),
                color = if (active) Color.White.copy(alpha = 0.22f) else Color.White.copy(alpha = 0.10f),
                contentColor = Color.White,
                tonalElevation = 0.dp
            ) {
                Text(
                    text = period.title,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    fontSize = 11.sp
                )
            }
        }
    }
}

@Composable
private fun SceneSwitch(
    selected: PracticeScene,
    onSceneChange: (PracticeScene) -> Unit
) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(999.dp))
            .background(Color.White.copy(alpha = 0.10f))
            .border(1.dp, Color.White.copy(alpha = 0.14f), RoundedCornerShape(999.dp))
            .padding(3.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        SceneChip(
            label = "昼",
            selected = selected == PracticeScene.DAY,
            onClick = { onSceneChange(PracticeScene.DAY) }
        )
        SceneChip(
            label = "夜",
            selected = selected == PracticeScene.SLEEP,
            onClick = { onSceneChange(PracticeScene.SLEEP) }
        )
    }
}

@Composable
private fun SceneChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(999.dp))
            .background(if (selected) Color.White.copy(alpha = 0.92f) else Color.Transparent)
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            color = if (selected) Color(0xFF1A2236) else Color.White.copy(alpha = 0.7f),
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
private fun EmotionSummaryCard(
    state: HomeUiState,
    onEmotionChange: (EmotionState) -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        color = Color(0x33242D3C),
        contentColor = Color.White
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .clip(CircleShape)
                        .background(Color(0xFF91A4C9)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = state.userName.take(1),
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                    Text(
                        text = state.userName,
                        color = Color.White,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = state.emotionState.description,
                        color = Color(0xFFF2C85E),
                        fontSize = 12.sp,
                        lineHeight = 18.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                MetricBlock(
                    value = state.metrics.heartRate.toString(),
                    unit = state.metrics.heartRateUnit,
                    label = "静息心率"
                )
                MetricBlock(
                    value = state.metrics.hrv.toString(),
                    unit = state.metrics.hrvUnit,
                    label = "心率变异"
                )
                EmotionBlock(
                    selected = state.emotionState,
                    onEmotionChange = onEmotionChange
                )
            }
        }
    }
}

@Composable
private fun MetricBlock(
    value: String,
    unit: String,
    label: String
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Row(verticalAlignment = Alignment.Bottom) {
            Text(
                text = value,
                color = Color.White,
                fontSize = 30.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = unit,
                color = Color.White.copy(alpha = 0.55f),
                fontSize = 11.sp
            )
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = label,
            color = Color.White.copy(alpha = 0.5f),
            fontSize = 11.sp
        )
    }
}

@Composable
private fun EmotionBlock(
    selected: EmotionState,
    onEmotionChange: (EmotionState) -> Unit
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = selected.icon,
            fontSize = 26.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        Column(
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            listOf(
                EmotionState.DEFAULT,
                EmotionState.CALM,
                EmotionState.HAPPY,
                EmotionState.EXCITED,
                EmotionState.TENSE
            ).forEach { emotion ->
                Surface(
                    modifier = Modifier.clickable { onEmotionChange(emotion) },
                    shape = RoundedCornerShape(10.dp),
                    color = if (emotion == selected) Color.White.copy(alpha = 0.2f) else Color.White.copy(alpha = 0.08f)
                ) {
                    Text(
                        text = emotion.label,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        color = Color.White,
                        fontSize = 11.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun PromptBubble(
    text: String,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        color = Color(0x8C0C1322)
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 18.dp, vertical = 14.dp),
            color = Color.White,
            fontSize = 15.sp,
            lineHeight = 22.sp,
            textAlign = TextAlign.Center
        )
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF09111F)
@Composable
private fun FreeFlightHomeScreenPreview() {
    FreeFlightTheme {
        FreeFlightHomeScreen(
            state = HomeUiState(
                userName = "胡萝卜须",
                greeting = "下午好",
                dateText = "2026年7月8日 星期三",
                weatherText = "多云 29°C",
                selectedScene = PracticeScene.DAY,
                selectedPeriod = TimePeriod.AFTERNOON,
                emotionState = EmotionState.CALM,
                metrics = MetricState(83, "bpm", 32, "ms"),
                breathingPrompt = "你似乎有些紧绷，来一起松一松",
                primaryActionLabel = "身心状态解读"
            ),
            onSceneChange = {},
            onPeriodChange = {},
            onEmotionChange = {},
            onInsightClick = {}
        )
    }
}
