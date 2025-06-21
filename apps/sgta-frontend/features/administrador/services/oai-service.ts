import axiosInstance from "@/lib/axios/axios-instance";

export interface OAIEndpointRequest {
  endpoint: string;
}

export interface OAIEndpointData {
  endpoint: string;
  description?: string;
  active?: boolean;
}

export interface OAIEndpointResponse {
  endpoint: OAIEndpointData;
  success: boolean;
}

export interface OAISetData {
  setSpec: string;
  setName: string;
  setDescription: string;
}

export interface OAISetsResponse {
  sets: OAISetData[];
  success: boolean;
}

export interface OAIRecordMetadata {
  title: string;
  creator?: string | string[];
  subject?: string | string[];
  description?: string;
  publisher?: string;
  contributor?: string | string[];
  date?: string;
  type?: string;
  format?: string;
  identifier?: string;
  source?: string | null;
  language?: string;
  relation?: string | null;
  coverage?: string | null;
  rights?: string;
}

export interface OAIRecordData {
  identifier: string;
  datestamp: string;
  setSpec: string;
  metadata: OAIRecordMetadata;
}

export interface OAIRecordsResponse {
  records: OAIRecordData[];
  success: boolean;
}

export interface OAIImportRequest {
  setSpec: string;
  carreraId: number;
}

export interface OAIImportResponse {
  message: string;
  imported: number;
  success: boolean;
}

/**
 * Get the current OAI endpoint configuration
 */
export const getCurrentOAIEndpoint = async (): Promise<string> => {
  try {
    const response = await axiosInstance.get<OAIEndpointResponse>("/oai/config/endpoint");
    
    // Extract endpoint from the nested response structure
    return response.data.endpoint?.endpoint || "";
  } catch (error) {
    console.error("Error fetching OAI endpoint:", error);
    throw error;
  }
};

/**
 * Update the OAI endpoint configuration
 */
export const updateOAIEndpoint = async (endpoint: string): Promise<void> => {
  try {
    const payload: OAIEndpointRequest = { endpoint };
    await axiosInstance.put("/oai/config/endpoint", payload);
  } catch (error) {
    console.error("Error updating OAI endpoint:", error);
    throw error;
  }
};

/**
 * Get all available OAI sets
 */
export const getOAISets = async (): Promise<OAISetData[]> => {
  try {
    const response = await axiosInstance.get<OAISetsResponse>("/oai/sets");
    return response.data.sets || [];
  } catch (error) {
    console.error("Error fetching OAI sets:", error);
    throw error;
  }
};

/**
 * Get records for a specific OAI set
 */
export const getOAIRecordsBySet = async (setSpec: string): Promise<OAIRecordData[]> => {
  try {
    const response = await axiosInstance.get<OAIRecordsResponse>(`/oai/records/set/${setSpec}`);
    return response.data.records || [];
  } catch (error) {
    console.error("Error fetching OAI records:", error);
    throw error;
  }
};

/**
 * Import OAI records as temas for a specific carrera
 */
export const importOAITemas = async (setSpec: string, carreraId: number): Promise<OAIImportResponse> => {
  try {
    const response = await axiosInstance.post<OAIImportResponse>("/oai/import/temas", null, {
      params: { setSpec, carreraId }
    });
    return response.data;
  } catch (error) {
    console.error("Error importing OAI temas:", error);
    throw error;
  }
};