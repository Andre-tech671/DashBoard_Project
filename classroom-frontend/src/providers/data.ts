import { DataProvider, BaseRecord, GetListParams, GetListResponse, GetOneResponse } from "@refinedev/core";
import { MOCK_SUBJECTS } from "../constants/mock-data";

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>(
    params: GetListParams
  ): Promise<GetListResponse<TData>> => {
    const { resource } = params;
    if (resource !== "subjects") {
      return { data: [] as TData[], total: 0 };
    }

    // return mock subject list when resource is subjects
    return {
      data: MOCK_SUBJECTS as unknown as TData[],
      total: MOCK_SUBJECTS.length,
    };
  },

  getOne: async () => {throw new Error("This function is not present in mock.") }, 
  create: async () => {throw new Error("This function is not present in the mock")},
  update: async () => {throw new Error("This function is not present in the mock")},
  deleteOne: async () => {throw new Error("This func is not present in Mock")},
  deleteMany: async () => {throw new Error("This func is not present in Mock")}
};
 

