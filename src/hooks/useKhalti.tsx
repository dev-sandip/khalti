

import { PaymentInitiateResponse, PaymentLookupResponse, PaymentRequest } from "@/types/khalti";
import { KHALTI_CONFIG, khaltiClient } from "@/services/khalti/config";
import { useState } from "react";

type UseKhaltiOptions = {
  onSuccess?: (response: PaymentLookupResponse) => void;
  onError?: (error: Error) => void;
  autoRedirect?: boolean;
};

export function useKhalti({ onSuccess, onError, autoRedirect = true }: UseKhaltiOptions = {}) {
  const [pidx, setPidx] = useState<string | null>(null);
  const [initiationError, setInitiationError] = useState<Error | null>(null);
  const [statusError, setStatusError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initiate = async (data: PaymentRequest) => {
    setIsLoading(true);
    setInitiationError(null);

    try {
      const response = await khaltiClient.post<PaymentInitiateResponse>(
        `${KHALTI_CONFIG.baseUrl}/epayment/initiate/`,
        data
      );

      const paymentResponse = response.data;
      setPidx(paymentResponse.pidx);

      if (autoRedirect) {
        window.location.href = paymentResponse.payment_url;
      }

      return paymentResponse;
    } catch (error) {
      setInitiationError(error as Error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!pidx) {
      throw new Error('Payment ID not found');
    }

    setIsLoading(true);
    setStatusError(null);

    try {
      const response = await khaltiClient.post<PaymentLookupResponse>(
        `${KHALTI_CONFIG.baseUrl}/epayment/lookup/`,
        { pidx }
      );

      const paymentStatus = response.data;
      if (paymentStatus.status === 'Completed') {
        onSuccess?.(paymentStatus);
      }

      return paymentStatus;
    } catch (error) {
      setStatusError(error as Error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiate,
    checkPaymentStatus,
    pidx,
    initiationError,
    statusError,
    isLoading,
  };
}


