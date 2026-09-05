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
export function mountProfile(root: HTMLElement, adapter: {
  profile: ProfileAction;
  signIn: () => Promise<void>;
  linkX: () => Promise<void>;
  onIdentityChange?: (callback: () => void) => (() => void);
}): () => void;
