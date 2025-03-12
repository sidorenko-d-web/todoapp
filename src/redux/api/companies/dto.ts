export type CompanyResponseDTO = {
  company_name: string;
  image_url: string;
  id: string;
  is_unique: boolean;
  growth_tree_stage: number;
}

export type CompaniesResponseDTO = {
  count: number
  campaigns: CompanyResponseDTO[];
};

export type CompaniesQueryRequestDTO = {
  company_name?: string;
  content_type?: string
  asc?: boolean;
  offset?: number;
  limit?: number;
  is_unique?: boolean;
}
