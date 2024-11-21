import { HttpResponse, HttpResponseResolver } from 'msw';

import titleListData from '../data/ticles/ticle-detail.json';
import ticleListData from '../data/ticles/ticle-list.json';

export type SortType = 'newest' | 'oldest' | 'trending';
export interface PaginationMeta {
  page: number;
  take: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

export const getTicle: HttpResponseResolver<{ ticleId: string }> = async ({ params }) => {
  const ticleId = params.ticleId as keyof typeof titleListData;

  const ticleData = titleListData[ticleId];

  if (!ticleData) {
    return HttpResponse.json({ status: 'error' }, { status: 404 });
  }

  const response = {
    status: 'success',
    data: ticleData,
  };

  return HttpResponse.json(response);
};

export const getTicleList: HttpResponseResolver = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 10;
  const isOpen = searchParams.get('isOpen') === 'true';
  const sort = (searchParams.get('sort') as SortType) || 'newest';

  let filteredTicleList = [...ticleListData];

  if (isOpen) {
    const now = new Date().toISOString();
    filteredTicleList = filteredTicleList.filter(
      (ticle) => new Date(ticle.startTime) > new Date(now)
    );
  }

  filteredTicleList.sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'trending':
        return b.applicantsCount - a.applicantsCount;
      default:
        return 0;
    }
  });

  const totalItems = filteredTicleList.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedTicleList = filteredTicleList.slice(startIndex, startIndex + pageSize);

  const response = {
    status: 'success',
    data: {
      ticles: paginatedTicleList,
      meta: {
        page,
        take: pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
      },
    },
  };

  return HttpResponse.json(response);
};

export const createTicle: HttpResponseResolver = async () => {
  return HttpResponse.json(
    {
      status: 'success',
      data: { ticleId: Math.floor(Math.random() * 1000) + 1 },
    },
    { status: 201 }
  );
};

export const applyTicle: HttpResponseResolver<{ ticleId: string }> = async ({ params }) => {
  const ticleId = Number(params.ticleId);

  const ticle = ticleListData.find((ticle) => ticle.id === ticleId);

  if (!ticle) {
    return HttpResponse.json({ status: 'error' }, { status: 404 });
  }

  return HttpResponse.json({ status: 'success' }, { status: 201 });
};
