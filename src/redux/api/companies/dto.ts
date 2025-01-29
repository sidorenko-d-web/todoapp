export type CompanyResponseDTO = {
  company_name: string;
  image_url: string;
  id: string;
}

export type CompaniesResponseDTO = {
  count: number
  campaigns: CompanyResponseDTO[];
};

export type CompaniesQueryRequestDTO = {
  company_name?: string;
  asc?: boolean;
  offset?: number;
  limit?: number;
}
