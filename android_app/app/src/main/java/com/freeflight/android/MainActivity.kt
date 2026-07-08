package com.freeflight.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.freeflight.android.feature.home.FreeFlightHomeScreen
import com.freeflight.android.feature.home.HomeViewModel
import com.freeflight.android.ui.theme.FreeFlightTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            FreeFlightTheme {
                val viewModel: HomeViewModel = viewModel()
                val state by viewModel.uiState.collectAsStateWithLifecycle()

                FreeFlightHomeScreen(
                    state = state,
                    onSceneChange = viewModel::updateScene,
                    onPeriodChange = viewModel::updatePeriod,
                    onEmotionChange = viewModel::updateEmotion,
                    onInsightClick = viewModel::showInsight
                )
            }
        }
    }
}
