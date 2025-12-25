import { CommonOptions } from "../types"; 

export function applyCommonOptions(args: string[], options?: CommonOptions): void {
  if (!options) {
    return;
  }
  if (typeof options.firstPage === "number") {
    args.push("-f", String(options.firstPage));
  }
  if (typeof options.lastPage === "number") {
    args.push("-l", String(options.lastPage));
  }
  if (options.userPassword) {
    args.push("-upw", options.userPassword);
  }
  if (options.ownerPassword) {
    args.push("-opw", options.ownerPassword);
  }
  if (options.quiet) {
    args.push("-q");
  }
}

export function collectExtraArgs(
  options?: { extraArgs?: string[]; rawArgs?: string[] },
  extraArgs?: string[]
): string[] {
  return [
    ...(options?.extraArgs ?? []),
    ...(options?.rawArgs ?? []),
    ...(extraArgs ?? [])
  ];
}
