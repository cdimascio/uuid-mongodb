import { Binary } from "mongodb";

export type UUIDFormat = 'N' | 'D' | 'B' | 'P';
export interface MUUID extends Binary {
  /**
   * Converts the uuid into its canonical representation.
   * @param format The type of canonical representation.
   *  "N" for 32 digits, e.g. 00000000000000000000000000000000;
   *  "D" for 32 digits separated by hyphens (default), e.g. 00000000-0000-0000-0000-000000000000;
   *  "B" for 32 digits separated by hyphens, enclosed in braces, e.g. {00000000-0000-0000-0000-000000000000}; or
   *  "P" for 32 digits separated by hyphens, enclosed in parentheses, e.g. (00000000-0000-0000-0000-000000000000)
   */
  toString(format?: UUIDFormat): string;
}
export type Mode = {
  v1: () => MUUID,
  v4: () => MUUID,
  from: (uuid: string | Binary) => MUUID,
  mode: Mode
}

export const v1: () => MUUID;
export const v4: () => MUUID;
export const from: (uuid: string | Binary) => MUUID;
export const mode: (mode: 'canonical'| 'relaxed') => Mode;
