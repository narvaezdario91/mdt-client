export interface MDTConfig {
  api?: {
    url?: string;
  };
  paths?: {
    features?: string;
    steps?: string;
    reports?: string;
    cache?: string;
  };
  execution?: {
    useCache?: boolean;
    report?: string;
  };
  mcp?: {
    type?: string;
    command?: string;
    args?: string[];
    [key: string]: any;
  };
}
