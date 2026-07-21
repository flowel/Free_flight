# Project Glossary

## 随心飞 (Free Flight)

The real-time biofeedback feature in 小睡眠 App. It uses Apple Watch (or alternative wearable) to collect continuous heart rate / RRI / HRV data, determines the user's emotional state, and provides real-time feedback through flight trajectory animations, emotional audio, breathing exercises, and external device联动.

## Emotion States (情绪状态)

The 8 discrete emotional states recognized by the system:

- 疲倦 (Fatigued)
- 平静 (Calm)
- 满足 (Content)
- 高兴 (Happy)
- 兴奋 (Excited)
- 紧张 (Nervous)
- 焦虑 (Anxious)
- 沮丧 (Depressed)

These map to 4 feedback intervals for trajectory and audio selection.

## Feedback Intervals (反馈区间)

The 4 categories that map emotion states to flight behavior and audio:

| Interval | Emotions | Flight Style | Audio Style |
| --- | --- | --- | --- |
| 专注平静 (Focused/Calm) | 平静, 满足, 高兴 | Normal: slow flight, distant flight | Calm audio |
| 兴奋高兴 (Excited/Happy) | 兴奋 | Playful: spins, loops, rolls | Playful audio |
| 疲倦沮丧 (Fatigued/Depressed) | 疲倦, 沮丧 | Weary: low flight, grass resting | Gentle audio |
| 焦虑紧张 (Anxious/Nervous) | 紧张, 焦虑 | Agitated: shaking straight/curved flight | Tense audio |

## Data Pipeline

The real-time data flow: Apple Watch continuous HR (5s interval) → RRI derivation → emotion calculation → state update every 60s (first at 30s). Update nodes: `30s → 1m30s → 2m30s → 3m30s → 4m30s` (5 updates in a 5-minute session).

## Trajectory Pool (轨迹池)

Collections of flight animation sequences:
- **Normal trajectories** (正常轨迹): < 15s free flight sequences.
- **Special trajectories** (特殊轨迹): > 30s extended flight sequences.
- **Free flight pool** (自由飞行): Normal + special trajectories mixed, used during no-state or transition periods (6-12 types).
- **Emotion trajectories** (情绪轨迹): Per-interval pools, 4-8 types each.
- Selection uses FIFO with random draw; used trajectories get a 120s cooldown with watch, or are excluded until pool reset without watch.

## Breathing Exercises

Two breathing protocols triggered based on scene and state:
- **均等呼吸 (Equal Breathing)**: Day mode, triggered for 疲倦/兴奋/紧张/焦虑/沮丧. Goal: stabilize rhythm, relax.
- **4-7-8 Breathing**: Night mode (睡前), triggered only for 沮丧/焦虑/紧张/兴奋. Goal: reduce pre-sleep arousal.

## Watch Modes

- **With Watch (有手表)**: Full emotion detection, real-time HR display, emotion icon updates, per-emotion audio.
- **Without Watch (无手表)**: Free flight pool only, random audio, 50%/min special trajectory probability, "建议可穿戴设备" prompt.
- **Watch Disconnected (手表断开)**: HR shows `--`, fallback to no-watch mode, "手表断开" icon displayed.

## Audio Crossfade (音频渐变)

The 3-second fade-in/fade-out transition between emotion audio tracks using two hidden `<audio>` elements. Triggered only when emotion state changes; no transition when state is unchanged.

## External Device联动

Integration with the negative ion generator (负氧离子机):
- Controls: on/off, concentration, lighting.
- Triggers: breathing exercise start, pre-sleep flow entry.
- Development directory: `D:\workspace\air_ionizer`.

## RRI / HRV

R-R Interval / Heart Rate Variability. The time between consecutive heartbeats, derived from Apple Watch continuous heart rate data. Used as input for emotion and stress calculation. The system records 5-second HR samples → derives RRI → computes emotion state.
