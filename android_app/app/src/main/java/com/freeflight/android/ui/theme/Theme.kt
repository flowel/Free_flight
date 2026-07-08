package com.freeflight.android.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val FreeFlightColorScheme = darkColorScheme(
    primary = GlassWhite,
    secondary = AccentGold,
    background = NightNavy,
    surface = DeepBlue
)

@Composable
fun FreeFlightTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = FreeFlightColorScheme,
        typography = FreeFlightTypography,
        content = content
    )
}
