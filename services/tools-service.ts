/**
 * Tools Service
 * Handles tools-related API calls (GST, Trademark, Invoice, Challan)
 */

import { API_ENDPOINTS, config } from "../environment";
import {
    CreateInvoiceRequest,
    GSTCalculationRequest,
    GSTCalculationResponse,
    InvoiceResponse,
    TrademarkCheckRequest,
    TrademarkCheckResponse,
} from "../types";
import apiClient from "./api-client";

class ToolsService {
  // ============ GST Calculation ============

  /**
   * Calculate GST
   */
  async calculateGST(
    data: GSTCalculationRequest,
  ): Promise<GSTCalculationResponse> {
    try {
      const response = await apiClient.post<{ data: GSTCalculationResponse }>(
        API_ENDPOINTS.CALCULATE_GST,
        data,
      );
      return response.data.data;
    } catch (error: any) {
      console.error("GST calculation error:", error.response?.data);
      throw error;
    }
  }

  // ============ Trademark Checking ============

  /**
   * Check trademark availability
   */
  async checkTrademark(
    data: TrademarkCheckRequest,
  ): Promise<TrademarkCheckResponse> {
    try {
      const params: any = { name: data.trademark };
      if (data.country) params.country = data.country;
      if (data.classes && data.classes.length > 0) params.class = data.classes[0];

      const response = await apiClient.get<any>(
        API_ENDPOINTS.CHECK_TRADEMARK,
        { params },
      );

      let resp = response.data || {};

      // Some endpoints may wrap payload in `data` field
      if (resp.data && typeof resp.data === "object") {
        resp = resp.data;
      }

      // Debug log to help trace what's returned
      if (config.DEBUG) {
        console.log("[toolsService] checkTrademark response:", resp);
      }

      const results = (resp.results || []).map((r: any) => ({
        id: r.application_number || r._id || r.id || "",
        name: r.brand_name || r.name || "",
        owner: r.owner || "Unknown",
        status: r.status || "available",
        class: r.class || r.trademarkClass || "",
        registrationDate: r.filed_date || r.registration_date,
      }));

      return {
        trademark: data.trademark,
        available: !!resp.available,
        results,
        suggestions: resp.suggestions || [],
      } as TrademarkCheckResponse;
    } catch (error: any) {
      console.error("Trademark check error:", error.response?.data || error.message);
      throw error;
    }
  }

  // ============ Invoice Generation ============

  /**
   * Generate GST Invoice
   */
  async generateInvoice(data: CreateInvoiceRequest): Promise<InvoiceResponse> {
    try {
      const response = await apiClient.post<InvoiceResponse>(
        API_ENDPOINTS.GENERATE_INVOICE,
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("Invoice generation error:", error.response?.data);
      throw error;
    }
  }

  // ============ Challan Generation ============

  /**
   * Generate Delivery Challan
   */
  async generateChallan(data: any): Promise<any> {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.GENERATE_CHALLAN,
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("Challan generation error:", error.response?.data);
      throw error;
    }
  }

  // ============ Local Calculations (No API needed) ============

  /**
   * Calculate GST locally without API call
   * Useful for real-time calculations while typing
   */
  calculateGSTLocally(
    amount: number,
    gstRate: number,
    discount: number = 0,
  ): GSTCalculationResponse {
    const discountAmount = amount * (discount / 100);
    const baseAmount = amount - discountAmount;
    const gstAmount = baseAmount * (gstRate / 100);
    const totalAmount = baseAmount + gstAmount;

    return {
      baseAmount,
      gstAmount,
      discountAmount,
      totalAmount,
      breakdown: {
        sgst: gstAmount / 2, // For intra-state
        cgst: gstAmount / 2, // For intra-state
      },
    };
  }

  /**
   * Validate trademark name
   */
  isValidTrademark(name: string): boolean {
    const minLength = 2;
    const maxLength = 100;
    const validPattern = /^[a-zA-Z0-9\s\-&().,]*$/;

    return (
      name.length >= minLength &&
      name.length <= maxLength &&
      validPattern.test(name)
    );
  }
}

export default new ToolsService();
