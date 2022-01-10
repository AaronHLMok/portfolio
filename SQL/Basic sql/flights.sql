--daily flights for some airline
create table flights (
    fno int,
    from_city varchar(20),
    to_city varchar(20),
    departure char(5),  --string in 24h format, from_city timezone
    arrival char(5)     --string in 24h format, to_city timezone
);

insert into flights values(1, 'Victoria', 'Toronto', '06:00', '13:00');
insert into flights values(2, 'Victoria', 'Vancouver', '06:00', '06:30');
insert into flights values(3, 'Victoria', 'Vancouver', '07:00', '07:30');
insert into flights values(4, 'Victoria', 'Vancouver', '08:00', '08:30');
insert into flights values(5, 'Victoria', 'Calgary', '09:00', '11:00');
insert into flights values(6, 'Victoria', 'Calgary', '12:00', '14:00');
insert into flights values(7, 'Vancouver', 'Toronto', '09:00', '14:00');
insert into flights values(8, 'Calgary', 'Toronto', '13:00', '18:00');


-- Q1
-- How many flights are there for each destination city (to_city)?
-- Show only cities with at least 2 flights a day.
-- Output city, number-of-flights pairs.
-- Sort them descending by the number-of-flights.


--Write your solution here
SELECT to_city, count(*) AS number_of_flights
FROM flights
GROUP BY to_city
HAVING COUNT(to_city) >= 2
ORDER BY number_of_flights;


-- Q2
-- Find all the possible flight routes from Victoria to Toronto with one stop.
-- The result should be fno1, fno2 pairs of flights.
-- Hint: The first flight must arrive earlier (no matter by how much)
-- than the second.


--Write your solution here
SELECT fno1.fno AS flight_one, fno2.fno AS flight_two
FROM
    (SELECT fno, to_city, from_city, arrival, departure FROM flights WHERE from_city = 'Victoria' GROUP BY fno, to_city, from_city, arrival, departure) fno1
        JOIN
    (SELECT fno, to_city, from_city, arrival, departure FROM flights WHERE to_city = 'Toronto' GROUP BY fno, to_city, from_city, arrival, departure) fno2
        ON fno1.to_city=fno2.from_city
WHERE fno1.arrival < fno2.departure;


-- Q3
-- Find the earliest flight (with respect to departure) for each direct route.
-- The result should be quadruples of the form (from_city, to_city, fno, departure).

--Write your solution here

SELECT x.from_city, x.to_city, x.fno, x.departure
FROM flights x
WHERE EXISTS(
    SELECT *
    FROM flights *
    WHERE to_city <> x.to_city);