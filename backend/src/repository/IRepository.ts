/**
 * Paginated response envelope returned by findAll.
 */
export interface PagedResult<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Base repository interface that every concrete repository implements.
 * F = filter shape (e.g. { day?: string; page?: number; limit?: number }),
 * defaults to object.
 */
export interface IRepository<T, CreateDto, UpdateDto, F = object> {
  findAll(filter?: F): Promise<PagedResult<T>>;
  findById(id: number): Promise<T | null>;
  create(dto: CreateDto): Promise<T>;
  update(id: number, dto: UpdateDto): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
