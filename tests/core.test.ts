import { describe, expect, it } from "vitest";
import { generateOtpCode, hashPassword, verifyPassword } from "@/lib/security";
import { bn, formatNumber, localizeDigits, timeAgo } from "@/lib/utils";
import {
  CATEGORY_TABS,
  VALID_CATEGORY_VALUES,
  getCategoriesForTab,
  matchesTabCategory,
  translateCategory,
} from "@/lib/categories";
import { getDictionary } from "@/lib/i18n";

describe("security helpers", () => {
  it("hashes and verifies passwords accurately", () => {
    const hashed = hashPassword("secret123");
    expect(hashed).toContain(":");
    expect(verifyPassword("secret123", hashed)).toBe(true);
    expect(verifyPassword("wrongpass", hashed)).toBe(false);
    expect(verifyPassword("secret123", "malformed")).toBe(false);
  });

  it("generates 6-digit OTP codes", () => {
    for (let i = 0; i < 20; i++) {
      const code = generateOtpCode();
      expect(code).toMatch(/^\d{6}$/);
    }
  });
});

describe("locale & formatting utilities", () => {
  it("converts digits to Bengali or keeps Latin per locale", () => {
    expect(bn(12340)).toBe("১২৩৪০");
    expect(localizeDigits(98, "bn")).toBe("৯৮");
    expect(localizeDigits(98, "en")).toBe("98");
    expect(formatNumber(2500, 0, true)).toBe("২,৫০০");
    expect(formatNumber(2500, 0, false)).toBe("2,500");
  });

  it("formats relative timestamps in both Bengali and English", () => {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60_000);
    expect(timeAgo(fiveMinsAgo, "bn")).toContain("মিনিট আগে");
    expect(timeAgo(fiveMinsAgo, "en")).toBe("5m ago");
  });
});

describe("category tabs & bilingual dictionary", () => {
  it("defines all four navigation tabs", () => {
    expect(CATEGORY_TABS.map((t) => t.slug)).toEqual([
      "any-work",
      "transportation",
      "skilled",
      "caregiver",
    ]);
  });

  it("includes required subcategories per tab", () => {
    const transport = getCategoriesForTab("transportation").map((c) => c.value);
    expect(transport).toEqual(expect.arrayContaining(["Bike", "CNG", "Truck", "Van"]));

    const skilled = getCategoriesForTab("skilled").map((c) => c.value);
    expect(skilled).toEqual(
      expect.arrayContaining(["ইলেকট্রিশিয়ান", "প্লাম্বার", "ক্লিনার টিম"])
    );

    const caregiver = getCategoriesForTab("caregiver").map((c) => c.value);
    expect(caregiver).toEqual(
      expect.arrayContaining(["হাসপাতালে রোগীর দেখাশোনা", "বাসায় রোগীর দেখাশোনা"])
    );

    for (const tab of CATEGORY_TABS) {
      expect(VALID_CATEGORY_VALUES).toContain(tab.defaultCategory);
    }
  });

  it("filters and translates categories properly", () => {
    expect(matchesTabCategory("Truck", "transportation")).toBe(true);
    expect(matchesTabCategory("Truck", "caregiver")).toBe(false);
    expect(matchesTabCategory("Truck", "any-work")).toBe(true);

    expect(translateCategory("হাসপাতালে রোগীর দেখাশোনা", "en")).toBe(
      "Hospital Patient Care"
    );
    expect(translateCategory("হাসপাতালে রোগীর দেখাশোনা", "bn")).toBe(
      "হাসপাতালে রোগীর দেখাশোনা"
    );
  });

  it("has complete BN and EN dictionaries with matching 3-dot menu keys", () => {
    const bnDict = getDictionary("bn");
    const enDict = getDictionary("en");
    expect(Object.keys(bnDict.nav.menuItemsShort)).toEqual([
      "howWeWork",
      "whoWeAre",
      "joinWorker",
      "postWork",
      "help",
    ]);
    expect(Object.keys(enDict.nav.menuItemsShort)).toEqual(
      Object.keys(bnDict.nav.menuItemsShort)
    );
  });
});
