import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyPassword } from "./utils.js";

// Mock argon2
vi.mock("argon2", () => ({
    verify: vi.fn(),
}));

import { verify } from "argon2";

describe("Auth Utils", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("verifyPassword", () => {
        it("should return true when password matches hash", async () => {
            const mockVerify = vi.mocked(verify);
            mockVerify.mockResolvedValue(true);

            const result = await verifyPassword("hashed_password", "correct_password");

            expect(result).toBe(true);
            expect(mockVerify).toHaveBeenCalledWith("hashed_password", "correct_password");
        });

        it("should return false when password does not match hash", async () => {
            const mockVerify = vi.mocked(verify);
            mockVerify.mockResolvedValue(false);

            const result = await verifyPassword("hashed_password", "wrong_password");

            expect(result).toBe(false);
            expect(mockVerify).toHaveBeenCalledWith("hashed_password", "wrong_password");
        });

        it("should return false when argon2 throws an error", async () => {
            const mockVerify = vi.mocked(verify);
            mockVerify.mockRejectedValue(new Error("Argon2 error"));

            const result = await verifyPassword("invalid_hash", "password");

            expect(result).toBe(false);
        });

        it("should handle empty strings gracefully", async () => {
            const mockVerify = vi.mocked(verify);
            mockVerify.mockResolvedValue(false);

            const result = await verifyPassword("", "");

            expect(result).toBe(false);
            expect(mockVerify).toHaveBeenCalledWith("", "");
        });

        it("should return false when verification fails with exception", async () => {
            const mockVerify = vi.mocked(verify);
            const error = new Error("Hash corruption");
            mockVerify.mockRejectedValue(error);

            const result = await verifyPassword("corrupted_hash", "password");

            expect(result).toBe(false);
        });
    });
});
