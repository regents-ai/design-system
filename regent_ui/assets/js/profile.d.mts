export type ProfileOperation = "get" | "sync" | "update";
export type ProfileInput = {display_name?: string; wallet_address?: string | null};
export type ProfileResult = {
  ok: boolean;
  status: number | null;
  body?: any;
  error?: {code: string; outcome_unknown: boolean};
};
export type ProfileAction = (operation: ProfileOperation, input?: ProfileInput,
  options?: {signal?: AbortSignal; expectedProfileId?: string}) => Promise<ProfileResult>;
export type SavedName =
  | {ok: true; displayName: string | null; message: string}
  | {ok: false; message: string};
export function mountProfile(root: HTMLElement, adapter: {
  openProfile: () => ProfileAction;
  onSaved?: (displayName: string | null) => void;
}): () => void;
export function saveName(profile: ProfileAction, displayName: string,
  options?: {signal?: AbortSignal}): Promise<SavedName>;
