import { describe, expect, it } from "vitest";
import { isGmail, nameFromGmail, normalizeGmail } from "./gmail";

describe("isGmail", () => {
  it("aceita gmail e googlemail", () => {
    expect(isGmail(" ana.clara@gmail.com ")).toBe(true);
    expect(isGmail("ANA@Gmail.COM")).toBe(true);
    expect(isGmail("joao@googlemail.com")).toBe(true);
  });

  it("recusa outros provedores", () => {
    expect(isGmail("jovem@outlook.com")).toBe(false);
    expect(isGmail("gmail.com")).toBe(false);
    expect(isGmail("a@gmail.com.br")).toBe(false);
  });
});

describe("nameFromGmail", () => {
  it("monta um nome a partir do endereço", () => {
    expect(normalizeGmail(" Ana@Gmail.com ")).toBe("ana@gmail.com");
    expect(nameFromGmail("ana.clara@gmail.com")).toBe("Ana Clara");
  });
});
