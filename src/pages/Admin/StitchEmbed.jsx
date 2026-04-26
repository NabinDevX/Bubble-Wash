import { useMemo } from "react";

function stripGlobalHtmlBodyCss(cssText) {
  if (!cssText) return "";
  return cssText.replace(/(^|\n)\s*(html|body)\b[^\{]*\{[^\}]*\}\s*/g, "\n");
}

function stripShellOffsetClasses(el) {
  if (!el?.classList) return;

  [
    "ml-64",
    "pl-64",
    "mr-64",
    "pr-64",
    "mt-16",
    "pt-16",
    "top-16",
    "left-64",
    "md:ml-64",
    "md:pl-64",
    "md:mr-64",
    "md:pr-64",
    "md:mt-16",
    "md:pt-16",
    "md:top-16",
    "md:left-64",
    "w-screen",
    "min-h-screen",
    "h-screen",
  ].forEach((cls) => el.classList.remove(cls));
}

function removeShellLikeElements(doc) {
  if (!doc) return;

  const shellSelectors = [
    "body > aside",
    "body > nav",
    "body > header",
    "main > aside",
    "main > nav",
    "main > header",
  ];

  doc.querySelectorAll(shellSelectors.join(",")).forEach((el) => {
    const className = el.getAttribute("class") ?? "";
    const looksFixed = /(^|\s)(fixed|sticky)(\s|$)/.test(className);
    const looksPinned =
      className.includes("top-0") ||
      className.includes("left-0") ||
      className.includes("right-0") ||
      className.includes("bottom-0");

    if (looksFixed || looksPinned || el.tagName.toLowerCase() === "aside") {
      el.remove();
    }
  });
}

function parseStitchHtml(rawHtml, variant) {
  if (!rawHtml) return { bodyClassName: "", styles: "", bodyHtml: "" };

  const shellVariant = variant === "admin" || variant === "rider";

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, "text/html");

  doc.querySelectorAll("script").forEach((el) => el.remove());

  if (shellVariant) {
    removeShellLikeElements(doc);
  }

  const styles = stripGlobalHtmlBodyCss(
    Array.from(doc.querySelectorAll("style"))
      .map((styleEl) => styleEl.textContent ?? "")
      .join("\n"),
  );

  let contentRoot = doc.body;
  if (shellVariant) {
    const main = doc.body?.querySelector("main") ?? null;
    if (main) {
      const firstWrapper = main.firstElementChild;
      if (firstWrapper?.classList) {
        [
          "mt-16",
          "pt-16",
          "mt-14",
          "pt-14",
          "mt-20",
          "pt-20",
          "pt-[88px]",
          "pt-[80px]",
          "pt-[72px]",
          "pt-[64px]",
          "md:mt-16",
          "md:pt-16",
          "md:mt-14",
          "md:pt-14",
          "md:mt-20",
          "md:pt-20",
        ].forEach((cls) => firstWrapper.classList.remove(cls));
      }

      const directContent = main.querySelector(":scope > div") ?? null;

      const innerScroll =
        main.querySelector(":scope > div.custom-scroll") ??
        main.querySelector(':scope > div[class*="overflow-y-auto"]');

      contentRoot = innerScroll ?? directContent ?? main;
    }

    stripShellOffsetClasses(contentRoot);
    stripShellOffsetClasses(contentRoot?.firstElementChild ?? null);
  }

  const bodyClassName = shellVariant
    ? ""
    : (contentRoot?.getAttribute("class") ?? "");
  const bodyHtml = contentRoot?.innerHTML ?? "";

  return { bodyClassName, styles, bodyHtml };
}

export default function StitchEmbed({ html, className = "", variant }) {
  const parsed = useMemo(() => parseStitchHtml(html, variant), [html, variant]);
  const shellClassName =
    variant === "admin" || variant === "rider" ? "stitch-embed-shell" : "";

  return (
    <div className={className}>
      {parsed.styles ? (
        <style dangerouslySetInnerHTML={{ __html: parsed.styles }} />
      ) : null}
      <div
        className={`stitch-embed ${shellClassName} ${parsed.bodyClassName}`.trim()}
        dangerouslySetInnerHTML={{ __html: parsed.bodyHtml }}
      />
    </div>
  );
}
