-- Create the tables for the S&P 500 database.
-- They contain information about the companies 
-- in the S&P 500 stock market index
-- during some interval of time in 2014-2015.
-- https://en.wikipedia.org/wiki/S%26P_500 

create table history
(
	symbol text,
	day date,
	open numeric,
	high numeric,
	low numeric,
	close numeric,
	volume integer,
	adjclose numeric
);

create table sp500
(
	symbol text,
	security text,
	sector text,
	subindustry text,
	address text,
	state text
);

-- Populate the tables
insert into history select * from bob.history;
insert into sp500 select * from bob.sp500;

-- Familiarize yourself with the tables.
select * from history;
select * from sp500;

-- Exercise 1 (3 pts)

-- 1. (1 pts) Find the number of companies for each state, sort descending by the number.

-- Write your query here.
SELECT COUNT(security) as Number_of_companies, state
FROM sp500
GROUP BY state
ORDER BY Number_of_companies DESC;


-- 2. (1 pts) Find the number of companies for each sector, sort descending by the number.

-- Write your query here.
SELECT COUNT(*) as Number_of_companies, sector
FROM sp500
GROUP BY sector
ORDER BY Number_of_companies DESC;


-- 3. (1 pts) Order the days of the week by their average volatility.
-- Sort descending by the average volatility. 
-- Use 100*abs(high-low)/low to measure daily volatility.

-- Write your query here.
-- /*recall, stock market not open on weekends*/
SELECT
    EXTRACT(dow from day) as days,
    AVG(100*abs((high - low)/low)) AS avg_volatility
FROM history
GROUP BY days
ORDER BY avg_volatility DESC;


/*For the exercises 2 and 3, since we were doing windows, i thought it was better to create
  tables*/

-- Exercise 2 (4 pts)

-- 1. (2 pts) Find for each symbol and day the pct change from the previous business day.
-- Order descending by pct change. Use adjclose.
-- Note: I've created 3 columns, prev_adj is for part one and prev_adj2 and post_adj is part 2
CREATE TABLE windowE2 AS
SELECT
    symbol,
    adjclose,
    day,
    LAG(adjclose,1) OVER (PARTITION BY symbol ORDER BY day) AS prev_adj,
    LAG(adjclose, 20) OVER (PARTITION BY symbol ORDER BY day) AS prev_adj2,
    LEAD(adjclose, 20) OVER (PARTITION BY symbol ORDER BY day) AS post_adj
FROM history
GROUP BY day, symbol, adjclose;

Drop table windowE2;

-- Write your query here.

SELECT symbol, day, (100*(adjclose-prev_adj)/prev_adj) AS pct_change, prev_adj, adjclose
FROM windowE2
WHERE prev_adj IS NOT NULL
ORDER BY pct_change DESC;

Drop table windowE2;

-- 2. (2 pts)
-- Many traders believe in buying stocks in uptrend
-- in order to maximize their chance of profit. 
-- Let us check this strategy.
-- Find for each symbol on Oct 1, 2015 
-- the pct change 20 trading days earlier and 20 trading days later.
-- Order descending by pct change with respect to 20 trading days earlier.
-- Use adjclose.

-- Expected result
--symbol,pct_change,pct_change2
--TE,26.0661102331371252,3.0406725557250169
--TAP,24.6107784431137725,5.1057184046131667
--CVC,24.4688922610015175,-0.67052727826882048156
--...

-- Write your query here.
SELECT
    symbol,
    (100*(adjclose-prev_adj2)/prev_adj2) AS pct_change,
    (100*(post_adj-adjclose)/adjclose) AS pct_change2
FROM windowE2
WHERE prev_adj IS NOT NULL AND to_char(day, 'MM DD YYYY') = '10 01 2015'
ORDER BY pct_change DESC;

Drop table windowE2;

-- Exercise 3 (3 pts)
-- Find the top 10 symbols with respect to their average money volume AVG(volume*adjclose).
-- Use round(..., -8) on the average money volume.
-- Give three versions of your query, using ROW_NUMBER(), RANK(), and DENSE_RANK().

-- Write your query here.

Create Table history_ranking AS
SELECT
    symbol,
    round(AVG(volume*adjclose),-8) as average_money
FROM history
GROUP BY symbol;

Drop table history_ranking;

SELECT *
FROM (
     SELECT symbol, average_money,
       ROW_NUMBER() over (ORDER BY average_money DESC) AS rank
FROM history_ranking) x
WHERE rank <= 10;

SELECT *
FROM (
     SELECT symbol, average_money,
       DENSE_RANK() over (ORDER BY average_money DESC) AS rank
FROM history_ranking) x
WHERE rank <= 10;

SELECT *
FROM (
     SELECT symbol, average_money,
       rank() over (ORDER BY average_money DESC) AS rank
FROM history_ranking) x
WHERE rank <= 10;

Drop table history_ranking;

CREATE OR REPLACE VIEW A AS
    SELECT symbol, state, day, close, volume
    FROM history JOIN sp500 USING(symbol)
    ORDER BY day;

SELECT day
FROM A
WHERE day >= to_date('2015/01/01', 'YYYY/mm/dd');
