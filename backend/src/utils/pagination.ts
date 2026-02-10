export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  page: number;
  totalPages: number;
  data: T[];
}

export const paginate = (page: number = 1, limit: number = 20) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

export const paginatedResponse = <T>(
  data: T[],
  count: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  return {
    success: true,
    count,
    page,
    totalPages: Math.ceil(count / limit),
    data
  };
};
