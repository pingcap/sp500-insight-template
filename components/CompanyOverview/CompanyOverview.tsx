import { FC, ReactNode } from 'react';
import { CompanyInfo } from '@/datasource/stocks';
import { SkeletonInline, SkeletonParagraph } from '@/components/Skeleton';

export interface CompanyOverviewProps {
  company?: CompanyInfo;
  children?: ReactNode;
}

const CompanyOverview: FC<CompanyOverviewProps> = ({ company, children }) => {
  return (
    <>
      <h1>
        <SkeletonInline>
          {company?.long_name}
        </SkeletonInline>
      </h1>
      <table className="text-left w-max whitespace-nowrap">
        <tbody>
        <tr>
          <th>Sector / Industry</th>
          <td>
            <SkeletonInline>
              {company && getSectorIndustryLine(company)}
            </SkeletonInline>
          </td>
        </tr>
        <tr>
          <th>Location</th>
          <td>
            <SkeletonInline>
              {company && getLocationLine(company)}
            </SkeletonInline>
          </td>
        </tr>
        <tr>
          <th>Full time employees</th>
          <td>
            <SkeletonInline>
              {company?.full_time_employees}
            </SkeletonInline>
          </td>
        </tr>
        <tr>
          <th>Market cap</th>
          <td>
            <SkeletonInline>
              {company?.market_cap}
            </SkeletonInline>
          </td>
        </tr>
        <tr>
          <th>Revenue growth</th>
          <td>
            <SkeletonInline>
              {company?.revenue_growth}
            </SkeletonInline>
          </td>
        </tr>
        <tr>
          <th>Ebitda</th>
          <td>
            <SkeletonInline>
              {company?.ebitda}
            </SkeletonInline>
          </td>
        </tr>
        </tbody>
      </table>
      {children}
      <p>
        <SkeletonParagraph>
          {company?.long_business_summary}
        </SkeletonParagraph>
      </p>
    </>
  );
};

export default CompanyOverview;

function getSectorIndustryLine (company: CompanyInfo) {
  return [company.sector, company.industry].join(' / ');
}

function getLocationLine (company: CompanyInfo) {
  return [company.city, company.state, company.country].filter(Boolean).join(', ');
}
