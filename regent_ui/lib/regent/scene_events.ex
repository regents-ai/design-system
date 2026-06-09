defmodule Regent.SceneEvents do
  @moduledoc """
  Centralizes LiveView <-> hook event names and push helpers for Regent surfaces.

  ## Server -> client events

  Pushed with the `push_scene_*` helpers and handled by the `RegentScene` hook
  (`assets/js/hooks/regent_scene.ts`):

  | Event | Payload | Hook behaviour |
  | ----- | ------- | -------------- |
  | `regent:scene_replace` | `%{scene: scene}` (full `Regent.SceneSpec` map) | Re-renders the scene, then pushes `regent:surface_ready` |
  | `regent:scene_patch` | map with optional `activeFace`, `selectedTargetId`, `sceneVersion` | Updates dataset attrs and re-renders from the DOM |
  | `regent:scene_focus` | `%{target_id: id_or_nil}` | Focuses (or clears focus on) the target |
  | `regent:scene_pulse` | `%{target_id: id, state: state}` | Plays a pulse animation on the target |
  | `regent:scene_ghost` | `%{target_id: id, diff: map}` | Renders a ghost/preview diff on the target |

  ## Client -> server events

  Pushed by the hook; handle them in your LiveView's `handle_event/3`:

  | Event | Payload |
  | ----- | ------- |
  | `regent:surface_ready` | `scene_version`, `active_face`, `rendered_targets` |
  | `regent:surface_error` | `phase` (`"parse"`, `"render"`, or `"interact"`), `message` |
  | `regent:node_select` | `target_id`, `face_id`, `kind`, `sigil`, `status`, `intent`, `action_label`, `back_target_id`, `history_key`, `group_role`, `click_tone`, `meta` |
  | `regent:node_hover` | same shape as `regent:node_select` |
  """

  import Phoenix.LiveView, only: [push_event: 3]

  @scene_replace "regent:scene_replace"
  @scene_patch "regent:scene_patch"
  @scene_focus "regent:scene_focus"
  @scene_pulse "regent:scene_pulse"
  @scene_ghost "regent:scene_ghost"

  def scene_replace_event, do: @scene_replace
  def scene_patch_event, do: @scene_patch
  def scene_focus_event, do: @scene_focus
  def scene_pulse_event, do: @scene_pulse
  def scene_ghost_event, do: @scene_ghost

  def push_scene_replace(socket, scene), do: push_event(socket, @scene_replace, %{scene: scene})

  def push_scene_patch(socket, attrs) when is_map(attrs),
    do: push_event(socket, @scene_patch, attrs)

  def push_scene_focus(socket, target_id),
    do: push_event(socket, @scene_focus, %{target_id: target_id})

  def push_scene_pulse(socket, target_id, state),
    do: push_event(socket, @scene_pulse, %{target_id: target_id, state: state})

  def push_scene_ghost(socket, target_id, diff),
    do: push_event(socket, @scene_ghost, %{target_id: target_id, diff: diff})
end
