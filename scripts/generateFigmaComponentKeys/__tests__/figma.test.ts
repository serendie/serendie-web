import { afterEach, describe, expect, it } from "vitest";
import { resolveFigmaEnv } from "../figma";

describe("resolveFigmaEnv", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("FIGMA_ACCESS_TOKEN と FIGMA_FILE_KEY から解決する", () => {
    process.env.FIGMA_ACCESS_TOKEN = "token-123";
    process.env.FIGMA_FILE_KEY = "file-abc";

    const result = resolveFigmaEnv();
    expect(result).toEqual({ token: "token-123", fileKey: "file-abc" });
  });

  it("PERSONAL_ACCESS_TOKEN と FILE_KEY のフォールバックで解決する", () => {
    delete process.env.FIGMA_ACCESS_TOKEN;
    delete process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
    delete process.env.FIGMA_FILE_KEY;
    process.env.PERSONAL_ACCESS_TOKEN = "pat-456";
    process.env.FILE_KEY = "file-def";

    const result = resolveFigmaEnv();
    expect(result).toEqual({ token: "pat-456", fileKey: "file-def" });
  });

  it("FIGMA_PERSONAL_ACCESS_TOKEN でも解決できる", () => {
    delete process.env.FIGMA_ACCESS_TOKEN;
    delete process.env.PERSONAL_ACCESS_TOKEN;
    process.env.FIGMA_PERSONAL_ACCESS_TOKEN = "fpat-789";
    process.env.FIGMA_FILE_KEY = "file-ghi";

    const result = resolveFigmaEnv();
    expect(result).toEqual({ token: "fpat-789", fileKey: "file-ghi" });
  });

  it("トークンが未設定の場合はエラー", () => {
    delete process.env.FIGMA_ACCESS_TOKEN;
    delete process.env.PERSONAL_ACCESS_TOKEN;
    delete process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
    process.env.FIGMA_FILE_KEY = "file-abc";

    expect(() => resolveFigmaEnv()).toThrow(
      "FIGMA_ACCESS_TOKEN (or PERSONAL_ACCESS_TOKEN) and FIGMA_FILE_KEY (or FILE_KEY) are required."
    );
  });

  it("ファイルキーが未設定の場合はエラー", () => {
    process.env.FIGMA_ACCESS_TOKEN = "token-123";
    delete process.env.FIGMA_FILE_KEY;
    delete process.env.FILE_KEY;

    expect(() => resolveFigmaEnv()).toThrow(
      "FIGMA_ACCESS_TOKEN (or PERSONAL_ACCESS_TOKEN) and FIGMA_FILE_KEY (or FILE_KEY) are required."
    );
  });

  it("両方とも未設定の場合はエラー", () => {
    delete process.env.FIGMA_ACCESS_TOKEN;
    delete process.env.PERSONAL_ACCESS_TOKEN;
    delete process.env.FIGMA_PERSONAL_ACCESS_TOKEN;
    delete process.env.FIGMA_FILE_KEY;
    delete process.env.FILE_KEY;

    expect(() => resolveFigmaEnv()).toThrow();
  });
});
