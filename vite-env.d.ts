interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_ANALYTICS_REQUIRE_CONSENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __SCHOLARSHIP_ATLAS_GA_MEASUREMENT_ID__: string;
