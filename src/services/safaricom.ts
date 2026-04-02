/**
 * Mock Safaricom M-Pesa API Service
 * In a real-world scenario, this would interact with Daraja API or a secure backend.
 */
export const safaricom_api = {
  /**
   * Verifies the M-Pesa PIN for a given user ID.
   * In this demo, the PIN is hardcoded to '1234' or checked against a stored value.
   */
  verify_pin: async (mpesaId: string, pin: string): Promise<boolean> => {
    console.log(`Verifying PIN for M-Pesa ID: ${mpesaId}`);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // For demo purposes, we accept '1234' as the correct PIN
    return pin === '1234';
  },

  /**
   * Simulates a name lookup for a recipient.
   */
  lookup_name: async (phone: string): Promise<string> => {
    // Mock names for common demo numbers
    const mockNames: Record<string, string> = {
      '0712345678': 'John Doe',
      '0787654321': 'Jane Smith',
      '0748561953': 'Official PayHub',
      '0722000000': 'Safaricom Customer'
    };
    return mockNames[phone] || 'Unknown Recipient';
  }
};