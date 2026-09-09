import { codeToHast } from "shiki";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type ReactNode } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

export const CODE_THEME = "vesper";

export async function highlightToReact(
  code: string,
  lang: string,
): Promise<ReactNode> {
  const hast = await codeToHast(code, { lang, theme: CODE_THEME });
  return toJsxRuntime(hast, { Fragment, jsx, jsxs });
}
