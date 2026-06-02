export interface LogoResult {
  name: string;
  domain: string;
  logo_url: string;
}

export type SearchStrategy = "suggest" | "match";
export type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";
