import { Binary } from "mongodb";

export type MUUID = Binary;
export type MODE = {
  v1: () => MUUID,
  v4: () => MUUID,
  from: (uuid: string | Binary) => MUUID,
  mode: MODE
}

export const v1: () => MUUID;
export const v4: () => MUUID;
export const from: (uuid: string | Binary) => MUUID;
export const mode: (mode: 'canonical'| 'relaxed') => MODE;
