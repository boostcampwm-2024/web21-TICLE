export const getDashboardTicleList = async (params: GetDashboardListQueryType) => {
  return request<DashboardListResponse>({
    method: 'GET',
    url: '/dashboard',
    params,
    schema: DashboardListResponseSchema,
  });
};
