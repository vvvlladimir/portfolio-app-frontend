import { validateCSV } from "@/shared/lib/csv";
import { getApiUrl, API_CONFIG } from "@/config/api";

export type UploadStatus = "idle" | "loading" | "success" | "error";

export interface UploadResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
}

export class UploadService {
  private static readonly CSV_HEADERS = ["Date", "Ticker", "Type", "Shares", "Value", "Currency"];

  static async validateCSVFile(file: File): Promise<FileValidationResult> {
    try {
      // Validation of file type
      if (!file.type.includes("csv") && !file.name.endsWith(".csv")) {
        return {
          isValid: false,
          error: "File should be in CSV format"
        };
      }

      // Validate CSV structure
      await validateCSV(file, this.CSV_HEADERS);

      return {
        isValid: true,
        file
      };
    } catch (error) {
      return {
        isValid: false,
        error: (error as Error)?.message || "CSV validation failed"
      };
    }
  }

  static async uploadCSV(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = getApiUrl(API_CONFIG.endpoints.transactions.upload);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json() as { message?: string };
        return {
          success: false,
          message: data.message || "Upload failed"
        };
      }

      const result = await response.json();
      console.log(result)

      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error)?.message || "Unexpected error during upload"
      };
    }
  }
}
