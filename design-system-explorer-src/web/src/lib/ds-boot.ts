// Shared boot for every design-system gallery page: load the DS stylesheet
// chain in cascade order (tokens → base → components) and wire the gallery
// chrome. Each page entry is a one-liner that imports this.
import "../styles/ds-tokens.css";
import "../styles/ds-base.css";
import "../styles/ds-components.css";
import { initDsChrome } from "./ds-chrome";
import { initDsTheme } from "./ds-theme";

initDsTheme();   // apply any picked primary/secondary (persisted), wire the builder
initDsChrome();
