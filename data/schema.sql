CREATE TABLE IF NOT EXISTS indexes (
    index_symbol VARCHAR(10) NOT NULL COMMENT 'Index code',
    short_name VARCHAR(50) NOT NULL COMMENT 'Index name',
    PRIMARY KEY (index_symbol)
) COMMENT='Indexes';

CREATE TABLE IF NOT EXISTS index_compositions (
    index_symbol VARCHAR(10) NOT NULL COMMENT 'Index code',
    stock_symbol VARCHAR(10) NOT NULL COMMENT 'Stock code',
    weight DOUBLE NOT NULL DEFAULT 0 COMMENT 'Weight in the index',
    PRIMARY KEY (index_symbol, stock_symbol)
) COMMENT='Index compositions';

CREATE TABLE IF NOT EXISTS index_price_history (
    record_date DATE NOT NULL COMMENT 'Record date',
    index_symbol VARCHAR(10) NOT NULL COMMENT 'Index code',
    price DECIMAL(18,2) NOT NULL COMMENT 'Index price',
    PRIMARY KEY (record_date, index_symbol)
) COMMENT='Index price history';

CREATE TABLE IF NOT EXISTS stock_price_history (
    record_date DATE NOT NULL COMMENT 'Record date',
    stock_symbol VARCHAR(10) NOT NULL COMMENT 'Stock code',
    adj_close DECIMAL(32,16) NULL COMMENT 'Adjusted close price',
    close DECIMAL(32,16) NULL COMMENT 'Close price',
    high DECIMAL(32,16) NULL COMMENT 'High price',
    low DECIMAL(32,16) NULL COMMENT 'Low price',
    open DECIMAL(32,16) NULL COMMENT 'Open price',
    volume BIGINT NULL COMMENT 'Trading volume',
    PRIMARY KEY (record_date, stock_symbol)
) COMMENT='Stock price history';

CREATE TABLE IF NOT EXISTS companies (
    stock_symbol VARCHAR(10) NOT NULL COMMENT 'Stock code',
    exchange_symbol VARCHAR(50) NOT NULL COMMENT 'Exchange code',
    short_name VARCHAR(50) NULL COMMENT 'Company short name',
    long_name VARCHAR(100) NULL COMMENT 'Company full name',
    sector VARCHAR(50) NULL COMMENT 'Industry sector',
    industry VARCHAR(50) NULL COMMENT 'Industry',
    current_price DECIMAL(18,2) NULL COMMENT 'Current stock price',
    market_cap BIGINT NULL COMMENT 'Market capitalization',
    ebitda BIGINT NULL COMMENT 'Earnings before interest, taxes, depreciation, and amortization',
    revenue_growth FLOAT NULL COMMENT 'Revenue growth',
    city VARCHAR(50) NULL COMMENT 'City',
    state VARCHAR(50) NULL COMMENT 'State/Province',
    country VARCHAR(50) NULL COMMENT 'Country',
    country_code VARCHAR(3) NULL COMMENT 'Country code',
    full_time_employees INT NULL COMMENT 'Number of full-time employees',
    long_business_summary TEXT NULL COMMENT 'Company description',
    PRIMARY KEY (stock_symbol)
) COMMENT='Companies';

CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL COMMENT 'User ID' AUTO_INCREMENT,
    created_date DATETIME NOT NULL COMMENT 'Creation date',
    PRIMARY KEY (user_id)
) COMMENT='Users';

CREATE TABLE IF NOT EXISTS user_selected_stocks (
    user_id INT NOT NULL COMMENT 'User ID',
    stock_symbol VARCHAR(10) NOT NULL COMMENT 'Stock code',
    created_date DATETIME NOT NULL COMMENT 'Creation date',
    PRIMARY KEY (user_id, stock_symbol)
) COMMENT='User selected stocks';
