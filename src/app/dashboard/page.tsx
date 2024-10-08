'use client';

import * as React from 'react';
// import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import type { Company } from '@/types/companies';

// import { config } from '@/config';

// import { Budget } from '@/components/dashboard/overview/budget';
// import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
// import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
// import { TotalProfit } from '@/components/dashboard/overview/total-profit';

import { CompaniesTable } from './CompaniesTable';
import { MainChart } from './MainChart';

// const serviceAccountAuth = new JWT({
//   email: 'pbr-tracker-admin@pbr-tracker.iam.gserviceaccount.com',
//   key: 'bcd6fb383e05f3ef83b49f959ccd68bd58211ceb',
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID!, serviceAccountAuth);

// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page() {
  const [page, setPage] = React.useState(0);

  const { data: companies = [], isLoading: isCompanyNamesLoading } = useQuery({
    queryKey: ['companyNames'],
    queryFn: () => axios.get<Company[]>('/api/companies').then((data) => data.data),
  });

  const companyNames = companies.map((company) => company.name);

  return (
    <Grid container spacing={3}>
      {/* <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid> */}
      <Grid lg={9} xs={12}>
        <MainChart
          chartSeries={[
            { name: 'PBR', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'EPS', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={3} xs={12}>
        <CompaniesTable
          loading={isCompanyNamesLoading}
          rows={companyNames.map((name) => ({
            id: name,
            name,
          }))}
          page={page}
          rowsPerPage={10}
          onPageChange={setPage}
        />
      </Grid>
      {/* <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid> */}
      {/* <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
            {
              id: 'PRD-004',
              name: 'Necessaire Body Lotion',
              image: '/assets/product-4.png',
              updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-003',
              name: 'Ritual of Sakura',
              image: '/assets/product-3.png',
              updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-002',
              name: 'Lancome Rouge',
              image: '/assets/product-2.png',
              updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
            },
            {
              id: 'PRD-001',
              name: 'Erbology Aloe Vera',
              image: '/assets/product-1.png',
              updatedAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={[
            {
              id: 'ORD-007',
              customer: { name: 'Ekaterina Tankova' },
              amount: 30.5,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-006',
              customer: { name: 'Cao Yu' },
              amount: 25.1,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-004',
              customer: { name: 'Alexa Richardson' },
              amount: 10.99,
              status: 'refunded',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-003',
              customer: { name: 'Anje Keizer' },
              amount: 96.43,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-002',
              customer: { name: 'Clarke Gillebert' },
              amount: 32.54,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-001',
              customer: { name: 'Adam Denisov' },
              amount: 16.76,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid> */}
    </Grid>
  );
}
