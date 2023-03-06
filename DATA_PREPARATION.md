# Data Preparation

## Steps

1. Download the history archive data of S&P 500 stocks from Kaggle to the `data/sp500` folder:

   ```bash
   cd data/sp500
   wget https://www.kaggle.com/datasets/andrewmvd/sp-500-stocks/versions/337
   ```

2. Prepare a TiDB serverless cluster.

   You can follow the [TiDB Cloud Quick Start](https://docs.pingcap.com/tidbcloud/tidb-cloud-quickstart) to create a TiDB serverless cluster.

3. Run script to create table schema defined in [`fixtures/schema.sql`](data/schema.sql):

   ```bash
   export DATABASE_URL=mysql://<username>:<password>@gateway01.us-west-2.prod.aws.tidbcloud.com:4000/sp500insight?timezone=Z
   pnpm run cli:create-schema
   ```
   
4. Run script to ETL data from CSV files to database:

    ```bash
    pnpm run cli:csv-to-db
    ```
   
5. Using dumpling to dump data from TiDB and upload to AWS S3.

   ```bash
   tiup dumpling --host gateway01.us-west-2.prod.aws.tidbcloud.com --port 4000 --user <username> --password <password> --filetype sql --filter 'sp500insight.*' -o "s3://tidb-cloud-demos/sp500insight"
   ```
   