import { CspPolicies, MediaImageScriptsAndCssSrc } from "@main/csp";

CspPolicies["raw.githubusercontent.com"] = MediaImageScriptsAndCssSrc;
