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
  total_available?: number;
  has_more?: boolean;
  offset?: number;
  limit?: number;
  total_records_harvested?: number;
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

export interface OAIAsyncImportResponse {
  success: boolean;
  message: string;
  task_id: string;
  status: string;
  error?: string;
}

export interface OAIAsyncImportTaskInfo {
  task_id: string;
  set_spec: string;
  carrera_id: number;
  metadata_prefix: string;
  status: string; // queued, running, completed, failed
  created_at: string;
  started_at?: string;
  completed_at?: string;
  progress: number; // 0-100 percentage
  imported_count: number;
  processed_records: number;
  total_records?: number;
  message?: string;
  error?: string;
}

export interface OAIAsyncImportStatusResponse {
  success: boolean;
  task_info: OAIAsyncImportTaskInfo;
  error?: string;
}

export interface OAIRecordCountResponse {
  success: boolean;
  message: string;
  set_spec: string;
  total_count: number;
  metadata_prefix: string;
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
 * Get records for a specific OAI set with pagination support
 */
export const getOAIRecordsBySet = async (
  setSpec: string, 
  options?: {
    limit?: number;
    offset?: number;
    includeTotalCount?: boolean;
    metadataPrefix?: string;
  }
): Promise<OAIRecordsResponse> => {
  try {
    const params = new URLSearchParams();
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.offset) params.append("offset", options.offset.toString());
    if (options?.includeTotalCount) params.append("includeTotalCount", "true");
    if (options?.metadataPrefix) params.append("metadataPrefix", options.metadataPrefix);
    
    const url = `/oai/records/set/${setSpec}${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axiosInstance.get<OAIRecordsResponse>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching OAI records:", error);
    throw error;
  }
};

/**
 * Legacy function for backward compatibility - gets all records without pagination
 */
export const getAllOAIRecordsBySet = async (setSpec: string): Promise<OAIRecordData[]> => {
  try {
    const response = await getOAIRecordsBySet(setSpec);
    return response.records || [];
  } catch (error) {
    console.error("Error fetching all OAI records:", error);
    throw error;
  }
};

/**
 * Get record count for a specific OAI set
 */
export const getOAIRecordCount = async (
  setSpec: string,
  options?: {
    metadataPrefix?: string;
    forceRefresh?: boolean;
  }
): Promise<number> => {
  try {
    const params = new URLSearchParams();
    if (options?.metadataPrefix) params.append("metadataPrefix", options.metadataPrefix);
    if (options?.forceRefresh) params.append("forceRefresh", "true");
    
    const url = `/oai/records/count/${setSpec}${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axiosInstance.get<OAIRecordCountResponse>(url);
    return response.data.total_count;
  } catch (error) {
    console.error("Error fetching OAI record count:", error);
    throw error;
  }
};

/**
 * Import OAI records as temas for a specific carrera (synchronous)
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

/**
 * Start asynchronous import of OAI records as temas
 */
export const startAsyncOAIImport = async (
  setSpec: string, 
  carreraId: number,
  metadataPrefix: string = "oai_dc"
): Promise<OAIAsyncImportResponse> => {
  try {
    const params = new URLSearchParams({
      setSpec: setSpec,
      carreraId: carreraId.toString(),
      metadataPrefix: metadataPrefix
    });
    
    const response = await axiosInstance.post<OAIAsyncImportResponse>(
      `/oai/import/async?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error starting async OAI import:", error);
    throw error;
  }
};

/**
 * Get status of an asynchronous import task
 */
export const getAsyncImportStatus = async (taskId: string): Promise<OAIAsyncImportTaskInfo> => {
  try {
    const response = await axiosInstance.get<OAIAsyncImportStatusResponse>(
      `/oai/import/status/${taskId}`
    );
    return response.data.task_info;
  } catch (error) {
    console.error("Error fetching async import status:", error);
    throw error;
  }
};

/**
 * Poll async import status until completion
 */
export const pollAsyncImportStatus = async (
  taskId: string,
  onProgress?: (taskInfo: OAIAsyncImportTaskInfo) => void,
  intervalMs: number = 2000
): Promise<OAIAsyncImportTaskInfo> => {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const taskInfo = await getAsyncImportStatus(taskId);
        
        if (onProgress) {
          onProgress(taskInfo);
        }
        
        if (taskInfo.status === "completed") {
          resolve(taskInfo);
        } else if (taskInfo.status === "failed") {
          reject(new Error(taskInfo.error || "Import failed"));
        } else {
          // Continue polling for queued or running status
          setTimeout(poll, intervalMs);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    poll();
  });
};