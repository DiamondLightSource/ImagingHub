import { Beamline, SessionSelectionMode } from "../../types";
import { InstrumentSession } from "../Deprecated/OldSessionSelector";

/**
 * Determine the current session based on which session-selection mode is enabled.
 *
 * Note: if the session-selection mode is "latest", then the current session will only be
 * updated to the `customSession` state if the session input string both matches the visit
 * regex and the string corresponds to an actual visit (when both conditions are fulfilled,
 * the `customSession` state is not `null`).
 */
export const determineCurrentSession = (
  mode: SessionSelectionMode,
  latestSession: InstrumentSession,
  customSession: InstrumentSession | null
): InstrumentSession => {
  if (mode === SessionSelectionMode.Latest) {
    return latestSession;
  } else if (mode === SessionSelectionMode.Custom && customSession !== null) {
    return customSession;
  } else {
    // The only other possible case is:
    // ```
    // mode === SessionSelectionMode.Custom && customSession === null
    // ```
    // and in this case the latest visit is selected.
    //
    // Used an else rather than else-if so then TypeScript knows that all cases have been
    // exhausted and won't say that `session` or `sessionName` may be undefined.
    return latestSession;
  }
};

export const mapStringsToBeamline = (beamline: string): Beamline | null => {
  switch (beamline) {
    case "DIAD":
      return Beamline.DIAD;
    case "I08-1":
      return Beamline["I08-1"];
    case "I12":
      return Beamline.I12;
    case "I13-1":
      return Beamline["I13-1"];
    case "I13-2":
      return Beamline["I13-2"];
    case "I14":
      return Beamline.I14;
    default:
      console.error(`Unrecognised beamline: ${beamline}`);
      return null;
  }
};
